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
        CloudhubClient cloudhubClient = new CloudhubClient("https://cloudhub.lacunasoftware.com", "ftulJuCci2cUjkdecTu/fAsUePv8ahga+CRvgKPFmCc=");

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> CloudLogin(string cpf)
        {

            var plainCpf = Regex.Replace(cpf, @"[.-]+", "");

            /*Create a SessionRequest for Cloudhub to identify the certificates available 
            *This action will be called after the user press the button "Search" on index page.It will
            *search for all PSCs that have a certificate with the provided identifier.Thus, it will start the
            *authentication process and return a session.
            */

            var sessionRequest = new SessionCreateRequest
            {
                Identifier = plainCpf,
                RedirectUri = RedirectUrl,
                Type = Lacuna.Cloudhub.Api.TrustServiceSessionTypes.SingleSignature,
            };

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
            var cert = await cloudhubClient.GetCertificateAsync(session);

            // Instantiate the PKCertificateAuthentication class passing our EntityFrameworkNonceStore.
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
                // The authentication failed, redirect and inform in index view.
                TempData["ValidationResults"] = vr;
                return RedirectToAction("Index");
            }

            // At this point, you have assurance that the certificate is valid  and that the user is indeed the
            // certificate's subject. Now, you'd typically query your database for a user that matches one of
            // the certificate's fields, such as userCert.EmailAddress or userCert.PkiBrazil.CPF (the actual
            // field to be used as key depends on your application's business logic) and set the user ID on
            // the auth cookie. For demonstration purposes, we'll set the email address directly on the
            // cookie as if it were the user ID.
            return View("AuthenticationInfo", new AuthenticationInfoModel()
            {
                UserCert = certificate

            });
        }
    }
}