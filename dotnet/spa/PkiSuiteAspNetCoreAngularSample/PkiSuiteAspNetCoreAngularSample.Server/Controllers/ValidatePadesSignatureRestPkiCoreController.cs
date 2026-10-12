using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;
using PkiSuiteAspNetCoreAngularSample.Models.ValidatePadesSignatureRestPkiCore;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// Opens a signed PDF and validates each of its signatures with Rest PKI Core. There is no Web PKI
/// in this sample: the PDF was signed beforehand, and nobody signs anything here.
/// </summary>
/// <remarks>
/// Lacuna.RestPkiCore.Client has no method for signature inspection, so this sample calls the API
/// endpoint (PUT api/signature-inspection) directly with HttpClient. The request and response
/// records are in Models/ValidatePadesSignatureRestPkiCore.
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
	public async Task<ActionResult<PadesSignatureModel>> Open(OpenPadesSignatureRequest request, CancellationToken cancellationToken) {
		if (!storageMock.TryGetFile(request.FileId, out var path)) {
			return NotFound();
		}

		var inspectRequest = new InspectSignatureRequest(
			// Send the PDF itself. The MIME type tells Rest PKI Core which kind of signature to look
			// for (PDF, CMS or XML).
			File: new FileReferenceModel(
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

		var result = await response.Content.ReadFromJsonAsync<InspectSignatureResponse>(jsonOptions, cancellationToken)
			?? throw new InvalidOperationException("Rest PKI Core returned an empty response");

		if (!result.Success) {
			// Only detached CMS signatures fail this way (DataFileRequired). A PDF carries its own data.
			return Problem(detail: $"The signature could not be inspected: {result.Failure}", statusCode: StatusCodes.Status422UnprocessableEntity);
		}

		// The signers, each with its validation results, go to the browser as Rest PKI Core sent them.
		return new PadesSignatureModel(result.Signers ?? []);
	}

	private static async Task<ErrorModel?> ReadErrorAsync(HttpResponseMessage response, CancellationToken cancellationToken) {
		try {
			return await response.Content.ReadFromJsonAsync<ErrorModel>(jsonOptions, cancellationToken);
		} catch (Exception ex) when (ex is JsonException or NotSupportedException) {
			// Not a JSON body (a proxy error page, for instance).
			return null;
		}
	}
}
