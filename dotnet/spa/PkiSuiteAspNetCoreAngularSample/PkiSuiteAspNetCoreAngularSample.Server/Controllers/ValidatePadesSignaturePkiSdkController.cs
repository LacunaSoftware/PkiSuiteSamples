using Lacuna.Pki;
using Lacuna.Pki.Cades;
using Lacuna.Pki.Pades;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// Opens a signed PDF and validates each of its signatures with PKI SDK, on this server (sample
/// "validate-pades-signature-pki-sdk"). There is no Web PKI in this sample: the PDF was signed
/// beforehand, and nobody signs anything here.
/// </summary>
[ApiController]
[Route("api/validate-pades-signature-pki-sdk")]
public class ValidatePadesSignaturePkiSdkController(StorageMock storageMock, Util util) : ControllerBase {

	// POST api/validate-pades-signature-pki-sdk/open
	[HttpPost("open")]
	public ActionResult<ValidatePadesSignaturePkiSdkOpenResponse> Open(ValidatePadesSignaturePkiSdkOpenRequest request) {
		if (!storageMock.TryGetFile(request.FileId, out var path)) {
			return Problem(detail: "The file to be validated was not found.", statusCode: StatusCodes.Status404NotFound);
		}

		// Open the PDF and read its signatures.
		PadesSignature signature;
		try {
			signature = PadesSignature.Open(System.IO.File.ReadAllBytes(path));
		} catch (Exception ex) when (ex is InvalidPdfException or PasswordProtectedPdfException or PdfHandlerException) {
			// The file is not a PDF, is corrupted or is password-protected.
			return Problem(detail: $"The file could not be opened as a signed PDF: {ex.Message}", statusCode: StatusCodes.Status422UnprocessableEntity);
		}

		// The validation policy says which checks a signature must pass and which root
		// certificates are trusted (the trust arbitrator: ICP-Brasil, plus Lacuna's test PKI in
		// Development, see Util.GetTrustArbitrator()). "PAdES Basic" accepts any PAdES signature.
		// To demand the ICP-Brasil signature policies, use PadesPoliciesForValidation.GetPkiBrazil().
		var policyMapper = PadesPoliciesForValidation.GetPadesBasic(util.GetTrustArbitrator());

		// Validate each signer separately: one signature may be valid and the next one not.
		var signers = signature.Signers
			.Select(signer => ValidatePadesSignaturePkiSdkSignerModel.From(signer, signature.ValidateSignature(signer, policyMapper)))
			.ToList();

		return new ValidatePadesSignaturePkiSdkOpenResponse(signers);
	}
}

// What this sample sends to the browser. The shape follows the Rest PKI Core signature-inspection
// response, so both validation samples render the same way.

/// <param name="FileId">The signed PDF to validate (a file id from FilesController).</param>
public record ValidatePadesSignaturePkiSdkOpenRequest(string FileId);

public record ValidatePadesSignaturePkiSdkOpenResponse(List<ValidatePadesSignaturePkiSdkSignerModel> Signers);

public record ValidatePadesSignaturePkiSdkSignerModel(
	ValidatePadesSignaturePkiSdkCertificateModel? Certificate,
	DateTimeOffset? SigningTime,
	// The signing time attested by a timestamp, as opposed to the signer's own clock.
	DateTimeOffset? CertifiedDateReference,
	ValidatePadesSignaturePkiSdkDigestAlgorithmAndValueModel? MessageDigest,
	ValidatePadesSignaturePkiSdkSignaturePolicyModel? SignaturePolicy,
	List<ValidatePadesSignaturePkiSdkTimestampModel> Timestamps,
	ValidatePadesSignaturePkiSdkValidationResultsModel ValidationResults
) {
	public static ValidatePadesSignaturePkiSdkSignerModel From(PadesSignerInfo padesSigner, ValidationResults validationResults) {
		var signer = padesSigner.Signer;
		return new ValidatePadesSignaturePkiSdkSignerModel(
			Certificate: signer.SigningCertificate is { } certificate ? ValidatePadesSignaturePkiSdkCertificateModel.From(certificate) : null,
			// PAdES keeps the signing time in the PDF's signature dictionary, not in the CMS signature.
			SigningTime: padesSigner.SigningTime ?? signer.SigningTime,
			// Only a signature with a signature timestamp has a certified date reference.
			CertifiedDateReference: signer.SignatureTimeStamps.Count > 0 ? signer.GetDateReference(out _) : null,
			MessageDigest: signer.DigestAlgorithm != null && signer.MessageDigest != null
				? new ValidatePadesSignaturePkiSdkDigestAlgorithmAndValueModel(signer.DigestAlgorithm.Name, Convert.ToHexString(signer.MessageDigest))
				: null,
			// An implicit policy is no policy at all: the signature does not name one.
			SignaturePolicy: signer.SignaturePolicy is { IsImplicit: false } policy
				? new ValidatePadesSignaturePkiSdkSignaturePolicyModel(policy.Oid)
				: null,
			Timestamps: signer.SignatureTimeStamps.Select(ValidatePadesSignaturePkiSdkTimestampModel.From).ToList(),
			ValidationResults: ValidatePadesSignaturePkiSdkValidationResultsModel.From(validationResults)
		);
	}
}

