using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using SignatureCompleteModel = PkiSuiteAspNetMvcSample.Models.RestCore.SignatureCompleteModel;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class PadesSignatureRestCoreController : BaseController {

		// GET: PadesSignatureRestCore?userfile=<file_id>
		public ActionResult Index(string userfile) {
			if (string.IsNullOrEmpty(userfile)) {
				return RedirectToAction("Index", "Home");
			}

			return View(new SignatureStartModel() {
				UserFile = userfile
			});
		}

		/**
		* POST: PadesSignatureRestCore?userfile=<file_id>
		*
		* This action is called once the user's certificate encoding has been read, and asks Rest PKI
		* Core to prepare the signature. Rest PKI Core returns the hash that needs to be actually signed
		* with the user's private key (the "to-sign-hash") and the signature state, which is needed on
		* the Complete action.
		*/
		[HttpPost]
		public async Task<ActionResult> Index(SignatureStartModel model) {

			// Verify if the userfile exists and get its absolute path.
			string userfilePath;
			if (!StorageMock.TryGetFile(model.UserFile, out userfilePath)) {
				return HttpNotFound();
			}

			// Get an instance of the Rest PKI Core service (see Util.GetRestPkiService()).
			var restPkiService = Util.GetRestPkiService();

			// Reference the file to be signed. The client uploads it to Rest PKI Core.
			var fileReference = FileReference.FromFile(userfilePath, model.UserFile);

			// Reference the user's certificate, read in the browser by Web PKI.
			var certificateReference = CertificateReference.FromBytes(model.CertContent);

			// Set the security context to be used to determine trust in the certificate chain. We have
			// encapsulated the security context choice on Util.cs.
			var signatureOptions = new PrepareSignatureOptions() {
				SecurityContextId = Util.GetSecurityContextId()
			};

			// This sample does not add a visual representation to the signature. Lacuna.RestPkiCore.Client
			// 1.13.0 can, through PrepareSignatureOptions.PdfSignatureOptions.VisualRepresentation (1.10.1
			// could not).

			PrepareSignatureResult prepareSignatureResult;
			try {

				// Prepare the signature. This yields the "to-sign-hash", the digest algorithm that must be
				// used on the client-side and the signature state.
				prepareSignatureResult = await restPkiService.PrepareSignatureAsync(fileReference, certificateReference, signatureOptions);

			} catch (PrepareSignatureException ex) {
				// Rest PKI Core refuses to prepare the signature if, for instance, the PDF is corrupted.
				//
				// It also refuses it if the certificate fails validation (for instance, if it is expired
				// or not trusted in the security context), but Lacuna.RestPkiCore.Client 1.13.0 cannot
				// read that failure ("CertificateValidationFailed"): it throws a JSON deserialization
				// error instead, which ends up on the error page (see BaseController.OnException()).
				ModelState.AddModelError("", ex.Message);
				return View(model);
			}

			// On the next step (Complete action), we'll need once again some information:
			// - The thumbprint of the selected certificate.
			// - The "to-sign-hash" to be signed. (see signature-complete-form.js)
			// - The OID of the digest algorithm to be used during the signature operation.
			// - The signature state, which Rest PKI Core needs to complete the signature.
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureCompleteModel"] = new SignatureCompleteModel() {
				CertThumb = model.CertThumb,
				ToSignHash = prepareSignatureResult.ToSignHash.Value,
				DigestAlgorithmOid = prepareSignatureResult.ToSignHash.Algorithm.Oid,
				State = prepareSignatureResult.State
			};

			return RedirectToAction("Complete", new { userfile = model.UserFile });
		}

		// GET: PadesSignatureRestCore/Complete?userfile=<file_id>
		[HttpGet]
		public ActionResult Complete(string userfile) {

			// Recover data from Index action, if returns null, it'll be redirected to Index action
			// again.
			var model = TempData["SignatureCompleteModel"] as SignatureCompleteModel;
			if (model == null) {
				return RedirectToAction("Index", new { userfile });
			}

			return View(model);
		}

		/**
		* POST: PadesSignatureRestCore/Complete
		*
		* This action is called once the "to-sign-hash" is signed using the user's certificate. It asks
		* Rest PKI Core to complete the signature and redirects to the SignatureInfo action.
		*/
		[HttpPost]
		public async Task<ActionResult> Complete(SignatureCompleteModel model) {

			// Get an instance of the Rest PKI Core service.
			var restPkiService = Util.GetRestPkiService();

			Document signedDocument;
			try {

				// Complete the signature with the signature state (rendered in a hidden field, see the
				// view) and the signature computed on the client-side. Rest PKI Core validates the
				// signer's certificate and the resulting signature.
				signedDocument = await restPkiService.CompleteSignatureAsync(model.State, model.Signature);

			} catch (ValidationException ex) {
				// Rest PKI Core throws a ValidationException if, for instance, the certificate is
				// revoked.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View(model);
			}

			// Store the signed PDF on the folder "App_Data/". In a real application, you'd typically
			// store it on your database.
			string signedFileId;
			using (var signedFileStream = await signedDocument.SignedFile.OpenReadAsync()) {
				signedFileId = StorageMock.Store(signedFileStream, ".pdf");
			}

			// On the next step (SignatureInfo action), we'll render a link to download the signed file.
			// We'll store its filename on TempData, which is a dictionary shared between actions.
			TempData["SignatureInfoModel"] = new SignatureInfoModel() {
				File = signedFileId
			};

			return RedirectToAction("SignatureInfo");
		}

		// GET: PadesSignatureRestCore/SignatureInfo
		[HttpGet]
		public ActionResult SignatureInfo() {

			// Recover data from Complete action, if returns null, it'll be redirected to Index action
			// again.
			var model = TempData["SignatureInfoModel"] as SignatureInfoModel;
			if (model == null) {
				return RedirectToAction("Index");
			}

			return View(model);
		}
	}
}
