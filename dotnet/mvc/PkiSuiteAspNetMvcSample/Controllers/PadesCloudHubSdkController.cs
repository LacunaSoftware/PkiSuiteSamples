using Lacuna.Cloudhub.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System.Web.Mvc;
using Lacuna.Cloudhub.Api;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Lacuna.Pki;
using Lacuna.Pki.Pades;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class PadesCloudHubSdkController : Controller
    {
        CloudhubClient cloudhubClient = Util.GetCloudhubClient();
        private const string RedirectUrl = "http://localhost:54123/PadesCloudHubSdk/Complete";
        
        private IPadesPolicyMapper GetSignaturePolicy()
        {

            // Get our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator()).
            var arbitrator = Util.GetTrustArbitrator();

            return PadesPoliciesForGeneration.GetPadesBasic(arbitrator);
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> Discover(string cpf)
        {

            var plainCpf = Regex.Replace(cpf, @"[.-]+", "");


            var sessionRequest = new SessionCreateRequest
            {
                Identifier = plainCpf,
                RedirectUri = RedirectUrl,
                Type = Lacuna.Cloudhub.Api.TrustServiceSessionTypes.SignatureSession,
            };

            SessionModel session = await cloudhubClient.CreateSessionAsync(sessionRequest);

            return View(new PadesCloudHubSdkModel()
            {
                Services = session.Services,
                Cpf = plainCpf,

            });

        }

        [HttpGet]
        public async Task<ActionResult> Complete(string session)
        {
            byte[] toSignBytes, transferData;
            SignatureAlgorithm signatureAlg;
           

           

            // The PKCertificateAuthentication class requires an implementation of INonceStore. We'll use the
            // FileSystemNonceStore class.
            var nonceStore = Util.GetNonceStore();

            // We'll use the session to retrieve the user certificate and start the authentication process.
            var cert = await cloudhubClient.GetCertificateAsync(session);
            var certDecoded = PKCertificate.Decode(cert);

            // Get an instance of the PadesSigner class.
            var padesSigner = new PadesSigner();

            var docToBeSigned = StorageMock.GetSampleDocPath(SampleDocs.SamplePdf);
            // Set the file to be signed.
            padesSigner.SetPdfToSign(docToBeSigned);

            // Set the signer certificate.
            padesSigner.SetSigningCertificate(certDecoded);

            // Set the signature policy.
            padesSigner.SetPolicy(GetSignaturePolicy());

            // Set a visual representation for the signature.
            padesSigner.SetVisualRepresentation(PadesVisualElements.GetVisualRepresentationForPkiSdk(certDecoded));

            // Generate the "to-sign-bytes". This method also yields the signature algorithm that must
            // be used on the client-side, based on the signature policy, as well as the "transfer data",
            // a byte-array that will be needed on the next step.
            toSignBytes = padesSigner.GetToSignBytes(out signatureAlg, out transferData);

            var toSignHash = signatureAlg.DigestAlgorithm.ComputeHash(toSignBytes);


            var signature = await cloudhubClient.SignHashAsync(new Lacuna.Cloudhub.Api.SignHashRequest()
            {
                DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid,
                Hash = toSignHash,
                Session = session
            });

            // Set the signature policy.
            padesSigner.SetPolicy(GetSignaturePolicy());

            // Set the signature computed on the client-side, along with the "transfer data" (rendered in a hidden field, see the view)
            padesSigner.SetPreComputedSignature(signature, transferData);

            // Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
            padesSigner.ComputeSignature();

            // Get the signed PDF as an array of bytes
            var signatureContent = padesSigner.GetPadesSignature();


            var model = new SignatureInfoModel()
            {

                // Store the signature file on the folder "App_Data/" and redirects to the SignatureInfo action with the filename.
                // With this filename, it can show a link to download the signature file.
                File = StorageMock.Store(signatureContent, ".pdf")
            };

            return View(model);
        }
    }


}

