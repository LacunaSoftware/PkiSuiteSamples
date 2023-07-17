using Lacuna.Pki;
using Lacuna.Pki.BrazilTrustServices;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class AuthenticationCloudSdkController : Controller
    {
        private const string RedirectUrl = "http://localhost:54123/AuthenticationCloudSdk/Complete";
        /** GET: AuthenticationCloudSdk
		 * 
		 * This action will render a page that request a CPF to the user. This CPF is used to discover
		 * which PSCs have a certificate containing that CPF.
		 */
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        /**
		 * POST /AuthenticationCloudSdk/Discover
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
        public async Task<ActionResult> Discover(string cpf)
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
            var services = await manager.DiscoverByCpfAndStartAuthAsync(plainCpf, RedirectUrl, TrustServiceSessionTypes.AuthenticationSession);

            // Render complete page.
            return View(new PadesCloudOauthModel()
            {
                Services = services,
                Cpf = cpf
            });
        }

        /**
		 * GET /AuthenticationCloudSdk/Complete
		 * 
		 * This action will complete the authentication process and create a signature using a sessionRequest
		 * token returned by user. Also, we recover the parameter "customState" containing the id of the
		 * file that will be signed.
		 */
        public async Task<ActionResult> Complete(string code, string state)
        {
            byte[] signatureContent;
            PKCertificateWithKey signingCertificate;

            // Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
            // and handling the OAuth flow.
            var manager = Util.GetTrustServicesManager();

            // The PKCertificateAuthentication class requires an implementation of INonceStore. We'll use the
            // FileSystemNonceStore class.
            var nonceStore = Util.GetNonceStore();

            // Instantiate the PKCertificateAuthentication class passing our EntityFrameworkNonceStore.
            var certAuth = new PKCertificateAuthentication(nonceStore);

            // Call the Start() method, which is the first of the two server-side steps. This yields the nonce,
            // a 16-byte-array which we'll send to the view.
            var nonce = certAuth.Start();

            // Notice that this previous will be executed even if an error has occured and it was redirected to
            // this action.
            var model = new AuthenticationModel()
            {
                Nonce = nonce,
                DigestAlgorithm = PKCertificateAuthentication.DigestAlgorithm.Oid
            };

            // Complete the authentication process, recovering the sessionRequest info to be used on the
            // signature and the custom state (fileId).
            var completeAuthResult = await manager.CompleteAuthAsync(code, state);
            var certList = await completeAuthResult.GetCertificatesWithKeyAsync();
            var certificateResult = certList.First();
            var signature = certificateResult.SignHash(PKCertificateAuthentication.DigestAlgorithm, nonce);

            // Call the Complete() method, which is the last of the two server-side steps. It receives:
            // - The nonce which was signed using the user's certificate.
            // - The user's certificate encoding.
            // - The nonce signature.
            // - A TrustArbitrator to be used to determine trust in the certificate.
            // The call yields:
            // - A ValidationResults which denotes whether the authentication was successful or not.
            // - The user's decoded certificate.
            PKCertificate certificate;
            var vr = certAuth.Complete(nonce, certificateResult.Certificate.EncodedValue, signature, Util.GetTrustArbitrator(), out certificate) ;

            // Check the authentication result
            if (!vr.IsValid)
            {
                // The authentication failed, redirect and inform in index view.
                TempData["ValidationResults"] = vr;
                return RedirectToAction("Index");
            }

            // At this point, you have assurance that the certificate is valid according to the
            // TrustArbitrator you selected when starting the authentication and that the user is indeed the
            // certificate's subject. Now, you'd typically query your database for a user that matches one of
            // the certificate's fields, such as userCert.EmailAddress or userCert.PkiBrazil.CPF (the actual
            // field to be used as key depends on your application's business logic) and set the user ID on
            // the auth cookie. For demonstration purposes, we'll set the email address directly on the
            // cookie as if it were the user ID.
            return View("Success", new AuthenticationInfoModel()
            {
                UserCert = PKCertificate.Decode(model.Certificate)
            });
        }
    }
}
