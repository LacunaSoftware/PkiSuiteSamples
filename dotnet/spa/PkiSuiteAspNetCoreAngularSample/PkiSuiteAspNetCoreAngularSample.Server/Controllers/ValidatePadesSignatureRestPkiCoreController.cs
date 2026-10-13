using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// Opens a signed PDF and validates each of its signatures with Rest PKI Core (sample
/// "validate-pades-signature-rest-pki-core"). There is no Web PKI in this sample: the PDF was
/// signed beforehand, and nobody signs anything here.
/// </summary>
/// <remarks>
/// Lacuna.RestPkiCore.Client has no method for signature inspection, so this sample calls the API
/// endpoint (PUT api/signature-inspection) directly with HttpClient. The request and response
/// records are at the bottom of this file.
/// </remarks>
[ApiController]
[Route("api/validate-pades-signature-rest-pki-core")]
public class ValidatePadesSignatureRestPkiCoreController(StorageMock storageMock, Util util) : ControllerBase {

	// Rest PKI Core speaks camelCase JSON. Null fields are left out of the request.
	private static readonly JsonSerializerOptions jsonOptions = new(JsonSerializerDefaults.Web) {
		DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
	};

	// POST api/validate-pades-signature-rest-pki-core/open
	[HttpPost("open")]
	public async Task<ActionResult<ValidatePadesSignatureRestPkiCoreOpenResponse>> Open(ValidatePadesSignatureRestPkiCoreOpenRequest request, CancellationToken cancellationToken) {
		if (!util.IsRestPkiCoreConfigured) {
			return Problem(detail: Util.RestPkiCoreNotConfiguredMessage, statusCode: StatusCodes.Status503ServiceUnavailable);
		}

		if (!storageMock.TryGetFile(request.FileId, out var path)) {
			return Problem(detail: "The file to be validated was not found.", statusCode: StatusCodes.Status404NotFound);
		}

		var inspectRequest = new ValidatePadesSignatureRestPkiCoreInspectRequest(
			// Send the PDF itself. The MIME type tells Rest PKI Core which kind of signature to look
			// for (PDF, CMS or XML).
			File: new ValidatePadesSignatureRestPkiCoreFileModel(
				Content: await System.IO.File.ReadAllBytesAsync(path, cancellationToken),
				MimeType: "application/pdf",
				Name: request.FileId
			),
			// Without this, Rest PKI Core only reads the signatures and returns no validation results.
			Validate: true,
			// The security context says which root certificates are trusted: ICP-Brasil, plus
			// Lacuna's test PKI in Development (see Util.GetSecurityContextId()).
			SecurityContextId: util.GetSecurityContextId()
		);

		// The client's base address is the Rest PKI Core endpoint, and it sends the API key on the
		// X-Api-Key header (see Util.GetRestPkiCoreHttpClient()).
		var http = util.GetRestPkiCoreHttpClient();
		using var response = await http.PutAsJsonAsync("api/signature-inspection", inspectRequest, jsonOptions, cancellationToken);

		if (!response.IsSuccessStatusCode) {
			// Rest PKI Core describes errors with { code, message, ... }.
			var error = await ReadErrorAsync(response, cancellationToken);
			return Problem(
				detail: $"Rest PKI Core answered {(int)response.StatusCode} {response.ReasonPhrase}: {error?.Message ?? "no details"}",
				statusCode: StatusCodes.Status502BadGateway
			);
		}

		var result = await response.Content.ReadFromJsonAsync<ValidatePadesSignatureRestPkiCoreInspectResponse>(jsonOptions, cancellationToken)
			?? throw new InvalidOperationException("Rest PKI Core returned an empty response");

		if (!result.Success) {
			// Only detached CMS signatures fail this way (DataFileRequired). A PDF carries its own data.
			return Problem(detail: $"The signature could not be inspected: {result.Failure}", statusCode: StatusCodes.Status422UnprocessableEntity);
		}

		// The signers, each with its validation results, go to the browser as Rest PKI Core sent them.
		return new ValidatePadesSignatureRestPkiCoreOpenResponse(result.Signers ?? []);
	}

