using Lacuna.Pki;
using Lacuna.Pki.BrazilTrustServices;
using Lacuna.Pki.Xml;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class XmlCloudOauthSdkController : BaseController
    {
        private const string RedirectUrl = "http://localhost:54123/XmlCloudOauthSdk/Complete";

        /**
		 * This method defines the signature policy that will be used on the signature.
		 */
        private XmlPolicySpec getSignaturePolicy()
        {
            
            var policy = XmlPolicySpec.GetXadesBasic(Util.GetTrustArbitrator());
#if DEBUG
			// During debug only, we clear the policy's default trust arbitrator (which, in the case of
			// the policy returned by BrazilXmlPolicySpec.GetNFePadraoNacional(), corresponds to the ICP-Brasil roots only),
			// and use our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator())
			//policy.ClearTrustArbitrators();
			//policy.AddTrustArbitrator(Util.GetTrustArbitrator());
#endif
            return policy;
        }

        // GET: XmlSignature
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        /**
		 * POST /XmlCloudOauthSdk/Discover
		 * 
		 * This action will be called after the user press the button "Search" on index page. It will
		 * search for all PSCs that have a certificate with the provided CPF. Thus, it will start the
		 * authentication process and return a URL to redirect the user to perform the authentication.
		 *
		 * After this action the user will be redirected, and to store the local data (fileId) to be user
		 * after the user returns to your application. We use the parameter "customState", the last
		 * parameter of the method discoverByCpfAndStartAuth(). This parameter will be recovered in the
		 * next action.
		 */
        [HttpPost]
        public async Task<ActionResult> Discover(string userfile, string cpf)
        {

            // Process CPF, removing all formatting.
            var plainCpf = Regex.Replace(cpf, @"[.-]+", "");

            // Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
            // and handling the OAuth flow.
            var manager = Util.GetTrustServicesManager();

            // Discover available PSCs.The following method has three sessionTypes:
            // - SingleSignature: The returned token can only be used for one single signature request.
            // - MultiSignature: The returned token can only be used for one multi signature request.
            // - SignatureSession: The return token can only be used for one or more signature requests.
            var services = await manager.DiscoverByCpfAndStartAuthAsync(plainCpf, RedirectUrl, TrustServiceSessionTypes.SignatureSession, userfile);

            // Render complete page.
            return View(new PadesCloudOauthModel()
            {
                Services = services,
                Cpf = cpf,
            });
        }

        [HttpGet]
        public async Task<ActionResult> Complete(string code, string state)
        {
            byte[] signatureContent;
            PKCertificateWithKey signingCertificate;

            try
            {

                // Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
                // and handling the OAuth flow.
                var manager = Util.GetTrustServicesManager();

                // Complete the authentication process, recovering the sessionRequest info to be used on the
                // signature and the custom state (fileId).
                var completeAuthResult = await manager.CompleteAuthAsync(code, state);

                // Recover file to be sigend on custom state parameter.
                var userfile = completeAuthResult.CustomState;
                var cert = await completeAuthResult.GetCertificatesWithKeyAsync();

                // Instantiate a FullXmlSigner class
                var signer = new FullXmlSigner();

                signingCertificate = cert.FirstOrDefault();

                // Set the document to be signed and the policy, exactly like in the Start method
                signer.SetXml(StorageMock.GetSampleXmlDocumentContent());
                signer.SetPolicy(getSignaturePolicy());
                signer.SetSigningCertificate(signingCertificate);

                // Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
                signer.ComputeSignature();

                // Get the signed XML as an array of bytes
                signatureContent = signer.GetSignedXml();

            }
            catch (ValidationException ex)
            {
                // Some of the operations above may throw a ValidationException, for instance if the certificate is revoked.
                ModelState.AddModelError("", ex.ValidationResults.ToString());
                return View();
            }

            return View("SignatureInfo", new SignatureInfoModel()
            {
                // Store the signature file on the folder "App_Data/".
                // With this filename, it can show a link to download the signature file.
                
                File = StorageMock.Store(signatureContent, ".xml"),
                SignerCertificate = signingCertificate.Certificate
            });
        }

        // GET: XmlSignature/SignatureInfo
        [HttpGet]
        public ActionResult SignatureInfo()
        {
            // Recovery data from Conplete action, if returns null, it'll be redirected to Index 
            // action again.
            if (!(TempData["SignatureInfoModel"] is SignatureInfoModel model))
            {
                return RedirectToAction("Index");
            }

            return View(model);
        }
    }
}