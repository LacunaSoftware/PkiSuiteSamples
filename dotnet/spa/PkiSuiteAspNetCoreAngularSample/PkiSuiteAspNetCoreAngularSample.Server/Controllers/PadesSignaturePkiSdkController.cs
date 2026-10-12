using Lacuna.Pki;
using Lacuna.Pki.Pades;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// PAdES signature with PKI SDK (sample "pades-signature-pki-sdk").
/// </summary>
/// <remarks>
/// The signature takes two steps on this server, with Web PKI signing in the browser in between
/// (see samples/pades-signature-pki-sdk in the Angular project):
///
/// 1. start: the browser sends the signer's certificate. We prepare the signature and return the
///    hash that must be signed with the certificate's private key (the "to-sign hash").
/// 2. complete: the browser sends the signature of that hash, computed by Web PKI. We finish the
///    signature and store the signed PDF.
///
/// The private key never leaves the user's computer: this server only sees the certificate (which
/// is public) and the signature value.
/// </remarks>
[ApiController]
[Route("api/pades-signature-pki-sdk")]
public class PadesSignaturePkiSdkController(
	StorageMock storageMock,
	Util util,
	PadesVisualElements padesVisualElements
) : ControllerBase {

	/// <summary>
	/// The signature policy: a basic PAdES signature, whose signer certificate must chain up to one
	/// of the roots trusted by Util.GetTrustArbitrator() (ICP-Brasil, plus Lacuna's test PKI in
	/// Development).
	/// </summary>
	private IPadesPolicyMapper GetSignaturePolicy() {
		return PadesPoliciesForGeneration.GetPadesBasic(util.GetTrustArbitrator());
	}

	// POST api/pades-signature-pki-sdk/start
	[HttpPost("start")]
	public ActionResult<PadesSignaturePkiSdkStartResponse> Start(PadesSignaturePkiSdkStartRequest request) {
		// Get the path of the PDF to be signed (uploaded by the user or copied from a sample
		// document, see FilesController).
		if (!storageMock.TryGetFile(request.FileId, out var pdfPath)) {
			return Problem(detail: "The file to be signed was not found", statusCode: StatusCodes.Status404NotFound);
		}

		byte[] toSignBytes, transferData;
		SignatureAlgorithm signatureAlgorithm;
		try {
			// Decode the signer's certificate, read by Web PKI on the browser.
			var certificate = PKCertificate.Decode(request.CertContent);

			// Validate the certificate now: it must chain up to a trusted root, be within its
			// validity period and not be revoked. PadesSigner validates it only on the complete
			// step, and we don't want to ask the user to sign with a certificate we'll reject.
			var certificateValidationResults = certificate.Validate(util.GetTrustArbitrator());
			if (!certificateValidationResults.IsValid) {
				throw new ValidationException(certificateValidationResults);
			}

			var padesSigner = new PadesSigner();

			// Set the PDF to be signed.
			padesSigner.SetPdfToSign(pdfPath);

			// Set the signer's certificate.
			padesSigner.SetSigningCertificate(certificate);

			// Set the signature policy.
			padesSigner.SetPolicy(GetSignaturePolicy());

			// Set the visual representation of the signature (see PadesVisualElements.cs).
			padesSigner.SetVisualRepresentation(padesVisualElements.GetVisualRepresentationForPkiSdk(certificate));

			// Generate the "to-sign bytes". This also yields the signature algorithm that the
			// browser must use, as well as the "transfer data", which the complete step needs.
			toSignBytes = padesSigner.GetToSignBytes(out signatureAlgorithm, out transferData);

		} catch (ValidationException ex) {
			// The certificate is not valid: for instance, it is expired, revoked or not trusted.
			// Stop here, so the browser does not ask the user to sign.
			return Problem(
				title: "The signer's certificate is not valid",
				detail: ex.ValidationResults.ToString(),
				statusCode: StatusCodes.Status422UnprocessableEntity
			);
		}

		return new PadesSignaturePkiSdkStartResponse(
			// The transfer data stays on this server. The browser gets only an id for it, which it
			// sends back on the complete step.
			TransferDataId: storageMock.StoreTransferData(transferData),
			// Web PKI signs a hash, so we hash the to-sign bytes with the digest algorithm of the
			// signature algorithm chosen by the policy.
			ToSignHash: signatureAlgorithm.DigestAlgorithm.ComputeHash(toSignBytes),
			DigestAlgorithmOid: signatureAlgorithm.DigestAlgorithm.Oid
		);
	}

	// POST api/pades-signature-pki-sdk/complete
	[HttpPost("complete")]
	public ActionResult<PadesSignaturePkiSdkCompleteResponse> Complete(PadesSignaturePkiSdkCompleteRequest request) {
		// Get back the transfer data stored on the start step. Each transfer data can be used once.
		byte[] transferData;
		try {
			transferData = storageMock.ReadTransferData(request.TransferDataId);
		} catch (FileNotFoundException) {
			return Problem(
				detail: "The signature was not started or was already completed. Please sign again.",
				statusCode: StatusCodes.Status422UnprocessableEntity
			);
		}

		byte[] signedPdf;
		try {
			var padesSigner = new PadesSigner();

			// Set the signature policy, which must be the same one used on the start step.
			padesSigner.SetPolicy(GetSignaturePolicy());

			// Set the signature computed by Web PKI and the transfer data.
			padesSigner.SetPreComputedSignature(request.Signature, transferData);

			// Finish the signature. This checks the signature value against the to-sign bytes and
			// validates the signer's certificate again.
			padesSigner.ComputeSignature();

			signedPdf = padesSigner.GetPadesSignature();

		} catch (ValidationException ex) {
			return Problem(
				title: "The signature is not valid",
				detail: ex.ValidationResults.ToString(),
				statusCode: StatusCodes.Status422UnprocessableEntity
			);
		}

		// Store the signed PDF. In a real application, you'd store it in your database or blob
		// storage.
		return new PadesSignaturePkiSdkCompleteResponse(storageMock.Store(signedPdf, ".pdf"));
	}
}

/// <param name="FileId">The PDF to be signed (a file id from FilesController).</param>
/// <param name="CertContent">The signer's certificate (DER, Base64 in JSON), read by Web PKI.</param>
public record PadesSignaturePkiSdkStartRequest(string FileId, byte[] CertContent);

/// <param name="TransferDataId">Id of the transfer data kept on the server, for the complete step.</param>
/// <param name="ToSignHash">The hash to be signed by Web PKI (Base64 in JSON).</param>
/// <param name="DigestAlgorithmOid">The digest algorithm Web PKI must use to sign the hash.</param>
public record PadesSignaturePkiSdkStartResponse(string TransferDataId, byte[] ToSignHash, string DigestAlgorithmOid);

/// <param name="TransferDataId">The id returned by the start step.</param>
/// <param name="Signature">The signature of the to-sign hash, computed by Web PKI (Base64 in JSON).</param>
public record PadesSignaturePkiSdkCompleteRequest(string TransferDataId, byte[] Signature);

/// <param name="SignedFileId">The signed PDF, to download from GET api/files/{fileId}.</param>
public record PadesSignaturePkiSdkCompleteResponse(string SignedFileId);
