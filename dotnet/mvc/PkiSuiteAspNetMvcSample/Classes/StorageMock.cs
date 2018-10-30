using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Classes {
	public class StorageMock {

		public static string AppDataPath {
			get {
				return HttpContext.Current.Server.MapPath("~/App_Data");
			}
		}

		public static string ContentPath {
			get {
				return HttpContext.Current.Server.MapPath("~/Content");
			}
		}

		public static bool TryGetFile(string fileId, out byte[] content) {
			content = null;

			if (string.IsNullOrEmpty(fileId)) {
				return false;
			}
			var filename = fileId.Replace('_', '.');
			// Note: we're receiving the fileId argument with "_" as "." because of limitations of ASP.NET MVC.

			var path = Path.Combine(AppDataPath, filename);
			var fileInfo = new FileInfo(path);
			if (!fileInfo.Exists) {
				return false;
			}
			content = File.ReadAllBytes(path);
			return true;
		}

		public static bool TryGetFile(string fileId, out string absolutePath) {
			absolutePath = null;

			if (string.IsNullOrEmpty(fileId)) {
				return false;
			}
			var filename = fileId.Replace('_', '.');
			// Note: we're receiving the fileId argument with "_" as "." because of limitations of ASP.NET MVC.

			absolutePath = Path.Combine(AppDataPath, filename);
			var fileInfo = new FileInfo(absolutePath);
			if (!fileInfo.Exists) {
				return false;
			}
			return true;
		}

		public static Stream OpenRead(string filename) {

			if (string.IsNullOrEmpty(filename)) {
				throw new ArgumentNullException("fileId");
			}

			var path = Path.Combine(AppDataPath, filename);
			var fileInfo = new FileInfo(path);
			if (!fileInfo.Exists) {
				throw new FileNotFoundException("File not found: " + filename);
			}
			return fileInfo.OpenRead();
		}

		public static byte[] Read(string fileId) {

			if (string.IsNullOrEmpty(fileId)) {
				throw new ArgumentNullException("fileId");
			}
			var filename = fileId.Replace("_", ".");
			// Note: we're receiving the fileId argument with "_" as "." because of limitations of ASP.NET MVC.

			using (var inputStream = OpenRead(filename)) {
				using (var buffer = new MemoryStream()) {
					inputStream.CopyTo(buffer);
					return buffer.ToArray();
				}
			}
		}

		public static byte[] Read(string fileId, out string filename) {

			if (string.IsNullOrEmpty(fileId)) {
				throw new ArgumentNullException("fileId");
			}
			filename = fileId.Replace("_", ".");
			// Note: we're receiving the fileId argument with "_" as "." because of limitations of ASP.NET MVC.

			using (var inputStream = OpenRead(filename)) {
				using (var buffer = new MemoryStream()) {
					inputStream.CopyTo(buffer);
					return buffer.ToArray();
				}
			}
		}

		public static string Store(Stream stream, string extension = "", string filename = null) {

			// Guarantees that the "App_Data" folder exists.
			if (!Directory.Exists(AppDataPath)) {
				Directory.CreateDirectory(AppDataPath);
			}

			if (string.IsNullOrEmpty(filename)) {
				filename = Guid.NewGuid() + extension;
			}

			var path = Path.Combine(AppDataPath, filename.Replace("_", "."));
			using (var fileStream = File.Create(path)) {
				stream.CopyTo(fileStream);
			}

			return filename.Replace(".", "_");
			// Note: we're passing the filename argument with "." as "_" because of limitations of ASP.NET MVC.
		}

		public static string Store(byte[] content, string extension = "", string filename = null) {
			string fileId;
			using (var stream = new MemoryStream(content)) {
				fileId = Store(stream, extension, filename);
			}
			return fileId;
		}

		/// <summary>
		/// Returns the verification code associated with the given document, or null if no verification code
		/// has been associated with it.
		/// </summary>
		public static string GetVerificationCode(string fileId) {
			// >>>>> NOTICE <<<<<
			// This should be implemented on your application as a SELECT on your "document table" by the
			// ID of the document, returning the value of the verification code column
			return HttpContext.Current.Session[string.Format("Files/{0}/Code", fileId)] as string;
		}

		/// <summary>
		/// Registers the verification code for a given document.
		/// </summary>
		public static void SetVerificationCode(string fileId, string code) {
			// >>>>> NOTICE <<<<<
			// This should be implemented on your application as an UPDATE on your "document table" filling
			// the verification code column, which should be an indexed column
			HttpContext.Current.Session[string.Format("Files/{0}/Code", fileId)] = code;
			HttpContext.Current.Session[string.Format("Codes/{0}", code)] = fileId;
		}

		/// <summary>
		/// Returns the ID of the document associated with a given verification code, or null if no document
		/// matches the given code.
		/// </summary>
		public static string LookupVerificationCode(string code) {
			if (string.IsNullOrEmpty(code)) {
				return null;
			}
			// >>>>> NOTICE <<<<<
			// This should be implemented on your application as a SELECT on your "document table" by the
			// verification code column, which should be an indexed column
			return HttpContext.Current.Session[string.Format("Codes/{0}", code)] as string;
		}

		public static string GetSampleDocPath() {
			return Path.Combine(ContentPath, "SampleDocument.pdf");
		}

		public static byte[] GetSampleDocContent() {
			return File.ReadAllBytes(Path.Combine(ContentPath, "SampleDocument.pdf"));
		}

		public static byte[] GetPdfStampContent() {
			return File.ReadAllBytes(Path.Combine(ContentPath, "PdfStamp.png"));
		}

		public static string GetSampleNFePath() {
			return Path.Combine(ContentPath, "SampleNFe.xml");
		}

		public static byte[] GetSampleNFeContent() {
			return File.ReadAllBytes(Path.Combine(ContentPath, "SampleNFe.xml"));
		}

		public static string GetSampleXmlDocumentPath() {
			return Path.Combine(ContentPath, "SampleDocument.xml");
		}
		public static string GetBatchDocPath(int id) {
			return Path.Combine(ContentPath, string.Format("{0:D2}.pdf", id % 10));
		}

		public static byte[] GetSampleCodEnvelopeContent() {
			return File.ReadAllBytes(Path.Combine(ContentPath, "SampleCodEnvelope.xml"));
		}

		public static string GetXmlInvoiceWithSigsPath() {
			return Path.Combine(ContentPath, "InvoiceWithSigs.xml");
		}

		public static string GetSampleManifestPath() {
			return Path.Combine(ContentPath, "EventoManifesto.xml");
		}

		public static string GetSampleBStampedPath() {
			return Path.Combine(ContentPath, "BStamped.pdf");
		}

		public static byte[] GetIcpBrasilLogoContent() {
			return File.ReadAllBytes(Path.Combine(ContentPath, "icp-brasil.png"));
		}

		public static byte[] GetValidationResultIcon(bool isValid) {
			var filename = isValid ? "ok.png" : "not-ok.png";
			return File.ReadAllBytes(Path.Combine(ContentPath, filename));
		}

	}
}