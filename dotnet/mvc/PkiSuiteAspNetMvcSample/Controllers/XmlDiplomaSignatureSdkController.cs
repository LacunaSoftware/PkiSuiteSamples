
using PkiSuiteAspNetMvcSample.Classes;
using Lacuna.Pki;
using PkiSuiteAspNetMvcSample.Models.Rest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Lacuna.Pki.Xml;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using SignatureInfoModel = PkiSuiteAspNetMvcSample.Models.Sdk.SignatureInfoModel;
using System.IO;
using System.Web.WebPages;

namespace PkiSuiteAspNetMvcSample.Controllers {
    public class XmlDiplomaSignatureSdkController : Controller {
        private XmlPolicySpec getSignaturePolicy() {

            var policy = BrazilXmlPolicySpec.GetAdrBasicaV24();

#if DEBUG
            // During debug only, we clear the policy's default trust arbitrator (which, in the case of
            // the policy returned by BrazilXmlPolicySpec.GetNFePadraoNacional(), corresponds to the ICP-Brasil roots only),
            // and use our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator())
            policy.ClearTrustArbitrators();
            policy.AddTrustArbitrator(Util.GetTrustArbitrator());
#endif

            return policy;
        }

        [HttpGet]
        public ActionResult Index() {
            return View("Index");
        }

        [HttpPost]
        public ActionResult Index(SignatureStartModel model) {

            byte[] toSignHash, transferData;
            SignatureAlgorithm signatureAlg;
            try {

                var signer = new XmlElementSigner();

                signer.SetXml(StorageMock.GetSampleXmlDiplomaDocument());

                signer.SetToSignElementId("Dip35141214314050000662550010001084271182362300");

                signer.SetSignatureElementLocation(".", new NamespaceManager(), XmlInsertionOptions.AppendChild);

                signer.SetPolicy(getSignaturePolicy());

                signer.SetSigningCertificate(PKCertificate.Decode(model.CertContent));

                toSignHash = signer.GenerateToSignHash(out signatureAlg, out transferData);


            } catch (ValidationException ex) {
                // Some of the operations above may throw a ValidationException, for instance if the certificate
                // encoding cannot be read or if the certificate is expired. 
                ModelState.AddModelError("", ex.ValidationResults.ToString());
                return View();
            }

            TempData["SignatureCompleteModel"] = new ExtendedSignatureCompleteModel() {
                CertThumb = model.CertThumb,
                TransferDataFileId = StorageMock.Store(transferData, ".bin"),
                ToSignHash = toSignHash,
                DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid
            };

            return RedirectToAction("Complete");
        }

        // GET: XmlElementSignature/Complete
        [HttpGet]
        public ActionResult Complete(string redirectAction = "", string userFile = "") {

            // Recovery data from Index action, if returns null, it'll be redirected to Index 
            // action again.
            var model = TempData["SignatureCompleteModel"] as ExtendedSignatureCompleteModel;
            if (model == null) {
                return RedirectToAction("Index");
            }
            model.UserFile = userFile;
            model.RedirectAction = redirectAction;
            return View(model);
        }

        /**
		 * POST: XmlElementSignature/Complete
		 * 
		 * This action is called once the "to-sign-hash" are signed using the user's certificate. After signature,
		 * it'll be redirect to SignatureInfo action to show the signature file.
		 */
        [HttpPost]
        public ActionResult Complete(ExtendedSignatureCompleteModel model) {

            byte[] signatureContent;

            try {

                // Recover the "transfer data" content stored in a temporary file.
                byte[] transferDataContent;
                byte[] userFileContent = StorageMock.GetSampleXmlDiplomaDocument();
                if (!StorageMock.TryGetFile(model.TransferDataFileId, out transferDataContent)) {
                    return HttpNotFound("File not found");
                }

                if (!model.UserFile.IsEmpty()) {
                    if (!StorageMock.TryGetFile(model.UserFile, out userFileContent)) {
                        return HttpNotFound("File not found");
                    }
                }

                // Instantiate a XmlSigner class based on the step you're currently in
                XmlSigner signer;
                if (model.RedirectAction != null && model.RedirectAction.Equals("Full")) {
                    signer = new FullXmlSigner();
                } else {
                    signer = new XmlElementSigner();
                }
                // Set the document to be signed and the policy, exactly like in the Start method
                signer.SetXml(userFileContent);
                signer.SetPolicy(getSignaturePolicy());
                // Set the signature computed on the client-side, along with the "transfer data" (rendered in a hidden field, see the view)
                signer.SetPrecomputedSignature(model.Signature, transferDataContent);

                // Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
                signer.ComputeSignature();

                // Get the signed XML as an array of bytes
                signatureContent = signer.GetSignedXml();

            } catch (ValidationException ex) {
                // Some of the operations above may throw a ValidationException, for instance if the certificate is revoked.
                ModelState.AddModelError("", ex.ValidationResults.ToString());
                return View();
            }

            // On the next step (SignatureInfo action), we'll render the following information:]
            // - The filename to be available to download in next action.
            // - The signer's certificate information to be rendered.
            // We'll store these values on TempData, which is a dictionary shared between actions.
            TempData["SignatureInfoModel"] = new SignatureInfoModel() {

                // Store the signature file on the folder "App_Data/" and redirects to the SignatureInfo action with the filename.
                // With this filename, it can show a link to download the signature file.
                File = StorageMock.Store(signatureContent, ".xml")
            };

            return RedirectToAction("SignatureInfo", new { viewName = model.RedirectAction });
        }

