using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// Adds a document timestamp to a PDF with Rest PKI Core (sample "timestamp-pdf-rest-pki-core").
/// </summary>
/// <remarks>
/// A document timestamp attests that the PDF existed, as it is, at the time the timestamp authority
/// stated. Rest PKI Core requests the timestamp and embeds it in the PDF; nothing else in the PDF
/// changes. Nobody signs anything here, so there is no Web PKI in this sample: it is a single call
/// from this server to Rest PKI Core (POST api/pdf/stamp).
/// </remarks>
[ApiController]
[Route("api/timestamp-pdf-rest-pki-core")]
public class TimestampPdfRestPkiCoreController(StorageMock storageMock, Util util) : ControllerBase {

	// POST api/timestamp-pdf-rest-pki-core
	[HttpPost]
	public async Task<ActionResult<TimestampPdfRestPkiCoreResponse>> Stamp(TimestampPdfRestPkiCoreRequest request, CancellationToken cancellationToken) {
		if (!util.IsRestPkiCoreConfigured) {
			return Problem(detail: Util.RestPkiCoreNotConfiguredMessage, statusCode: StatusCodes.Status503ServiceUnavailable);
		}

		// Get the path of the PDF to be timestamped (uploaded by the user or copied from a sample
		// document, see FilesController).
		if (!storageMock.TryGetFile(request.FileId, out var pdfPath)) {
			return Problem(detail: "The file to be timestamped was not found.", statusCode: StatusCodes.Status404NotFound);
		}

		// Get a Rest PKI Core client (see Util.cs).
		var restPkiService = util.GetRestPkiService();

		var options = new StampPdfOptions() {
			// The timestamp tier picks the timestamp authority that issues the timestamp. This sample
			// uses the Lacuna Test tier, which trial API keys can use (for development purposes
			// only!). In production, use StandardTimestampTiers.PkiBrazil (an ICP-Brasil timestamp
			// authority, the tier of the "Timestamp a PDF" demo) or your account's own tier, by its
			// ID or name. Those tiers need an API key with access to them.
			TimestampTier = StandardTimestampTiers.LacunaTest.ToString(),
			// Have Rest PKI Core keep the stamped PDF and return a reference to it. Without this, it
			// returns the PDF in the response itself, which this client version (5.0.0) cannot read:
			// the result's OpenReadAsync and GetContentAsync throw NotImplementedException.
			ForceBlobResult = true,
		};

		StampPdfResult result;
		try {
			// Send the PDF to Rest PKI Core, which adds the document timestamp.
			result = await restPkiService.StampPdfAsync(
				FileReference.FromFile(pdfPath, Path.GetFileName(pdfPath)),
				options,
				cancellationToken
			);
		} catch (RestPkiExceptionV2 ex) when (ex.ErrorCode is ErrorCodesV2.TimestampTierRestricted or ErrorCodesV2.TimestampTierNotFound or ErrorCodesV2.TimestampTierDisabled) {
			// The API key cannot use the timestamp tier set above, or there is no such tier.
			return Problem(
				detail: $"Rest PKI Core cannot use the timestamp tier {options.TimestampTier} with this API key ({ex.ErrorCode}).",
				statusCode: StatusCodes.Status422UnprocessableEntity
			);
		}

		// At this point, you'd typically store the timestamped PDF on your database. Rest PKI Core
		// keeps it only for a while, so we download it and store it with our StorageMock class.
		using var stampedPdf = await result.File.OpenReadAsync(cancellationToken);
		return new TimestampPdfRestPkiCoreResponse(storageMock.Store(stampedPdf, ".pdf"));
	}
}

/// <param name="FileId">The PDF to be timestamped (a file id from FilesController).</param>
public record TimestampPdfRestPkiCoreRequest(string FileId);

/// <param name="StampedFileId">The timestamped PDF, to download from GET api/files/{fileId}.</param>
public record TimestampPdfRestPkiCoreResponse(string StampedFileId);
