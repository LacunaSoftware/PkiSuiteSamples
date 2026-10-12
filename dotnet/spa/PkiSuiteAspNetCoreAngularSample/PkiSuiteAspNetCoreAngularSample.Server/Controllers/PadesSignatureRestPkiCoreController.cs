using Lacuna.RestPki.Api;
using Lacuna.RestPki.Api.Signature;
using Lacuna.RestPki.Client;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// PAdES signature with Rest PKI Core (sample "pades-signature-rest-pki-core").
/// </summary>
/// <remarks>
/// The signature takes two steps, with Web PKI signing in the browser in between (see
/// samples/pades-signature-rest-pki-core in the Angular project):
///
/// 1. start: the browser sends the signer's certificate. Rest PKI Core prepares the signature and
///    returns the hash that must be signed with the certificate's private key (the "to-sign
///    hash"), plus a "state" string that it needs to complete the signature.
/// 2. complete: the browser sends the state back with the signature of that hash, computed by Web
///    PKI. Rest PKI Core finishes the signature and we store the signed PDF.
///
/// The private key never leaves the user's computer: neither this server nor Rest PKI Core sees it.
/// </remarks>
[ApiController]
[Route("api/pades-signature-rest-pki-core")]
public class PadesSignatureRestPkiCoreController(
	StorageMock storageMock,
	Util util,
	PadesVisualElements padesVisualElements
) : ControllerBase {

	// POST api/pades-signature-rest-pki-core/start
	[HttpPost("start")]
	public async Task<ActionResult<PadesSignatureRestPkiCoreStartResponse>> Start(PadesSignatureRestPkiCoreStartRequest request) {
		if (!util.IsRestPkiCoreConfigured) {
			return RestPkiCoreNotConfigured();
		}

		// Get the path of the PDF to be signed (uploaded by the user or copied from a sample
		// document, see FilesController).
		if (!storageMock.TryGetFile(request.FileId, out var pdfPath)) {
			return Problem(detail: "The file to be signed was not found.", statusCode: StatusCodes.Status404NotFound);
		}

		// Get a Rest PKI Core client (see Util.cs).
		var restPkiService = util.GetRestPkiService();

		var options = new PrepareSignatureOptions() {
			SignatureType = SignatureTypes.Pdf,
			// The security context determines which root certification authorities are trusted
			// when Rest PKI Core validates the signer's certificate (see Util.GetSecurityContextId).
			SecurityContextId = util.GetSecurityContextId(),
			PdfSignatureOptions = new PdfSignatureOptions() {
				// Set the visual representation of the signature (see PadesVisualElements.cs).
				VisualRepresentation = padesVisualElements.GetVisualRepresentationForRestPkiCore(),
			},
		};

		PrepareSignatureResult result;
		try {
			// Send the PDF and the signer's certificate (read by Web PKI on the browser) to Rest
			// PKI Core.
			result = await restPkiService.PrepareSignatureAsync(
				FileReference.FromFile(pdfPath, Path.GetFileName(pdfPath)),
				CertificateReference.FromBytes(request.CertContent),
				options
			);
		} catch (PrepareSignatureException ex) {
			// Rest PKI Core could not prepare the signature: for instance, the certificate is not
			// valid or not trusted ("CertificateValidationFailed"), or the PDF is corrupted. Stop
			// here, so the browser does not ask the user to sign.
			return Problem(
				detail: $"The signature could not be prepared ({ex.Failure}).",
				statusCode: StatusCodes.Status422UnprocessableEntity,
				// The validation results, when there are any, tell why. The page shows them below the
				// message.
				extensions: new Dictionary<string, object?> { ["validationResults"] = ex.ValidationResults?.ToString() }
			);
		}

		return new PadesSignatureRestPkiCoreStartResponse(
			// The state goes to the browser and comes back on the complete step.
			State: result.State,
			// The hash to be signed by Web PKI, and the digest algorithm it must use.
			ToSignHash: result.ToSign.Hash,
			DigestAlgorithmOid: result.ToSign.SignatureAlgorithm.DigestAlgorithm.Oid
		);
	}

	// POST api/pades-signature-rest-pki-core/complete
	[HttpPost("complete")]
	public async Task<ActionResult<PadesSignatureRestPkiCoreCompleteResponse>> Complete(PadesSignatureRestPkiCoreCompleteRequest request) {
		if (!util.IsRestPkiCoreConfigured) {
			return RestPkiCoreNotConfigured();
		}

		var restPkiService = util.GetRestPkiService();

		Document document;
		try {
			// Send the state from the start step and the signature computed by Web PKI.
			document = await restPkiService.CompleteSignatureAsync(request.State, request.Signature);
		} catch (ValidationException ex) {
			// For instance, the signature does not match the to-sign hash, or the certificate was
			// revoked in the meantime.
			return Problem(
				detail: "The signature is not valid.",
				statusCode: StatusCodes.Status422UnprocessableEntity,
				extensions: new Dictionary<string, object?> { ["validationResults"] = ex.ValidationResults.ToString() }
			);
		}

		// At this point, you'd typically store the signed PDF on your database. Rest PKI Core keeps
		// it only for a while, so we download it and store it with our StorageMock class.
		using var signedPdf = await document.SignedFile.OpenReadAsync();
		return new PadesSignatureRestPkiCoreCompleteResponse(storageMock.Store(signedPdf, ".pdf"));
	}

	private ObjectResult RestPkiCoreNotConfigured() {
		return Problem(
			detail: "The Rest PKI Core API key is not set. Set RestPkiCore:ApiKey in appsettings.json.",
			statusCode: StatusCodes.Status503ServiceUnavailable
		);
	}
}

/// <param name="FileId">The PDF to be signed (a file id from FilesController).</param>
/// <param name="CertContent">The signer's certificate (DER, Base64 in JSON), read by Web PKI.</param>
public record PadesSignatureRestPkiCoreStartRequest(string FileId, byte[] CertContent);

/// <param name="State">Rest PKI Core's state for this signature, to send back on the complete step.</param>
/// <param name="ToSignHash">The hash to be signed by Web PKI (Base64 in JSON).</param>
/// <param name="DigestAlgorithmOid">The digest algorithm Web PKI must use to sign the hash.</param>
public record PadesSignatureRestPkiCoreStartResponse(string State, byte[] ToSignHash, string DigestAlgorithmOid);

/// <param name="State">The state returned by the start step.</param>
/// <param name="Signature">The signature of the to-sign hash, computed by Web PKI (Base64 in JSON).</param>
public record PadesSignatureRestPkiCoreCompleteRequest(string State, byte[] Signature);

/// <param name="SignedFileId">The signed PDF, to download from GET api/files/{fileId}.</param>
public record PadesSignatureRestPkiCoreCompleteResponse(string SignedFileId);
