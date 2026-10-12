using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// Gets the documents into and out of the samples: the Angular document picker either uploads a
/// file or chooses a sample document, and gets back a file id that it passes to the sample. Signed
/// files are downloaded by their file id.
/// </summary>
[ApiController]
[Route("api/files")]
public class FilesController(StorageMock storageMock) : ControllerBase {

	private static readonly FileExtensionContentTypeProvider contentTypeProvider = new();

	// POST api/files (multipart/form-data, with the file on the "file" field)
	[HttpPost]
	public ActionResult<FileIdModel> Upload(IFormFile file) {
		if (file.Length == 0) {
			return BadRequest("The uploaded file is empty");
		}
		// Store the file in the App_Data folder. In a real application, you'd store it in your
		// database or blob storage.
		using var stream = file.OpenReadStream();
		var fileId = storageMock.Store(stream, Path.GetExtension(file.FileName));
		return new FileIdModel(fileId);
	}

	// POST api/files/samples/{document}
	[HttpPost("samples/{document}")]
	public ActionResult<FileIdModel> UseSample(SampleDocument document) {
		// Copy the sample document to App_Data, so the samples treat it like an uploaded file.
		return new FileIdModel(storageMock.CopySampleDocument(document));
	}

	// GET api/files/samples/{document}
	[HttpGet("samples/{document}")]
	public IActionResult DownloadSample(SampleDocument document) {
		var path = storageMock.GetSampleDocumentPath(document);
		return PhysicalFile(path, GetContentType(path), Path.GetFileName(path));
	}

	// GET api/files/{fileId}
	[HttpGet("{fileId}")]
	public IActionResult Download(string fileId) {
		if (!storageMock.TryGetFile(fileId, out var path)) {
			return NotFound();
		}
		return PhysicalFile(path, GetContentType(path), fileId);
	}

	private static string GetContentType(string path) {
		return contentTypeProvider.TryGetContentType(path, out var contentType) ? contentType : "application/octet-stream";
	}
}

public record FileIdModel(string FileId);
