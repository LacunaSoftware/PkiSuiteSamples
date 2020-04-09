using Lacuna.Pki.Cades;
using Lacuna.Pki.Stores;
using Lacuna.Pki;
using PkiSuiteAspNetMvcSample.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PkiSuiteAspNetMvcSample.Models.Sdk;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class CadesServerKeySdkController : BaseController
    {
		/**
			This method defines the signature policy that will be used on the signature.
		 */
		private ICadesPolicyMapper getSignaturePolicy()
		{

			var policy = CadesPoliciesForGeneration.GetPkiBrazilAdrBasica();

#if DEBUG
			// During debug only, we return a wrapper which will overwrite the policy's default trust arbitrator
			// (which in this case corresponds to the ICP-Brasil roots only), with our custom trust arbitrator
			// which accepts test certificates (see Util.GetTrustArbitrator()).
			return new CadesPolicyMapperWrapper(policy, Util.GetTrustArbitrator());
#else
			return policy;
#endif
		}

		// GET: CadesServerKeySdk
		public ActionResult Index(string userfile)
		{
			byte[] signatureContent;
			PKCertificateWithKey certWithKey;
			try
			{
				// Instantiate a CadesSigner class
				var cadesSigner = new CadesSigner();

				// Verify if the userfile exists and get the content of the userfile.
				if (!StorageMock.TryGetFile(userfile, out byte[] userfileContent))
				{
					return HttpNotFound();
				}

				// We'll set the path of the file to be signed, which was saved in 
				// the App_Data folder by UploadController.
				cadesSigner.SetDataToSign(userfileContent);

				// Get the server's certificate, stores it and and set as the signer certificate.
				var certContent = StorageMock.GetServerCertificate();
				var store = Pkcs12CertificateStore.Load(certContent, "1234");
				certWithKey =  store.GetCertificatesWithKey().First();
				cadesSigner.SetSigningCertificate(certWithKey);
				
				// Set the signature policy
				cadesSigner.SetPolicy(getSignaturePolicy());

				// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
				cadesSigner.ComputeSignature();

				// Get the signature as an array of bytes
				signatureContent = cadesSigner.GetSignature();
			}
			catch (ValidationException ex)
			{
				// Some of the operations above may throw a ValidationException, for instance if the certificate
				// encoding cannot be read or if the certificate is expired.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View();
			}

			return View(new SignatureInfoModel() { 
				// Store the signature file on the folder "App_Data/".
				// With this filename, it can show a link to download the signature file.
				File = StorageMock.Store(signatureContent, ".p7s"),
				SignerCertificate = certWithKey.Certificate
			});
		}
	}
}