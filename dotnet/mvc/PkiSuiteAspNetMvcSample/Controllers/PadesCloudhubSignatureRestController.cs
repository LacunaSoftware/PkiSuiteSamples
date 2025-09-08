using Lacuna.Pki;
using Lacuna.Pki.BrazilTrustServices;
using Lacuna.Pki.Pades;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes; // This covers StorageMock and SampleDocs
using PkiSuiteAspNetMvcSample.Models.Rest; // Updated namespace
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Lacuna.Cloudhub.Client;
using Lacuna.Cloudhub.Api;
using Lacuna.RestPki.Api;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class PadesCloudhubSignatureRestController : BaseController
    {
        private const string RedirectUrl = "http://localhost:54123/PadesCloudhubSignatureRest/CloudHubCallback?fileId=";
        CloudhubClient cloudhubClient = Util.GetCloudhubClient();

        [HttpGet]
        public ActionResult Index(string userfile)
        {

            var model = new PadesCloudhubSignatureRestModel()
            {
                FileId = userfile
            };
            return View("Index", model);
        }

        [HttpPost]
        public async Task<ActionResult> CloudLogin(string cpf, string fileId)
        {
            var plainCpf = Regex.Replace(cpf, @"[.-]+", "");

            var sessionRequest = new SessionCreateRequest
            {
                Identifier = plainCpf,
                RedirectUri = RedirectUrl + fileId,
                Type = Lacuna.Cloudhub.Api.TrustServiceSessionTypes.SingleSignature,
            };

            SessionModel session = await cloudhubClient.CreateSessionAsync(sessionRequest);

            return View(new PadesCloudhubSignatureRestModel()
            {
                Services = session.Services,
                Cpf = plainCpf,
                FileId = fileId,
                CloudHubSession = session
            });
        }

        public async Task<ActionResult> CloudHubCallback(string session, string fileId)
        {

            // Verify if the userfile exists and get its absolute path.
            string userfilePath;
            if (!StorageMock.TryGetFile(fileId, out userfilePath)) {
                return HttpNotFound();
            }
            // We'll use the session to retrieve the user certificate and start the authentication process.
            var cert = await cloudhubClient.GetCertificateAsync(session);

            // Get an instance of the RestPkiService
            var restPkiService = Util.GetRestPkiService();

            // Instantiate the PadesSignatureStarter class
            var signatureStarter = new PadesSignatureStarter(Util.GetRestPkiClient());

            // Set the PDF to be signed
            signatureStarter.SetPdfToSign(userfilePath);

            // Set the certificate to be used in the signature.
            signatureStarter.SetSignerCertificate(cert);

            // Set the signature policy.
            signatureStarter.SetSignaturePolicy(StandardPadesSignaturePolicies.Basic);

            // Set a SecurityContext to be used in the signature. We use the one that references Rest PKI. 
            signatureStarter.SetSecurityContext(Util.GetSecurityContextId());

            // Call the Start() method, which will contact Rest PKI and return information necessary to
            // perform the client-side signature.
            var signatureStartResult = await signatureStarter.StartAsync();

            // Use cloudhub to perform the hash signature returned from the Rest PKI's start() method
            var signHashResult = await cloudhubClient.SignHashAsync(new SignHashRequest() { 
                Session = session,
                Hash = signatureStartResult.ToSignHash,
                DigestAlgorithmOid = signatureStartResult.DigestAlgorithmOid,
                DigestAlgorithm = signatureStartResult.DigestAlgorithm.Name
            });

            // Get an instance of the PadesSignatureFinisher2 class, responsible for completing the
            // signature process.
            var signatureFinisher = new PadesSignatureFinisher2(Util.GetRestPkiClient())
            {
                Token = signatureStartResult.Token,
                Signature = signHashResult
            };

            // Call the Finish() method, which finalizes the signature process and returns a
            // SignatureResult object.
            var result = await signatureFinisher.FinishAsync();

            // The "Certificate" property of the SignatureResult object contains information about the
            // certificate used by the user to sign the file.
            var signerCert = result.Certificate;

            // At this point, you'd typically store the signed PDF on your database. For demonstration
            // purposes, we'll store the PDF on our mock Storage class.

            // The SignatureResult object has various methods for writing the signature file to a stream
            // (WriteTo()), local file (WriteToFile()), open a stream to read the content (OpenRead()) and
            // get its contents (GetContent()). For large files, avoid the method GetContent() to avoid
            // memory allocation issues.
            string fileResult;
            using (var resultStream = result.OpenRead()) {
                fileResult = StorageMock.Store(resultStream, ".pdf");
            }

            return View("SignatureInfo", new SignatureInfoModel()
            {
                File = fileResult,
                SignerCertificate = signerCert
            });
        }

    }
}
