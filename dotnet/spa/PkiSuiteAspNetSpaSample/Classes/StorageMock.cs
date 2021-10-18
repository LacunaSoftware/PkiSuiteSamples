using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetSpaSample.Classes {

	public enum SampleDocs {
		SamplePdf = 0,
		PdfSignedOnce,
		PdfSignedTwice,
		CmsSignedOnce,
		CmsSignedTwice,
		CmsDataFile,
		CmsDetached1,
		CmsDetached2,
		CmsAttached1,
		CmsAttached2
	}

	public class StorageMock {
		private readonly IWebHostEnvironment _env;
		private readonly IHttpContextAccessor _httpContextAccessor;

		public StorageMock(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
		{
			_env = env;
			_httpContextAccessor = httpContextAccessor;
		}

		public string AppDataPath {
			get {
				return Path.Combine(_env.ContentRootPath, "App_Data");
			}
		}

		public string ContentPath {
			get {
				return Path.Combine(_env.ContentRootPath, "Content");
			}
		}

		public bool TryGetFile(string fileId, out byte[] content)
		{
			content = null;

			if (string.IsNullOrEmpty(fileId))
			{
				return false;
			}
			var filename = fileId.Replace('_', '.');
			// Note: we're receiving the fileId argument with "_" as "." because of limitations of ASP.NET MVC.

			var path = Path.Combine(AppDataPath, filename);
			var fileInfo = new FileInfo(path);
			if (!fileInfo.Exists)
			{
				return false;
			}
			content = File.ReadAllBytes(path);
			return true;
		}

		public bool TryGetFile(string fileId, out string absolutePath)
		{
			absolutePath = null;

			if (string.IsNullOrEmpty(fileId))
			{
				return false;
			}
			var filename = fileId.Replace('_', '.');
			// Note: we're receiving the fileId argument with "_" as "." because of limitations of ASP.NET MVC.

			absolutePath = Path.Combine(AppDataPath, filename);
			var fileInfo = new FileInfo(absolutePath);
			if (!fileInfo.Exists)
			{
				return false;
			}
			return true;
		}

		internal string GetSampleContractPath()
		{
			return Path.Combine(ContentPath, "SampleContract.xml");
		}

		public Stream OpenRead(string filename)
		{

			if (string.IsNullOrEmpty(filename))
			{
				throw new ArgumentNullException("fileId");
			}

			var path = Path.Combine(AppDataPath, filename);
			var fileInfo = new FileInfo(path);
			if (!fileInfo.Exists)
			{
				throw new FileNotFoundException("File not found: " + filename);
			}
			return fileInfo.OpenRead();
		}

		internal string CopySampleToAppData(SampleDocs sample)
		{
			var path = GetSampleDocPath(sample);

			var extension = new FileInfo(path).Extension;

			using (var inStream = OpenRead(path))
			{
				return Store(inStream, extension);
			}
		}

		public byte[] Read(string fileId)
		{

			if (string.IsNullOrEmpty(fileId))
			{
				throw new ArgumentNullException("fileId");
			}
			var filename = fileId.Replace("_", ".");
			// Note: we're receiving the fileId argument with "_" as "." because of limitations of ASP.NET MVC.

			using (var inputStream = OpenRead(filename))
			{
				using (var buffer = new MemoryStream())
				{
					inputStream.CopyTo(buffer);
					return buffer.ToArray();
				}
			}
		}

		public byte[] Read(string fileId, out string filename)
		{

			if (string.IsNullOrEmpty(fileId))
			{
				throw new ArgumentNullException("fileId");
			}
			filename = fileId.Replace("_", ".");
			// Note: we're receiving the fileId argument with "_" as "." because of limitations of ASP.NET MVC.

			using (var inputStream = OpenRead(filename))
			{
				using (var buffer = new MemoryStream())
				{
					inputStream.CopyTo(buffer);
					return buffer.ToArray();
				}
			}
		}

		public string Store(Stream stream, string extension = "", string filename = null)
		{

			// Guarantees that the "App_Data" folder exists.
			if (!Directory.Exists(AppDataPath))
			{
				Directory.CreateDirectory(AppDataPath);
			}

			if (string.IsNullOrEmpty(filename))
			{
				filename = Guid.NewGuid() + extension;
			}

			var path = Path.Combine(AppDataPath, filename.Replace("_", "."));
			using (var fileStream = File.Create(path))
			{
				stream.CopyTo(fileStream);
			}

			return filename.Replace(".", "_");
			// Note: we're passing the filename argument with "." as "_" because of limitations of ASP.NET MVC.
		}

		public string Store(byte[] content, string extension = "", string filename = null)
		{
			string fileId;
			using (var stream = new MemoryStream(content))
			{
				fileId = Store(stream, extension, filename);
			}
			return fileId;
		}

		/// <summary>
		/// Returns the verification code associated with the given document, or null if no verification code
		/// has been associated with it.
		/// </summary>
		public string GetVerificationCode(string fileId)
		{
			// >>>>> NOTICE <<<<<
			// This should be implemented on your application as a SELECT on your "document table" by the
			// ID of the document, returning the value of the verification code column
			return _httpContextAccessor.HttpContext.Session.GetString(string.Format("Files/{0}/Code", fileId));
		}

		/// <summary>
		/// Registers the verification code for a given document.
		/// </summary>
		public void SetVerificationCode(string fileId, string code)
		{
			// >>>>> NOTICE <<<<<
			// This should be implemented on your application as an UPDATE on your "document table" filling
			// the verification code column, which should be an indexed column
			_httpContextAccessor.HttpContext.Session.SetString(string.Format("Files/{0}/Code", fileId), code);
			_httpContextAccessor.HttpContext.Session.SetString(string.Format("Codes/{0}", fileId), fileId);
		}

		/// <summary>
		/// Returns the ID of the document associated with a given verification code, or null if no document
		/// matches the given code.
		/// </summary>
		public string LookupVerificationCode(string code)
		{
			if (string.IsNullOrEmpty(code))
			{
				return null;
			}
			// >>>>> NOTICE <<<<<
			// This should be implemented on your application as a SELECT on your "document table" by the
			// verification code column, which should be an indexed column
			return _httpContextAccessor.HttpContext.Session.GetString(string.Format("Codes/{0}", code));
		}

		public string GetSampleDocPath(SampleDocs fileId)
		{
			string filename;
			return GetSampleDocPath(fileId, out filename);
		}

		public string GetSampleDocPath(SampleDocs fileId, out string filename)
		{
			filename = null;
			switch (fileId)
			{
				case SampleDocs.SamplePdf:
					filename = "SamplePdf.pdf";
					break;
				case SampleDocs.PdfSignedOnce:
					filename = "SamplePdfSignedOnce.pdf";
					break;
				case SampleDocs.PdfSignedTwice:
					filename = "SamplePdfSignedTwice.pdf";
					break;
				case SampleDocs.CmsSignedOnce:
					filename = "SampleCms.p7s";
					break;
				case SampleDocs.CmsSignedTwice:
					filename = "SampleCmsSignedTwice.p7s";
					break;
				case SampleDocs.CmsDataFile:
					filename = "CMSDataFile.pdf";
					break;
				case SampleDocs.CmsAttached1:
					filename = "CMSAttached1.p7s";
					break;
				case SampleDocs.CmsAttached2:
					filename = "CMSAttached2.p7s";
					break;
				case SampleDocs.CmsDetached1:
					filename = "CMSDetached1.p7s";
					break;
				case SampleDocs.CmsDetached2:
					filename = "CMSDetached2.p7s";
					break;
				default:
					throw new InvalidOperationException();
			}
			return Path.Combine(ContentPath, filename);
		}

		public byte[] GetSampleDocContent(SampleDocs fileId)
		{
			string filename;
			return GetSampleDocContent(fileId, out filename);
		}

		public byte[] GetSampleDocContent(SampleDocs fileId, out string filename)
		{
			var path = GetSampleDocPath(fileId, out filename);
			return File.ReadAllBytes(path);
		}

		public string GetSampleDocPath()
		{
			return Path.Combine(ContentPath, "SamplePdf.pdf");
		}

		public byte[] GetSampleDocContent()
		{
			return File.ReadAllBytes(Path.Combine(ContentPath, "SamplePdf.pdf"));
		}

		public byte[] GetPdfStampContent()
		{
			return File.ReadAllBytes(Path.Combine(ContentPath, "PdfStamp.png"));
		}

		public string GetSampleNFePath()
		{
			return Path.Combine(ContentPath, "SampleNFe.xml");
		}

		public byte[] GetSampleNFeContent()
		{
			return File.ReadAllBytes(Path.Combine(ContentPath, "SampleNFe.xml"));
		}

		public string GetSampleXmlDocumentPath()
		{
			return Path.Combine(ContentPath, "SampleDocument.xml");
		}
		public byte[] GetSampleXmlDocumentContent()
		{
			return File.ReadAllBytes(Path.Combine(ContentPath, "SampleDocument.xml"));
		}

		public string GetBatchDocPath(int id)
		{
			return Path.Combine(ContentPath, string.Format("{0:D2}.pdf", id % 10));
		}

		public byte[] GetSampleCodEnvelopeContent()
		{
			return File.ReadAllBytes(Path.Combine(ContentPath, "SampleCodEnvelope.xml"));
		}

		public string GetXmlInvoiceWithSigsPath()
		{
			return Path.Combine(ContentPath, "InvoiceWithSigs.xml");
		}

		public string GetSampleManifestPath()
		{
			return Path.Combine(ContentPath, "EventoManifesto.xml");
		}

		public byte[] GetIcpBrasilLogoContent()
		{
			return File.ReadAllBytes(Path.Combine(ContentPath, "icp-brasil.png"));
		}

		public byte[] GetEmptyPdfContent()
		{
			return File.ReadAllBytes(Path.Combine(ContentPath, "empty.pdf"));
		}

		public byte[] GetValidationResultIcon(bool isValid)
		{
			var filename = isValid ? "ok.png" : "not-ok.png";
			return File.ReadAllBytes(Path.Combine(ContentPath, filename));
		}

		public byte[] GetServerCertificate()
		{
			return File.ReadAllBytes(Path.Combine(ContentPath, "Pierre de Fermat.pfx"));
		}

	}
}