using Lacuna.Pki;
using Lacuna.Pki.Stores;
using Lacuna.Pki.Xml;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class XmlServerKeySdkController : BaseController
    {
		/**
		 * This method defines the signature policy that will be used on the signature.
		 */
		private XmlPolicySpec getSignaturePolicy()
		{

			var policy = BrazilXmlPolicySpec.GetNFePadraoNacional();

#if DEBUG
			// During debug only, we clear the policy's default trust arbitrator (which, in the case of
			// the policy returned by BrazilXmlPolicySpec.GetNFePadraoNacional(), corresponds to the ICP-Brasil roots only),
			// and use our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator())
			policy.ClearTrustArbitrators();
			policy.AddTrustArbitrator(Util.GetTrustArbitrator());
#endif

			return policy;
		}

		// GET: XmlServerKeySdk
		public ActionResult Index()
        {
			byte[] signatureContent;
			PKCertificateWithKey certWithKey;

			try
			{
				// Instantiate a XmlSigner class
				var signer = new FullXmlSigner();

				// Set the data to sign, which in the case of this example is a fixed sample document
				signer.SetXml(StorageMock.GetSampleXmlDocumentContent());


				// Get the server's certificate, stores it and and set as the signer certificate.
				var certContent = StorageMock.GetServerCertificate();
				var store = Pkcs12CertificateStore.Load(certContent, "1234");
				certWithKey = store.GetCertificatesWithKey().First();
				signer.SetSigningCertificate(certWithKey);

				// Set the signature policy
				signer.SetPolicy(getSignaturePolicy());

				// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
				signer.ComputeSignature();

				// Get the signed XML as an array of bytes
				signatureContent = signer.GetSignedXml();
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