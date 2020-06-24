using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Rest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    /**
	 * This controller performs two signatures on the same XML document, one on each element, according to the standard Certificación de Origen Digital (COD),
	 * from Asociación Latinoamericana de Integración (ALADI). For more information, please see:
	 * 
	 * - Spanish: http://www.aladi.org/nsfweb/Documentos/2327Rev2.pdf
	 * - Portuguese: http://www.mdic.gov.br/images/REPOSITORIO/secex/deint/coreo/2014_09_19_-_Brasaladi_761_-_Documento_ALADI_SEC__di_2327__Rev_2_al_port_.pdf
	 */
    public class XmlCodSignatureRestController : BaseController
	{
		// GET CodXmlSignature
		public async Task<ActionResult> Index()
		{
			// Instantiate the XmlElementSignatureStarter class, responsible for receiving the signature
			// elements and start the signature process.
			var signatureStarter = new XmlElementSignatureStarter(Util.GetRestPkiClient());

			// Set the data to sign, which in the case of this example is a fixed sample "COD envelope"
			signatureStarter.SetXml(StorageMock.GetSampleCodEnvelopeContent());

			// Set the ID of the COD element
			signatureStarter.SetToSignElementId("COD");

			// Set the signature policy
			signatureStarter.SetSignaturePolicy(StandardXmlSignaturePolicies.CodSha1);

			// Set the security context to be used to determine trust in the certificate chain. We have
			// encapsulated the security context choice on Util.cs.
			signatureStarter.SetSecurityContext(Util.GetSecurityContextId());

			// Call the StartWithWebPki() method, which initiates the signature. This yields the token,
			// a 43-character case-sensitive URL-safe string, which identifies this signature process. We'll
			// use this value to call the signWithRestPki() method on the Web PKI component (see
			// signature-form.js) and also to complete the signature on the POST action below (this should
			// not be mistaken with the API access token).
			var token = await signatureStarter.StartWithWebPkiAsync();

			// The token acquired above can only be used for a single signature attempt. In order to retry
			// the signature it is necessary to get a new token. This can be a problem if the user uses the
			// back button of the browser, since the browser might show a cached page that we rendered
			// previously, with a now stale token. To prevent this from happening, we call the method
			// SetNoCacheHeaders() (in BaseController) which sets HTTP headers to prevent caching of the
			// page.
			base.SetNoCacheHeaders();

			// Render the signature page with the token obtained from REST PKI.
			return View(new SignatureModel()
			{
				Token = token
			});
		}

		// GET CodXmlSignature
		[HttpPost]
		public async Task<ActionResult> Index(SignatureModel model)
		{
			// Get an instance of the XmlSignatureFinisher class, responsible for completing the signature
			// process.
			var signatureFinisher = new XmlSignatureFinisher(Util.GetRestPkiClient())
			{
				// Set the token for this signature (rendered in a hidden input field, see the view).
				Token = model.Token
			};

			// Call the Finish() method, which finalizes the signature process and returns the signed PDF.
			var signedXml = await signatureFinisher.FinishAsync();

			// Get information about the signer's certificate used. This method must only be called after
			// calling the Finish() method.
			var signerCert = signatureFinisher.GetCertificateInfo();

			// At this point, you'd typically store the signed XML on your database. For demonstration
			// purposes, we'll store the PDF on our mock Storage class.
			var fileId = StorageMock.Store(signedXml, ".xml");

			// Render the signature information page.
			return View("SignatureInfo", new SignatureInfoModel()
			{
				File = fileId,
				SignerCertificate = signerCert
			});
		}
		
		// GET CodXmlSignature/SignCodeh
		[HttpGet]
		public async Task<ActionResult> SignCodeh(string id)
		{
			// Recover XML envelope with signed COD element from "storage" based on its ID
			if (!StorageMock.TryGetFile(id, out byte[] content))
			{
				return HttpNotFound();
			}

			// Instantiate the XmlElementSignatureStarter class, responsible for receiving the signature
			// elements and start the signature process.
			var signatureStarter = new XmlElementSignatureStarter(Util.GetRestPkiClient());

			// Set the data to sign, which in the case of this example is a fixed sample "COD envelope"
			signatureStarter.SetXml(content);

			// Set the ID of the CODEH element
			signatureStarter.SetToSignElementId("CODEH");

			// Set the signature policy
			signatureStarter.SetSignaturePolicy(StandardXmlSignaturePolicies.CodSha1);

			// Set the security context to be used to determine trust in the certificate chain. We have
			// encapsulated the security context choice on Util.cs.
			signatureStarter.SetSecurityContext(Util.GetSecurityContextId());

			// Call the StartWithWebPki() method, which initiates the signature. This yields the token,
			// a 43-character case-sensitive URL-safe string, which identifies this signature process. We'll
			// use this value to call the signWithRestPki() method on the Web PKI component (see
			// signature-form.js) and also to complete the signature on the POST action below (this should
			// not be mistaken with the API access token).
			var token = await signatureStarter.StartWithWebPkiAsync();

			// The token acquired above can only be used for a single signature attempt. In order to retry
			// the signature it is necessary to get a new token. This can be a problem if the user uses the
			// back button of the browser, since the browser might show a cached page that we rendered
			// previously, with a now stale token. To prevent this from happening, we call the method
			// SetNoCacheHeaders() (in BaseController) which sets HTTP headers to prevent caching of the
			// page.
			base.SetNoCacheHeaders();

			// Render the signature page with the token obtained from REST PKI.
			return View(new SignatureModel()
			{
				Token = token
			});
		}
		
		// POST CodXmlSignature/SignCodeh
		[HttpPost]
		public async Task<ActionResult> SignCodeh(SignatureModel model)
		{
			// Get an instance of the XmlSignatureFinisher class, responsible for completing the signature
			// process.
			var signatureFinisher = new XmlSignatureFinisher(Util.GetRestPkiClient())
			{
				// Set the token for this signature (rendered in a hidden input field, see the view).
				Token = model.Token
			};

			// Call the Finish() method, which finalizes the signature process and returns the signed PDF.
			var signedXml = await signatureFinisher.FinishAsync();

			// Get information about the signer's certificate used. This method must only be called after
			// calling the Finish() method.
			var signerCert = signatureFinisher.GetCertificateInfo();

			// At this point, you'd typically store the signed XML on your database. For demonstration
			// purposes, we'll store the PDF on our mock Storage class.
			var fileId = StorageMock.Store(signedXml, ".xml");

			// Render the signature information page.
			return View("SignCodehSignatureInfo", new SignatureInfoModel()
			{
				File = fileId,
				SignerCertificate = signerCert
			});
		}
		
	}
}