using Lacuna.Pki.Pades;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;
using PkiSuiteAspNetCoreAngularSample.Models.ValidatePadesSignaturePkiSdk;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// Opens a signed PDF and validates each of its signatures with PKI SDK, on this server. There is
/// no Web PKI in this sample: the PDF was signed beforehand, and nobody signs anything here.
/// </summary>
[ApiController]
[Route("api/validate-pades-signature-pki-sdk")]
public class ValidatePadesSignaturePkiSdkController(StorageMock storageMock, Util util) : ControllerBase {

	// POST api/validate-pades-signature-pki-sdk/open
	[HttpPost("open")]
	public ActionResult<PadesSignatureModel> Open(OpenPadesSignatureRequest request) {
		if (!storageMock.TryGetFile(request.FileId, out var path)) {
			return NotFound();
		}

		// Open the PDF and read its signatures.
		PadesSignature signature;
		try {
			signature = PadesSignature.Open(path);
		} catch (Exception ex) {
			return Problem(detail: $"The file could not be opened as a signed PDF: {ex.Message}", statusCode: StatusCodes.Status422UnprocessableEntity);
		}

		// The validation policy says which checks a signature must pass and which root
		// certificates are trusted (the trust arbitrator: ICP-Brasil, plus Lacuna's test PKI in
		// Development, see Util.GetTrustArbitrator()). "PAdES Basic" accepts any PAdES signature.
		// To demand the ICP-Brasil signature policies, use PadesPoliciesForValidation.GetPkiBrazil().
		var policyMapper = PadesPoliciesForValidation.GetPadesBasic(util.GetTrustArbitrator());

		// Validate each signer separately: one signature may be valid and the next one not.
		var signers = signature.Signers
			.Select(signer => SignerModel.From(signer, signature.ValidateSignature(signer, policyMapper)))
			.ToList();

		return new PadesSignatureModel(signers);
	}
}
