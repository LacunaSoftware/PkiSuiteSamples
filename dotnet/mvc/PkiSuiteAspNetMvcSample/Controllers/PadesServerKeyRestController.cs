using Lacuna.RestPki.Api;
using Lacuna.RestPki.Api.PadesSignature;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using CertificateReference = Lacuna.RestPki.Client.CertificateReference;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class PadesServerKeyRestController : BaseController
    {

        public async Task<ActionResult> Index()
        {
            var file = "C:\\Users\\DanielRufino\\Documents\\PkiSuiteSamples\\dotnet\\mvc\\PkiSuiteAspNetMvcSample\\Content\\SamplePdf.pdf";

            // Read certificate and upload content to REST PKI
            var certificatePath = StorageMock.GetServerCertificatePath();
            var certificate = new X509Certificate2(certificatePath, "1234");

            // Prepare signature in REST PKI client and get signature parameters
            var starter = new PadesSignatureStarter(Util.GetRestPkiClient())
            {
                // Set the unit of measurement used to edit the pdf marks and visual representations.
                MeasurementUnits = PadesMeasurementUnits.Centimeters,

                // Set the signature policy.
                SignaturePolicyId = StandardPadesSignaturePolicies.Basic,

                // Set the security context to be used to determine trust in the certificate chain. We have
                // encapsulated the security context choice on Util.cs.
                SecurityContextId = Util.GetSecurityContextId(),

                // Set a visual representation for the signature.
                VisualRepresentation = PadesVisualElements.GetVisualRepresentationForRestPki(),

            };
            starter.SetSignerCertificate(certificate.RawData);

            starter.SetPdfToSign(file);

            var startResult = starter.Start();

            // Perform RSA signature using signature parameters and certificate reference

            var signature = certificate.GetRSAPrivateKey().SignHash(startResult.ToSignHash, startResult.DigestAlgorithm.HashAlgorithmName, RSASignaturePadding.Pkcs1);

            var finisher = new PadesSignatureFinisher2(Util.GetRestPkiClient())
            {
                Token = startResult.Token,
                Signature = signature


            };

            var result = finisher.Finish();

            // Store file
            string fileId;
            using (var resultStream = result.OpenRead())
            {
                fileId = StorageMock.Store(resultStream, ".pdf");
            }

            return View(new SignatureInfoModel()
            {
                File = fileId,
            });
        }
    }
}