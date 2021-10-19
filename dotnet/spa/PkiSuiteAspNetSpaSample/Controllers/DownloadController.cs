using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetSpaSample.Classes;
using System.IO;

namespace PkiSuiteAspNetSpaSample.Controllers {

	/**
	 * This controller's purpose is to download the sample file that is signed during the signature examples
	 * or download a upload file for signature or download a previously performed signature.
	 */
	[Route("api/[controller]/[action]")]
	[ApiController]
	public class DownloadController : ControllerBase {
		private readonly StorageMock _storageMock;

		public DownloadController(StorageMock storageMock)
		{
			_storageMock = storageMock;
		}

		// GET Download/File/{id}
		[HttpGet("{id}")]
		public ActionResult File(string id)
		{
			byte[] content;

			if (id == null)
			{
				return NotFound();
			}

			string filename;
			try
			{
				content = _storageMock.Read(id, out filename);
			} catch (FileNotFoundException)
			{
				return NotFound();
			}

			string mimeType;
			if (filename[^1..] == "p7s")
			{
				mimeType = "application/x-pkcs7-signature";
			}
			else
			{
				mimeType = "application/pdf";
			}

			return File(content, mimeType, filename);
		}

		// GET Download/Sample/<file_id>
		[HttpGet("{id}")]
		public ActionResult Sample(SampleDocs id)
		{
			var content = _storageMock.GetSampleDocContent(id, out var filename);
			string mimeType;
			if (filename[^1..] == "p7s")
			{
				mimeType = "application/x-pkcs7-signature";
			}
			else
			{
				mimeType = "application/pdf";
			}
			return File(content, mimeType, filename);
		}

		// GET Download/Doc/{id}
		[HttpGet("{id}")]
		public ActionResult Doc(int id)
		{
			var fileContent = _storageMock.Read(_storageMock.GetBatchDocPath(id));
			return File(fileContent, "application/pdf", string.Format("Doc{0:D2}.pdf", id));
		}

		// GET Download/SampleNFe
		[HttpGet]
		public ActionResult SampleNFe()
		{
			var fileContent = _storageMock.GetSampleNFeContent();
			return File(fileContent, "text/xml", "SampleNFe.xml");
		}

		// GET Download/SampleXml
		[HttpGet]
		public ActionResult SampleXml()
		{
			var fileContent = _storageMock.GetSampleXmlDocumentContent();
			return File(fileContent, "text/xml", "SampleDocument.xml");
		}

		// GET Download/SampleContract
		[HttpGet]
		public ActionResult SampleContract()
		{
			var fileContent = _storageMock.Read(_storageMock.GetSampleContractPath());
			return File(fileContent, "text/xml", "SampleContract.xml");
		}

		// GET Download/SampleInvoice
		[HttpGet]
		public ActionResult SampleInvoice()
		{
			var fileContent = _storageMock.Read(_storageMock.GetXmlInvoiceWithSigsPath());
			return File(fileContent, "text/xml", "InvoiceWithSigs.xml");
		}

		// GET Download/Manifesto
		[HttpGet]
		public ActionResult Manifesto()
		{
			var fileContent = _storageMock.Read(_storageMock.GetSampleManifestPath());
			return File(fileContent, "text/xml", "EventoManifesto.xml");
		}

		// GET Download/SampleCodEnvelope
		[HttpGet]
		public ActionResult SampleCodEnvelope()
		{
			var fileContent = _storageMock.GetSampleCodEnvelopeContent();
			return File(fileContent, "text/xml", "SampleCodEnvelope.xml");
		}
	}
}