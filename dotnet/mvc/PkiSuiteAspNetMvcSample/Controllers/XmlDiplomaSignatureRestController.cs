using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Rest;
using System;
using System.Collections.Generic;
using System.IO;
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
        public async Task<ActionResult> DadosDiploma(SignatureModel model)
        {

            var signatureFinisher = new XmlSignatureFinisher(Util.GetRestPkiClient())
            {
                Token = model.Token
            };
            var signedDiplomaXml = await signatureFinisher.FinishAsync();

            var fileId = StorageMock.Store(signedDiplomaXml, ".xml");

            var signerCert = signatureFinisher.GetCertificateInfo();


            return View( new SignatureXmlModel()
            {
                UserFile = fileId,
            });

        }

        public async Task<ActionResult> Registro(string file)
        {
            string userfilePath;
            if (!StorageMock.TryGetFile(file, out userfilePath))
            {
                return HttpNotFound();
            }


            var signatureStarter = new XmlElementSignatureStarter(Util.GetRestPkiClient());

            signatureStarter.SetXml(userfilePath);

            signatureStarter.SetToSignElementId("Dip35141214314050000662550010001084271182362300");

            signatureStarter.SetSignaturePolicy(new Guid("826b3a00-3400-4236-90d9-40917b0cc83b"));

            signatureStarter.SetSecurityContext(Util.GetSecurityContextId());

            var token = signatureStarter.StartWithWebPki();

            return View(new SignatureModel()
            {
                Token = token,
            });
        }

        [HttpPost]
        public async Task<ActionResult> DadosRegistro(SignatureModel model)
        {


            var signatureFinisher = new XmlSignatureFinisher(Util.GetRestPkiClient())
            {
                Token = model.Token
            };
            var signedDiplomaXml = await signatureFinisher.FinishAsync();


            var fileId = StorageMock.Store(signedDiplomaXml, ".xml");

            return View("DadosRegistro", new SignatureXmlModel()
            {
                UserFile = fileId,
            });

        }
        public async Task<ActionResult> FullDiploma(string file)
        {
            string userfilePath;
            if (!StorageMock.TryGetFile(file, out userfilePath))
            {
                return HttpNotFound();
            }

            var signatureStarter = new FullXmlSignatureStarter(Util.GetRestPkiClient());

            signatureStarter.SetXml(userfilePath);


            signatureStarter.SetSignaturePolicy(new Guid("5b8c0710-006d-434d-bf35-12292b56b90a"));

            signatureStarter.SetSecurityContext(Util.GetSecurityContextId());

            var token = signatureStarter.StartWithWebPki();

            return View(new SignatureModel()
            {
                Token = token,
            });
        }

        [HttpPost]
        public async Task<ActionResult> Diploma(SignatureModel model)
        {

            var signatureFinisher = new XmlSignatureFinisher(Util.GetRestPkiClient())
            {
                Token = model.Token
            };
            var signedXml = await signatureFinisher.FinishAsync();

            var signerCert = signatureFinisher.GetCertificateInfo();

            var fileId = StorageMock.Store(signedXml, ".xml");

            return View(new SignatureXmlModel()
            {
                UserFile = fileId
            });

        }

    }
}