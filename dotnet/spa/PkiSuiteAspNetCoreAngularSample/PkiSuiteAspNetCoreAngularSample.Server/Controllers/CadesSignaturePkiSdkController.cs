using System.Text.Json;
using Lacuna.Pki;
using Lacuna.Pki.Cades;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// CAdES signature with PKI SDK (sample "cades-signature-pki-sdk"). Signs any file, producing an
/// attached CMS signature (.p7s) that contains the signed file. It can also co-sign an existing
/// .p7s, that is, add a signature to it.
/// </summary>
/// <remarks>
/// The signature takes two steps on this server, with Web PKI signing in the browser in between
/// (see cades-signature-pki-sdk.ts):
/// 1. start: the browser sends the user's certificate (never the private key), and this server
///    returns the hash to be signed with the certificate's private key;
/// 2. complete: the browser sends the signature value, and this server assembles the CMS signature.
/// </remarks>
[ApiController]
[Route("api/cades-signature-pki-sdk")]
public class CadesSignaturePkiSdkController(StorageMock storageMock, Util util) : ControllerBase {

	// POST api/cades-signature-pki-sdk/start
	[HttpPost("start")]
	public ActionResult<CadesSignaturePkiSdkStartResponse> Start(CadesSignaturePkiSdkStartRequest request) {

		// Get the file to be signed (or the CMS signature to be co-signed) from the storage.
		if (!storageMock.TryGetFile(request.FileId, out var filePath)) {
			return Problem(detail: "The file to be signed was not found.", statusCode: StatusCodes.Status404NotFound);
		}
		var fileContent = System.IO.File.ReadAllBytes(filePath);

		byte[] toSignBytes;
		SignatureAlgorithm signatureAlg;
		try {
			// Decode the user's certificate, read in the browser by Web PKI.
			var cert = PKCertificate.Decode(request.CertContent);

			// Instantiate a CadesSigner and set the file to be signed (or co-signed), the signer's
			// certificate and the signature policy.
			using var cadesSigner = new CadesSigner();
			var problem = SetFileToSign(cadesSigner, fileContent, request.Cosign);
			if (problem != null) {
				return problem;
			}
			if (request.Cosign && IsSignedBy(fileContent, cert)) {
				// A co-signature with a certificate that already signed the file does not add a
				// signer: the .p7s would still have one signature per certificate.
				return Problem(detail: "This file is already signed with the chosen certificate. Choose another certificate to co-sign it.", statusCode: StatusCodes.Status422UnprocessableEntity);
			}
			cadesSigner.SetSigningCertificate(cert);
			cadesSigner.SetPolicy(GetSignaturePolicy());

			// Generate the "to-sign-bytes". This method also yields the signature algorithm that must
			// be used on the browser, based on the signature policy and the certificate's key.
			toSignBytes = cadesSigner.GenerateToSignBytes(out signatureAlg);

		} catch (ValidationException ex) {
			// The steps above throw a ValidationException if, for instance, the certificate is
			// expired or not trusted. Answering with an error (instead of a "success: false" body) makes
			// sure the browser never goes on to sign.
			return Problem(
				detail: "The signer's certificate is not valid.",
				statusCode: StatusCodes.Status422UnprocessableEntity,
				// The validation results tell why. The page shows them below the message.
				extensions: new Dictionary<string, object?> { ["validationResults"] = ex.ValidationResults.ToString() }
			);
		}

		// Unlike PAdES signatures, CAdES signatures have no PKI SDK "transfer data". The complete
		// step needs the to-sign bytes, the certificate and the file instead. We keep them on this
		// server, as transfer data, and send the browser only an id to retrieve them. In a real
		// application, you'd store this in your database or cache, tied to the user's session.
		var state = new CadesSignatureState(request.FileId, request.Cosign, request.CertContent, toSignBytes);
		var transferDataId = storageMock.StoreTransferData(JsonSerializer.SerializeToUtf8Bytes(state));

		return new CadesSignaturePkiSdkStartResponse(
			TransferDataId: transferDataId,
			// The browser signs this hash with the certificate's private key (Web PKI's signHash).
			ToSignHash: signatureAlg.DigestAlgorithm.ComputeHash(toSignBytes),
			DigestAlgorithmOid: signatureAlg.DigestAlgorithm.Oid
		);
	}

	// POST api/cades-signature-pki-sdk/complete
	[HttpPost("complete")]
	public ActionResult<CadesSignaturePkiSdkCompleteResponse> Complete(CadesSignaturePkiSdkCompleteRequest request) {

		// Recover what the start step stored. Each id can be used only once.
		CadesSignatureState? state;
		try {
			state = JsonSerializer.Deserialize<CadesSignatureState>(storageMock.ReadTransferData(request.TransferDataId));
		} catch (FileNotFoundException) {
			state = null;
		}
		if (state == null) {
			return Problem(detail: "The signature was not started or was already completed. Please sign again.", statusCode: StatusCodes.Status422UnprocessableEntity);
		}
		if (!storageMock.TryGetFile(state.FileId, out var filePath)) {
			return Problem(detail: "The file to be signed was not found.", statusCode: StatusCodes.Status404NotFound);
		}
		var fileContent = System.IO.File.ReadAllBytes(filePath);

		byte[] signatureContent;
		try {
			// Instantiate a CadesSigner and set everything as on the start step: the same file, the
			// same certificate and the same policy.
			using var cadesSigner = new CadesSigner();
			var problem = SetFileToSign(cadesSigner, fileContent, state.Cosign);
			if (problem != null) {
				return problem;
			}
			cadesSigner.SetSigningCertificate(PKCertificate.Decode(state.CertContent));
			cadesSigner.SetPolicy(GetSignaturePolicy());

			// Set the signature value computed in the browser, along with the to-sign bytes it was
			// computed on.
			cadesSigner.SetPrecomputedSignature(request.Signature, state.ToSignBytes);

			// Call ComputeSignature(), which does all the work, including the validation of the
			// signer's certificate and of the resulting signature.
			cadesSigner.ComputeSignature();

			// Get the signature (the .p7s file content).
			signatureContent = cadesSigner.GetSignature();

		} catch (ValidationException ex) {
			// ComputeSignature() throws a ValidationException if, for instance, the certificate is
			// revoked or the signature value does not match the certificate.
			return Problem(
				detail: "The signature is not valid.",
				statusCode: StatusCodes.Status422UnprocessableEntity,
				extensions: new Dictionary<string, object?> { ["validationResults"] = ex.ValidationResults.ToString() }
			);
		}

		// Store the signature in the App_Data folder. In a real application, you'd store it in your
		// database or blob storage.
		return new CadesSignaturePkiSdkCompleteResponse(storageMock.Store(signatureContent, ".p7s"));
	}

