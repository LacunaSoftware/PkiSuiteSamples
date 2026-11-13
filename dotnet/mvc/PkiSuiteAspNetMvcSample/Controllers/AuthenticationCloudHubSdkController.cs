using Lacuna.Pki;
using Lacuna.Pki.BrazilTrustServices;
using Lacuna.Pki.Pades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using Lacuna.Cloudhub.Client;
using Lacuna.Cloudhub.Api;

namespace PkiSuiteAspNetMvcSample.Controllers
{

    public class AuthenticationCloudHubSdkController : Controller
    {

        private const string RedirectUrl = "http://localhost:54123/AuthenticationCloudHubSdk/CloudHubCallBack";

        [HttpGet]
        public ActionResult Index()
        {
            // If this action is called because the authentication failed, show the validation results.
            var vr = TempData["ValidationResults"] as ValidationResults;
            if (vr != null && !vr.IsValid)
            {
                ModelState.AddModelError("", vr.ToString());
            }
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> CloudLogin(string cpf)
        {

            var plainCpf = Regex.Replace(cpf, @"[.-]+", "");

            /* Create a SessionRequest for CloudHub to identify the available certificates.
            * This action is called after the user clicks the "Search" button on the Index page. It
            * searches for all PSCs that have a certificate with the provided identifier. Thus, it starts the
            * authentication process and returns a session.
            */

            var sessionRequest = new SessionCreateRequest
            {
                Identifier = plainCpf,
                RedirectUri = RedirectUrl,
                Type = Lacuna.Cloudhub.Api.TrustServiceSessionTypes.SingleSignature,
            };

            var cloudhubClient = Util.GetCloudhubClient();
            SessionModel session = await cloudhubClient.CreateSessionAsync(sessionRequest);

            return View(new AuthenticationCloudHubSdkModel()
            {
                Services = session.Services,
                Cpf = plainCpf,

            });
        }

        public async Task<ActionResult> CloudHubCallBack(string session)
        {

            // The PKCertificateAuthentication class requires an implementation of INonceStore. We'll use the
            // FileSystemNonceStore class.
            var nonceStore = Util.GetNonceStore();

            // We'll use the session to retrieve the user certificate and start the authentication process.
            var cloudhubClient = Util.GetCloudhubClient();
            var cert = await cloudhubClient.GetCertificateAsync(session);

            // Instantiate the PKCertificateAuthentication class passing our nonce store.
            var certAuth = new PKCertificateAuthentication(nonceStore);


            // Call the Start() method to create a nonce 
            var nonce = certAuth.Start();

            var model = new AuthenticationModel()
            {
                Nonce = nonce,
                DigestAlgorithm = PKCertificateAuthentication.DigestAlgorithm.Oid
            };

            // Use the nonce to create a hash value to be signed.
            var nonceHash = PKCertificateAuthentication.DigestAlgorithm.ComputeHash(nonce);

            // Sign the hash value to return the signature 
            var signature = await cloudhubClient.SignHashAsync(new Lacuna.Cloudhub.Api.SignHashRequest()
            {
                DigestAlgorithmOid = model.DigestAlgorithm,
                Hash = nonceHash,
                Session = session
            });

            PKCertificate certificate;

            var vr = certAuth.Complete(nonce, cert, signature, Util.GetTrustArbitrator(), out certificate);

            if (!vr.IsValid)
            {
                // The authentication failed. Redirect to the Index action, which shows the validation results.
                TempData["ValidationResults"] = vr;
                return RedirectToAction("Index");
            }

            // At this point, you have assurance that the certificate is valid and that the user is indeed the
            // certificate's subject. Now, you'd typically query your database for a user that matches one of
            // the certificate's fields, such as userCert.EmailAddress or userCert.PkiBrazil.CPF (the actual
            // field to be used as key depends on your application's business logic) and set the user ID on
            // the auth cookie. For demonstration purposes, we'll just render the certificate's information.
            return View("AuthenticationInfo", new AuthenticationInfoModel()
            {
                UserCert = certificate

            });
        }
    }
}