namespace PkiSuiteAspNetCoreAngularSample.Models.ValidatePadesSignatureRestPkiCore;

// The request and response of Rest PKI Core's PUT api/signature-inspection, reduced to the fields
// this sample uses (see https://core.pki.rest/swagger, tag SignatureInspection). Enum values are
// kept as strings, so a value added to the API later does not break deserialization.
//
// The package Lacuna.RestPkiCore.Api has the complete models (namespace
// Lacuna.RestPki.Api.SignatureInspection) if you need every field.

public record OpenPadesSignatureRequest(string FileId);

// What the browser receives.
public record PadesSignatureModel(List<SignerModel> Signers);

#region PUT api/signature-inspection

public record InspectSignatureRequest(FileReferenceModel File, bool Validate, Guid? SecurityContextId);

// A file sent to Rest PKI Core: its content (Base64 in JSON), or a URL Rest PKI Core can download.
public record FileReferenceModel(byte[] Content, string MimeType, string? Name);

public record InspectSignatureResponse(bool Success, string? Failure, List<SignerModel>? Signers);

public record SignerModel(
	CertificateModel? Certificate,
	DateTimeOffset? SigningTime,
	// The signing time attested by a timestamp, as opposed to the signer's own clock.
	DateTimeOffset? CertifiedDateReference,
	DigestAlgorithmAndValueModel? MessageDigest,
	SignaturePolicyIdentifierModel? SignaturePolicy,
	List<TimestampModel>? Timestamps,
	ValidationResultsModel? ValidationResults
);

public record CertificateModel(
	string? SubjectCommonName,
	string? SubjectDisplayName,
	string? EmailAddress,
	string? IssuerDisplayName,
	DateTimeOffset ValidityStart,
	DateTimeOffset ValidityEnd,
	PkiBrazilCertificateModel? PkiBrazil
);

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
);

public record DigestAlgorithmAndValueModel(string Algorithm, string? HexValue);

public record SignaturePolicyIdentifierModel(string Oid);

public record TimestampModel(DateTimeOffset GenTime, string? SerialNumber);

public record ValidationResultsModel(
	List<ValidationItemModel> PassedChecks,
	List<ValidationItemModel> Warnings,
	List<ValidationItemModel> Errors
);

// One check, such as "the signer's certificate is not expired". Certificate checks carry the
// checks of the certificate chain in InnerValidationResults.
public record ValidationItemModel(string Type, string Message, string? Detail, ValidationResultsModel? InnerValidationResults);

// The body of a Rest PKI Core error response (ErrorModelV2).
public record ErrorModel(string? Code, string? Message, string? Detail);

#endregion
