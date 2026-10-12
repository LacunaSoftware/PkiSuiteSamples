using System.Diagnostics.CodeAnalysis;
using System.Text.RegularExpressions;

namespace PkiSuiteAspNetCoreAngularSample.Classes;

/// <summary>
/// The documents bundled with this project, in the Content folder. The browser refers to them by
/// name (see sample-documents.ts in the Angular project).
/// </summary>
public enum SampleDocument {
	// A PDF with no signatures.
	SamplePdf,
	// A PDF signed once, for co-signature and validation samples.
	SamplePdfSignedOnce,
	// A PDF signed twice, for co-signature and validation samples.
	SamplePdfSignedTwice,
	// A generic XML document.
	SampleXml,
	// A Brazilian electronic invoice (NF-e) to be signed.
	SampleNFe,
}

/// <summary>
/// Stores the files used and produced by the samples in the App_Data folder.
/// </summary>
/// <remarks>
/// >>>>> NOTICE <<<<<
/// This class is a stand-in for your application's storage (a database, a blob store, ...). Do not
/// copy it as is: it has no notion of users, so anyone who knows a file id can read the file.
///
/// Files are identified by a random id followed by an extension, such as
/// "0f8fad5bd9cb469fa165b0d9c2fa1c44.pdf". Ids received from the browser are checked against that
/// format before they are turned into a path.
/// </remarks>
public partial class StorageMock(IWebHostEnvironment env) {

	public string AppDataPath => Path.Combine(env.ContentRootPath, "App_Data");

	public string ContentPath => Path.Combine(env.ContentRootPath, "Content");

	#region Files

	/// <summary>
	/// Stores a file and returns its id. The extension (such as ".pdf") is kept in the id so the
	/// file can later be downloaded with the right name and content type.
	/// </summary>
	public string Store(Stream stream, string extension) {
		Directory.CreateDirectory(AppDataPath);
		var fileId = Guid.NewGuid().ToString("N") + NormalizeExtension(extension);
		using (var fileStream = File.Create(Path.Combine(AppDataPath, fileId))) {
			stream.CopyTo(fileStream);
		}
		return fileId;
	}

	public string Store(byte[] content, string extension) {
		using var stream = new MemoryStream(content);
		return Store(stream, extension);
	}

	/// <summary>
	/// Gets the path of a stored file. Returns false if the id is malformed or the file does not
	/// exist.
	/// </summary>
	public bool TryGetFile(string? fileId, [NotNullWhen(true)] out string? path) {
		path = null;
		if (string.IsNullOrEmpty(fileId) || !FileIdRegex().IsMatch(fileId)) {
			return false;
		}
		var candidate = Path.Combine(AppDataPath, fileId);
		if (!File.Exists(candidate)) {
			return false;
		}
		path = candidate;
		return true;
	}

	/// <summary>
	/// Reads a stored file. Throws FileNotFoundException if there is no such file.
	/// </summary>
	public byte[] Read(string fileId) {
		if (!TryGetFile(fileId, out var path)) {
			throw new FileNotFoundException("File not found: " + fileId);
		}
		return File.ReadAllBytes(path);
	}

	#endregion

	#region Sample documents

	public string GetSampleDocumentPath(SampleDocument document) {
		var filename = document switch {
			SampleDocument.SamplePdf => "SamplePdf.pdf",
			SampleDocument.SamplePdfSignedOnce => "SamplePdfSignedOnce.pdf",
			SampleDocument.SamplePdfSignedTwice => "SamplePdfSignedTwice.pdf",
			SampleDocument.SampleXml => "SampleDocument.xml",
			SampleDocument.SampleNFe => "SampleNFe.xml",
			_ => throw new ArgumentOutOfRangeException(nameof(document)),
		};
		return Path.Combine(ContentPath, filename);
	}

	/// <summary>
	/// Copies a sample document to App_Data and returns the copy's file id, so the samples handle
	/// sample documents and uploaded files the same way.
	/// </summary>
	public string CopySampleDocument(SampleDocument document) {
		var path = GetSampleDocumentPath(document);
		using var stream = File.OpenRead(path);
		return Store(stream, Path.GetExtension(path));
	}

	/// <summary>
	/// The image used in the visual representation of PAdES signatures (see PadesVisualElements).
	/// </summary>
	public byte[] GetPdfStampContent() {
		return File.ReadAllBytes(Path.Combine(ContentPath, "PdfStamp.png"));
	}

	#endregion

	#region PKI SDK transfer data

	/// <summary>
	/// Stores the transfer data produced by the start step of a PKI SDK signature and returns an
	/// id for it. Only this id goes to the browser; the complete step reads the transfer data back
	/// with <see cref="ReadTransferData"/>. In a real application, you'd store it in your database
	/// or cache, tied to the user's session.
	/// </summary>
	public string StoreTransferData(byte[] transferData) {
		return Store(transferData, ".transfer");
	}

	/// <summary>
	/// Reads (and deletes) the transfer data stored by <see cref="StoreTransferData"/>. Throws
	/// FileNotFoundException if the id is unknown or was already used.
	/// </summary>
	public byte[] ReadTransferData(string transferDataId) {
		if (!transferDataId.EndsWith(".transfer", StringComparison.Ordinal) || !TryGetFile(transferDataId, out var path)) {
			throw new FileNotFoundException("Transfer data not found: " + transferDataId);
		}
		var transferData = File.ReadAllBytes(path);
		File.Delete(path);
		return transferData;
	}

	#endregion

	private static string NormalizeExtension(string extension) {
		var normalized = new string(extension.Where(char.IsAsciiLetterOrDigit).ToArray()).ToLowerInvariant();
		if (normalized.Length > 10) {
			normalized = normalized[..10];
		}
		return normalized.Length > 0 ? "." + normalized : "";
	}

	[GeneratedRegex(@"^[0-9a-f]{32}(\.[0-9a-z]{1,10})?$")]
	private static partial Regex FileIdRegex();
}
