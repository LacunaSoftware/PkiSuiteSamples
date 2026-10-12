using Lacuna.RestPki.Api;
using Lacuna.RestPki.Api.Signature;
using Lacuna.RestPki.Client;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// CAdES signature with Rest PKI Core (sample "cades-signature-rest-pki-core"). Signs any file,
/// producing an attached CMS signature (.p7s) that contains the signed file.
/// </summary>
/// <remarks>
/// The signature takes two steps on this server, with Web PKI signing in the browser in between
/// (see cades-signature-rest-pki-core.ts):
/// 1. start: the browser sends the user's certificate (never the private key), and Rest PKI Core
///    prepares the signature, returning the hash to be signed and the signature state;
/// 2. complete: the browser sends the signature value and the state back, and Rest PKI Core
///    finishes the signature.
///
/// This sample only signs new documents. Unlike the PKI SDK sample, it does not co-sign an
/// existing .p7s: the Rest PKI Core API (v5.0.4, client Lacuna.RestPkiCore.Client 5.0.0) has no
/// co-signature option for CMS signatures (CmsSignatureOptions has only Detached, DataFile and
/// DataHashes).
/// </remarks>
[ApiController]
[Route("api/cades-signature-rest-pki-core")]
public class CadesSignatureRestPkiCoreController(StorageMock storageMock, Util util) : ControllerBase {

	// POST api/cades-signature-rest-pki-core/start
	[HttpPost("start")]
	public async Task<ActionResult<CadesSignatureRestPkiCoreStartResponse>> Start(CadesSignatureRestPkiCoreStartRequest request) {

		// Get the file to be signed from the storage.
		if (!storageMock.TryGetFile(request.FileId, out var filePath)) {
			return Problem(detail: "The file to be signed was not found.", statusCode: StatusCodes.Status404NotFound);
		}

		// Get the Rest PKI Core client (see Util.GetRestPkiService()).
		var restPkiService = util.GetRestPkiService();

		// Reference the file to be signed. The client sends its content to Rest PKI Core.
		//
		// We send it as "application/octet-stream" whatever its type. When a file is sent as a PDF
		// (FileReference.FromFile picks the MIME type from the file name), Rest PKI Core rewrites the
		// PDF before signing it, even on a CMS signature (it comes back with a PDF/A output intent,
		// and PdfSignatureOptions.ConvertToPdfA = false does not prevent it), so the .p7s would
		// contain a different PDF from the one the user chose. As an octet stream, the signature
		// contains the file exactly as it is.
		using var fileStream = System.IO.File.OpenRead(filePath);
		var fileReference = FileReference.FromStream(fileStream, request.FileId, "application/octet-stream");

		// Reference the user's certificate, read in the browser by Web PKI.
		var certificateReference = CertificateReference.FromBytes(request.CertContent);

		var options = new PrepareSignatureOptions() {
			// A CMS (CAdES) signature.
			SignatureType = SignatureTypes.Cms,
			// Not detached: the signature contains the signed file (its "encapsulated content").
			CmsSignatureOptions = new CmsSignatureOptions() {
				Detached = false,
			},
			// The security context determines which certificates are trusted (see
			// Util.GetSecurityContextId()).
			SecurityContextId = util.GetSecurityContextId(),
		};

		PrepareSignatureResult result;
		try {
			// Prepare the signature. This yields the "to-sign hash", the digest algorithm the browser
			// must use, and the signature state.
			result = await restPkiService.PrepareSignatureAsync(fileReference, certificateReference, options);
		} catch (PrepareSignatureException ex) {
			// Rest PKI Core refuses to prepare the signature if, for instance, the certificate is
			// expired or not trusted in the security context. Answering with an error (instead of a
			// "success: false" body) makes sure the browser never goes on to sign.
			return Problem(
				detail: $"The signature could not be prepared ({ex.Failure}).",
				statusCode: StatusCodes.Status422UnprocessableEntity,
				// The validation results, when there are any, tell why. The page shows them below the
				// message.
				extensions: new Dictionary<string, object?> { ["validationResults"] = ex.ValidationResults?.ToString() }
			);
		}

		return new CadesSignatureRestPkiCoreStartResponse(
			// The browser signs this hash with the certificate's private key (Web PKI's signHash).
			ToSignHash: result.ToSign.Hash,
			DigestAlgorithmOid: result.ToSign.SignatureAlgorithm.DigestAlgorithm.Oid,
			// The state goes to the browser and comes back on the complete step (Rest PKI Core keeps
			// nothing between the two steps).
			State: result.State
		);
	}

	// POST api/cades-signature-rest-pki-core/complete
	[HttpPost("complete")]
	public async Task<ActionResult<CadesSignatureRestPkiCoreCompleteResponse>> Complete(CadesSignatureRestPkiCoreCompleteRequest request) {

		var restPkiService = util.GetRestPkiService();

		Document signedDocument;
		try {
			// Complete the signature with the state from the start step and the signature value
			// computed in the browser. Rest PKI Core validates the signer's certificate and the
			// resulting signature.
			signedDocument = await restPkiService.CompleteSignatureAsync(request.State, request.Signature);
		} catch (Lacuna.RestPki.Client.ValidationException ex) {
			// Rest PKI Core throws a ValidationException if, for instance, the certificate is revoked.
			return Problem(
				detail: "The signature is not valid.",
				statusCode: StatusCodes.Status422UnprocessableEntity,
				extensions: new Dictionary<string, object?> { ["validationResults"] = ex.ValidationResults.ToString() }
			);
		}

		// Store the signature (.p7s) in the App_Data folder. The signed file's URL on Rest PKI Core
		// is temporary, so download it now. In a real application, you'd store it in your database
		// or blob storage.
		string signedFileId;
		using (var stream = await signedDocument.SignedFile.OpenReadAsync()) {
			signedFileId = storageMock.Store(stream, ".p7s");
		}
		return new CadesSignatureRestPkiCoreCompleteResponse(signedFileId);
	}
}

/// <param name="FileId">The file to sign (see FilesController).</param>
/// <param name="CertContent">The user's certificate (Base64 in JSON), read by Web PKI.</param>
public record CadesSignatureRestPkiCoreStartRequest(string FileId, byte[] CertContent);

/// <param name="ToSignHash">The hash to sign in the browser (Base64 in JSON).</param>
/// <param name="DigestAlgorithmOid">The digest algorithm Web PKI must sign the hash with.</param>
/// <param name="State">The signature state, to send back on the complete step.</param>
public record CadesSignatureRestPkiCoreStartResponse(byte[] ToSignHash, string DigestAlgorithmOid, string State);

/// <param name="State">The state returned by the start step.</param>
/// <param name="Signature">The signature value computed by Web PKI (Base64 in JSON).</param>
public record CadesSignatureRestPkiCoreCompleteRequest(string State, byte[] Signature);

/// <param name="SignedFileId">The .p7s file, to download from FilesController.</param>
public record CadesSignatureRestPkiCoreCompleteResponse(string SignedFileId);