	private static async Task<ValidatePadesSignatureRestPkiCoreErrorModel?> ReadErrorAsync(HttpResponseMessage response, CancellationToken cancellationToken) {
		try {
			return await response.Content.ReadFromJsonAsync<ValidatePadesSignatureRestPkiCoreErrorModel>(jsonOptions, cancellationToken);
		} catch (Exception ex) when (ex is JsonException or NotSupportedException) {
			// Not a JSON body (a proxy error page, for instance).
			return null;
		}
	}
}

/// <param name="FileId">The signed PDF to validate (a file id from FilesController).</param>
public record ValidatePadesSignatureRestPkiCoreOpenRequest(string FileId);

/// <summary>
/// What the browser receives: the signers as Rest PKI Core described them.
/// </summary>
public record ValidatePadesSignatureRestPkiCoreOpenResponse(List<ValidatePadesSignatureRestPkiCoreSignerModel> Signers);

// The request and response of Rest PKI Core's PUT api/signature-inspection, reduced to the fields
// this sample uses (see https://core.pki.rest/swagger, tag SignatureInspection). Enum values are
// kept as strings, so a value added to the API later does not break deserialization.
//
// The package Lacuna.RestPkiCore.Api has the complete models (namespace
// Lacuna.RestPki.Api.SignatureInspection) if you need every field.

public record ValidatePadesSignatureRestPkiCoreInspectRequest(ValidatePadesSignatureRestPkiCoreFileModel File, bool Validate, Guid? SecurityContextId);

// A file sent to Rest PKI Core: its content (Base64 in JSON), or a URL Rest PKI Core can download.
public record ValidatePadesSignatureRestPkiCoreFileModel(byte[] Content, string MimeType, string? Name);

public record ValidatePadesSignatureRestPkiCoreInspectResponse(bool Success, string? Failure, List<ValidatePadesSignatureRestPkiCoreSignerModel>? Signers);

public record ValidatePadesSignatureRestPkiCoreSignerModel(
	ValidatePadesSignatureRestPkiCoreCertificateModel? Certificate,
	DateTimeOffset? SigningTime,
	// The signing time attested by a timestamp, as opposed to the signer's own clock.
	DateTimeOffset? CertifiedDateReference,
	ValidatePadesSignatureRestPkiCoreDigestAlgorithmAndValueModel? MessageDigest,
	ValidatePadesSignatureRestPkiCoreSignaturePolicyModel? SignaturePolicy,
	List<ValidatePadesSignatureRestPkiCoreTimestampModel>? Timestamps,
	ValidatePadesSignatureRestPkiCoreValidationResultsModel? ValidationResults
);

public record ValidatePadesSignatureRestPkiCoreCertificateModel(
	string? SubjectCommonName,
	string? SubjectDisplayName,
	string? EmailAddress,
	string? IssuerDisplayName,
	DateTimeOffset ValidityStart,
	DateTimeOffset ValidityEnd,
	ValidatePadesSignatureRestPkiCorePkiBrazilModel? PkiBrazil
);

// The fields ICP-Brasil certificates carry (CPF, CNPJ, ...). Most are empty on any given certificate.
public record ValidatePadesSignatureRestPkiCorePkiBrazilModel(
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

public record ValidatePadesSignatureRestPkiCoreDigestAlgorithmAndValueModel(string Algorithm, string? HexValue);

public record ValidatePadesSignatureRestPkiCoreSignaturePolicyModel(string Oid);

public record ValidatePadesSignatureRestPkiCoreTimestampModel(DateTimeOffset GenTime, string? SerialNumber);

public record ValidatePadesSignatureRestPkiCoreValidationResultsModel(
	List<ValidatePadesSignatureRestPkiCoreValidationItemModel> PassedChecks,
	List<ValidatePadesSignatureRestPkiCoreValidationItemModel> Warnings,
	List<ValidatePadesSignatureRestPkiCoreValidationItemModel> Errors
);

// One check, such as "the signer's certificate is not expired". Certificate checks carry the
// checks of the certificate chain in InnerValidationResults.
public record ValidatePadesSignatureRestPkiCoreValidationItemModel(
	string Type,
	string Message,
	string? Detail,
	ValidatePadesSignatureRestPkiCoreValidationResultsModel? InnerValidationResults
);

// The body of a Rest PKI Core error response (ErrorModelV2).
public record ValidatePadesSignatureRestPkiCoreErrorModel(string? Code, string? Message, string? Detail);
