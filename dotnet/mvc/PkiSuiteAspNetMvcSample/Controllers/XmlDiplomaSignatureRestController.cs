using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Rest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class XmlDiplomaSignatureRestController : Controller
    {
        public async Task<ActionResult> Index()
        {


            var signatureStarter = new XmlElementSignatureStarter(Util.GetRestPkiClient());

            signatureStarter.SetXml(StorageMock.GetSampleXmlDiplomaPath());

            signatureStarter.SetToSignElementId("Dip35141214314050000662550010001084271182362300");

            signatureStarter.SetSignaturePolicy(new Guid("826b3a00-3400-4236-90d9-40917b0cc83b"));

            signatureStarter.SetSecurityContext(Util.GetSecurityContextId());

            var token = signatureStarter.StartWithWebPki();

            return View(new SignatureModel()
            {
                Token = token
            });
        }

        [HttpPost]
        public async Task<ActionResult> Index(SignatureModel model)
        {

            var signatureFinisher = new XmlSignatureFinisher(Util.GetRestPkiClient())
            {
                Token = model.Token
            };
            var signedXml = await signatureFinisher.FinishAsync();

            var signerCert = signatureFinisher.GetCertificateInfo();

            var fileId = StorageMock.Store(signedXml, ".xml");

            return View("SignatureInfo", new SignatureInfoModel()
            {
                File = fileId,
                SignerCertificate = signerCert
            });








        }
    }
}