public record ValidatePadesSignaturePkiSdkCertificateModel(
	string? SubjectCommonName,
	string? SubjectDisplayName,
	string? EmailAddress,
	string? IssuerDisplayName,
	DateTimeOffset ValidityStart,
	DateTimeOffset ValidityEnd,
	ValidatePadesSignaturePkiSdkPkiBrazilModel? PkiBrazil
) {
	public static ValidatePadesSignaturePkiSdkCertificateModel From(PKCertificate certificate) => new(
		SubjectCommonName: certificate.SubjectName?.CommonName,
		SubjectDisplayName: certificate.SubjectDisplayName,
		EmailAddress: certificate.EmailAddress,
		IssuerDisplayName: certificate.IssuerDisplayName,
		ValidityStart: certificate.ValidityStart,
		ValidityEnd: certificate.ValidityEnd,
		PkiBrazil: certificate.PkiBrazil is { } fields ? ValidatePadesSignaturePkiSdkPkiBrazilModel.From(fields) : null
	);
}

// The fields ICP-Brasil certificates carry (CPF, CNPJ, ...). Most are empty on any given certificate.
public record ValidatePadesSignaturePkiSdkPkiBrazilModel(
	string? CertificateType,
	string? Cpf,
	string? Cnpj,
	string? Responsavel,
	string? CompanyName,
	string? OabNumero,
	string? OabUF,
	string? RgNumero,
	string? RgEmissor,
	string? RgEmissorUF
) {
	public static ValidatePadesSignaturePkiSdkPkiBrazilModel From(IcpBrasilCertificateFields fields) => new(
		CertificateType: fields.CertificateType.ToString(),
		Cpf: fields.CPF,
		Cnpj: fields.Cnpj,
		Responsavel: fields.Responsavel,
		CompanyName: fields.CompanyName,
		OabNumero: fields.OabNumero,
		OabUF: fields.OabUF,
		RgNumero: fields.RGNumero,
		RgEmissor: fields.RGEmissor,
		RgEmissorUF: fields.RGEmissorUF
	);
}

public record ValidatePadesSignaturePkiSdkDigestAlgorithmAndValueModel(string Algorithm, string HexValue);

public record ValidatePadesSignaturePkiSdkSignaturePolicyModel(string Oid);

public record ValidatePadesSignaturePkiSdkTimestampModel(DateTimeOffset GenTime, string SerialNumber) {
	public static ValidatePadesSignaturePkiSdkTimestampModel From(CadesTimestamp timestamp) =>
		new(timestamp.GenTime, timestamp.TstInfo.SerialNumber.ToString());
}

public record ValidatePadesSignaturePkiSdkValidationResultsModel(
	List<ValidatePadesSignaturePkiSdkValidationItemModel> PassedChecks,
	List<ValidatePadesSignaturePkiSdkValidationItemModel> Warnings,
	List<ValidatePadesSignaturePkiSdkValidationItemModel> Errors
) {
	public static ValidatePadesSignaturePkiSdkValidationResultsModel From(ValidationResults results) => new(
		results.PassedChecks.ConvertAll(ValidatePadesSignaturePkiSdkValidationItemModel.From),
		results.Warnings.ConvertAll(ValidatePadesSignaturePkiSdkValidationItemModel.From),
		results.Errors.ConvertAll(ValidatePadesSignaturePkiSdkValidationItemModel.From)
	);
}

// One check, such as "the signer's certificate is not expired". Certificate checks carry the
// checks of the certificate chain in InnerValidationResults.
public record ValidatePadesSignaturePkiSdkValidationItemModel(
	string Type,
	string Message,
	string? Detail,
	ValidatePadesSignaturePkiSdkValidationResultsModel? InnerValidationResults
) {
	public static ValidatePadesSignaturePkiSdkValidationItemModel From(ValidationItem item) => new(
		item.Type.ToString(),
		item.Message,
		item.Detail,
		item.InnerValidationResults is { } inner ? ValidatePadesSignaturePkiSdkValidationResultsModel.From(inner) : null
	);
}