        // GET: XmlSignature/SignatureInfo
        [HttpGet]
        public ActionResult SignatureInfo(string viewName = "") {
            // Recover data from TempData
            if (!(TempData["SignatureInfoModel"] is SignatureInfoModel model)) {
                // If TempData is null, redirect back to the default view or handle appropriately
                return RedirectToAction("Index");
            }

            // Dynamically return the specified view
            return View("SignatureInfo" + viewName, model);
        }

        [HttpGet]
        public ActionResult IndexRegistro(string userFile, string redirectAction) {
            string userFilePath;
            if (!StorageMock.TryGetFile(userFile, out userFilePath)) {
                return HttpNotFound("File not found");
            }
            return View(new SignatureStartModel() {
                UserFile = userFile
            });
        }

        [HttpPost]
        public ActionResult IndexRegistro(SignatureStartModel model) {

            byte[] toSignHash, transferData;
            SignatureAlgorithm signatureAlg;

            // Recover the "transfer data" content stored in a temporary file.
            byte[] toSignFileContent;
            if (!StorageMock.TryGetFile(model.UserFile, out toSignFileContent)) {
                return HttpNotFound("File not found");
            }

            try {
                var signer = new XmlElementSigner();

                signer.SetXml(toSignFileContent);

                signer.SetToSignElementId("Reg35141214314050000662550010001084271182362300");

                signer.SetSignatureElementLocation(".", new NamespaceManager(), XmlInsertionOptions.AppendChild);

                signer.SetPolicy(getSignaturePolicy());

                signer.SetSigningCertificate(PKCertificate.Decode(model.CertContent));

                toSignHash = signer.GenerateToSignHash(out signatureAlg, out transferData);

            } catch (ValidationException ex) {
                // Some of the operations above may throw a ValidationException, for instance if the certificate
                // encoding cannot be read or if the certificate is expired. 
                ModelState.AddModelError("", ex.ValidationResults.ToString());
                return View();
            }

            TempData["SignatureCompleteModel"] = new ExtendedSignatureCompleteModel() {
                CertThumb = model.CertThumb,
                TransferDataFileId = StorageMock.Store(transferData, ".bin"),
                ToSignHash = toSignHash,
                DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid
            };

            return RedirectToAction("Complete", new { redirectAction = "Registro", userFile = model.UserFile });
        }

        [HttpGet]
        public ActionResult IndexFull(string userFile, string redirectAction) {
            string userFilePath;
            if (!StorageMock.TryGetFile(userFile, out userFilePath)) {
                return HttpNotFound("File not found");
            }
            return View(new SignatureStartModel() {
                UserFile = userFile
            });
        }

        [HttpPost]
        public ActionResult IndexFull(SignatureStartModel model) {

            byte[] toSignHash, transferData;
            SignatureAlgorithm signatureAlg;

            // Recover the "transfer data" content stored in a temporary file.
            byte[] toSignFileContent;
            if (!StorageMock.TryGetFile(model.UserFile, out toSignFileContent)) {
                return HttpNotFound("File not found");
            }

            try {
                var signer = new FullXmlSigner();

                signer.SetXml(toSignFileContent);

                signer.SetSignatureElementLocation(".", new NamespaceManager(), XmlInsertionOptions.AppendChild);

                signer.SetPolicy(getSignaturePolicy());

                signer.SetSigningCertificate(PKCertificate.Decode(model.CertContent));

                toSignHash = signer.GenerateToSignHash(out signatureAlg, out transferData);

            } catch (ValidationException ex) {
                // Some of the operations above may throw a ValidationException, for instance if the certificate
                // encoding cannot be read or if the certificate is expired. 
                ModelState.AddModelError("", ex.ValidationResults.ToString());
                return View();
            }

            TempData["SignatureCompleteModel"] = new ExtendedSignatureCompleteModel() {
                CertThumb = model.CertThumb,
                TransferDataFileId = StorageMock.Store(transferData, ".bin"),
                ToSignHash = toSignHash,
                DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid
            };

            return RedirectToAction("Complete", new { redirectAction = "Full", userFile = model.UserFile });
        }
    }

}
