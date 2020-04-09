using Lacuna.Pki;
using Lacuna.Pki.Pades;
using Lacuna.Pki.Stores;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class PadesServerKeySdkController : Controller
    {
        private IPadesPolicyMapper GetSignaturePolicy()
        {

            // Get our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator()).
            var arbitrator = Util.GetTrustArbitrator();

            return PadesPoliciesForGeneration.GetPadesBasic(arbitrator);
        }

        // GET: PadesServerKeySdk
        public ActionResult Index(string userfile)
        {
			byte[] signatureContent;
			PKCertificateWithKey certWithKey;
			try
			{
				// Instantiate a CadesSigner class
				var padesSigner = new PadesSigner();

				// Verify if the userfile exists and get the content of the userfile.
				if (!StorageMock.TryGetFile(userfile, out byte[] userfileContent))
				{
					return HttpNotFound();
				}

				// Set the file to be signed.
				padesSigner.SetPdfToSign(userfileContent);

				// Get the server's certificate, stores it and and set as the signer certificate.
				var certContent = StorageMock.GetServerCertificate();
				var store = Pkcs12CertificateStore.Load(certContent, "1234");
				certWithKey = store.GetCertificatesWithKey().First();
				padesSigner.SetSigningCertificate(certWithKey);

				// Set the signature policy.
				padesSigner.SetPolicy(GetSignaturePolicy());

				// Set a visual representation for the signature.
				padesSigner.SetVisualRepresentation(PadesVisualElements.GetVisualRepresentationForPkiSdk(certWithKey.Certificate));

				// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
				padesSigner.ComputeSignature();

				// Get the signed PDF as an array of bytes
				signatureContent = padesSigner.GetPadesSignature();
			}
			catch (ValidationException ex)
			{
				// Some of the operations above may throw a ValidationException, for instance if the certificate
				// encoding cannot be read or if the certificate is expired.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View();
			}

			return View(new SignatureInfoModel()
			{
				// Store the signature file on the folder "App_Data/".
				// With this filename, it can show a link to download the signature file.
				File = StorageMock.Store(signatureContent, ".pdf"),
				SignerCertificate = certWithKey.Certificate
			});
		}
    }
}