	/// <summary>
	/// Sets the file to be signed, or the CMS signature to be co-signed. Returns an error to answer
	/// with if the file cannot be co-signed.
	/// </summary>
	private ObjectResult? SetFileToSign(CadesSigner cadesSigner, byte[] fileContent, bool cosign) {
		if (!cosign) {
			cadesSigner.SetDataToSign(fileContent);
			return null;
		}
		bool hasEncapsulatedContent;
		try {
			hasEncapsulatedContent = cadesSigner.SetSignatureToCoSign(fileContent);
		} catch (InvalidCadesSignatureException) {
			return Problem(detail: "The file to co-sign is not a CMS signature.", statusCode: StatusCodes.Status422UnprocessableEntity);
		}
		if (!hasEncapsulatedContent) {
			// A detached signature does not contain the signed file, so co-signing it would also
			// need that file (CadesSigner.SetDataToSign). This sample only produces attached
			// signatures, so it only co-signs those.
			return Problem(detail: "The CMS signature to co-sign is detached (it does not contain the signed file). This sample co-signs only attached signatures.", statusCode: StatusCodes.Status422UnprocessableEntity);
		}
		return null;
	}

	/// <summary>
	/// Whether a CMS signature already has a signer with the given certificate.
	/// </summary>
	private static bool IsSignedBy(byte[] cmsContent, PKCertificate cert) {
		return CadesSignature.Open(cmsContent).Signers
			.Any(signer => signer.SigningCertificate?.ThumbprintSHA256.SequenceEqual(cert.ThumbprintSHA256) == true);
	}

	/// <summary>
	/// Returns the signature policy: ICP-Brasil's AD-RB (basic signature with a policy reference),
	/// with the trust arbitrator from Util.GetTrustArbitrator().
	/// </summary>
	private ICadesPolicyMapper GetSignaturePolicy() {
		// The AD-RB policy trusts only the ICP-Brasil roots. We replace its trust arbitrator with
		// ours, which is also ICP-Brasil, plus Lacuna Software's test PKI when the
		// PkiSuite:TrustLacunaTestRoot setting is on (in appsettings.Development.json only).
		return new TrustArbitratorPolicyMapper(CadesPoliciesForGeneration.GetPkiBrazilAdrBasica(), util.GetTrustArbitrator());
	}

	/// <summary>
	/// Wraps a CAdES policy mapper, replacing the trust arbitrator of the policies it returns.
	/// </summary>
	private class TrustArbitratorPolicyMapper(ICadesPolicyMapper policyMapper, ITrustArbitrator trustArbitrator) : ICadesPolicyMapper {
		public CadesPolicySpec GetPolicy(PKCertificate certificate) {
			var policy = policyMapper.GetPolicy(certificate);
			policy.ClearTrustArbitrator();
			policy.AddTrustArbitrator(trustArbitrator);
			return policy;
		}
	}

	/// <summary>
	/// What the complete step needs from the start step, kept on the server.
	/// </summary>
	private record CadesSignatureState(string FileId, bool Cosign, byte[] CertContent, byte[] ToSignBytes);
}

/// <param name="FileId">The file to sign, or the .p7s to co-sign (see FilesController).</param>
/// <param name="CertContent">The user's certificate (Base64 in JSON), read by Web PKI.</param>
/// <param name="Cosign">True to add a signature to the CMS signature in FileId.</param>
public record CadesSignaturePkiSdkStartRequest(string FileId, byte[] CertContent, bool Cosign);

/// <param name="TransferDataId">Id of the data the complete step needs, kept on the server.</param>
/// <param name="ToSignHash">The hash to sign in the browser (Base64 in JSON).</param>
/// <param name="DigestAlgorithmOid">The digest algorithm Web PKI must sign the hash with.</param>
public record CadesSignaturePkiSdkStartResponse(string TransferDataId, byte[] ToSignHash, string DigestAlgorithmOid);

/// <param name="TransferDataId">The id returned by the start step.</param>
/// <param name="Signature">The signature value computed by Web PKI (Base64 in JSON).</param>
public record CadesSignaturePkiSdkCompleteRequest(string TransferDataId, byte[] Signature);

/// <param name="SignedFileId">The .p7s file, to download from FilesController.</param>
public record CadesSignaturePkiSdkCompleteResponse(string SignedFileId);
