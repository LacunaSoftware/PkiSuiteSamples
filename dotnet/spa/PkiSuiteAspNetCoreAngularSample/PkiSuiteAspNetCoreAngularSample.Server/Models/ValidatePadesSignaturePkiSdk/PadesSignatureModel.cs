using Lacuna.Pki;
using Lacuna.Pki.Cades;
using Lacuna.Pki.Pades;

namespace PkiSuiteAspNetCoreAngularSample.Models.ValidatePadesSignaturePkiSdk;

// What the validate-pades-signature-pki-sdk sample sends to the browser. The shape follows the
// Rest PKI Core signature-inspection response, so both validation samples render the same way.

public record OpenPadesSignatureRequest(string FileId);

public record PadesSignatureModel(List<SignerModel> Signers);

public record SignerModel(
	CertificateModel? Certificate,
	DateTimeOffset? SigningTime,
	// The signing time attested by a timestamp, as opposed to the signer's own clock.
	DateTimeOffset? CertifiedDateReference,
	DigestAlgorithmAndValueModel? MessageDigest,
	SignaturePolicyIdentifierModel? SignaturePolicy,
	List<TimestampModel> Timestamps,
	ValidationResultsModel ValidationResults
) {
	public static SignerModel From(PadesSignerInfo padesSigner, ValidationResults validationResults) {
		var signer = padesSigner.Signer;

		DateTimeOffset? certifiedDateReference = null;
		try {
			var dateReference = signer.GetDateReference(out var isCertified);
			if (isCertified) {
				certifiedDateReference = dateReference;
			}
		} catch {
			// The signature has no usable date reference. The validation results report why.
		}

		return new SignerModel(
			Certificate: signer.SigningCertificate is { } certificate ? CertificateModel.From(certificate) : null,
			// PAdES keeps the signing time in the PDF's signature dictionary, not in the CMS signature.
			SigningTime: padesSigner.SigningTime ?? signer.SigningTime,
			CertifiedDateReference: certifiedDateReference,
			MessageDigest: signer.DigestAlgorithm != null && signer.MessageDigest != null
				? new DigestAlgorithmAndValueModel(signer.DigestAlgorithm.Name, Convert.ToHexString(signer.MessageDigest))
				: null,
			// An implicit policy is no policy at all: the signature does not name one.
			SignaturePolicy: signer.SignaturePolicy is { IsImplicit: false } policy
				? new SignaturePolicyIdentifierModel(policy.Oid)
				: null,
			Timestamps: signer.SignatureTimeStamps.Select(TimestampModel.From).ToList(),
			ValidationResults: ValidationResultsModel.From(validationResults)
		);
	}
}

public record CertificateModel(
	string? SubjectCommonName,
	string? SubjectDisplayName,
	string? EmailAddress,
	string? IssuerDisplayName,
	DateTimeOffset ValidityStart,
	DateTimeOffset ValidityEnd,
	PkiBrazilCertificateModel? PkiBrazil
) {
	public static CertificateModel From(PKCertificate certificate) => new(
		SubjectCommonName: certificate.SubjectName?.CommonName,
		SubjectDisplayName: certificate.SubjectDisplayName,
		EmailAddress: certificate.EmailAddress,
		IssuerDisplayName: certificate.IssuerDisplayName,
		ValidityStart: certificate.ValidityStart,
		ValidityEnd: certificate.ValidityEnd,
		PkiBrazil: certificate.PkiBrazil is { } fields ? PkiBrazilCertificateModel.From(fields) : null
	);
}

// The fields ICP-Brasil certificates carry (CPF, CNPJ, ...). Most are empty on any given certificate.
public record PkiBrazilCertificateModel(
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
	public static PkiBrazilCertificateModel From(IcpBrasilCertificateFields fields) => new(
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

public record DigestAlgorithmAndValueModel(string Algorithm, string HexValue);

public record SignaturePolicyIdentifierModel(string Oid);

public record TimestampModel(DateTimeOffset GenTime, string SerialNumber) {
	public static TimestampModel From(CadesTimestamp timestamp) =>
		new(timestamp.GenTime, timestamp.TstInfo.SerialNumber.ToString());
}

public record ValidationResultsModel(
	List<ValidationItemModel> PassedChecks,
	List<ValidationItemModel> Warnings,
	List<ValidationItemModel> Errors
) {
	public static ValidationResultsModel From(ValidationResults results) => new(
		results.PassedChecks.ConvertAll(ValidationItemModel.From),
		results.Warnings.ConvertAll(ValidationItemModel.From),
		results.Errors.ConvertAll(ValidationItemModel.From)
	);
}

// One check, such as "the signer's certificate is not expired". Certificate checks carry the
// checks of the certificate chain in InnerValidationResults.
public record ValidationItemModel(string Type, string Message, string? Detail, ValidationResultsModel? InnerValidationResults) {
	public static ValidationItemModel From(ValidationItem item) => new(
		item.Type.ToString(),
		item.Message,
		item.Detail,
		item.InnerValidationResults is { } inner ? ValidationResultsModel.From(inner) : null
	);
}
