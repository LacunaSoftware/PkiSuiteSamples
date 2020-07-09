using Lacuna.Pki;
using Lacuna.Pki.Pades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class PadesSignatureSdkController : BaseController {

		private IPadesPolicyMapper GetSignaturePolicy() {

			// Get our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator()).
			var arbitrator = Util.GetTrustArbitrator();

			return PadesPoliciesForGeneration.GetPadesBasic(arbitrator);
		}

		// GET: PadesSignature
		public ActionResult Index(string userfile) {
			if (string.IsNullOrEmpty(userfile)) {
				return RedirectToAction("Index", "Home");
			}

			return View(new SignatureStartModel() {
				UserFile = userfile
			});
		}

		/**
		* POST: PadesSignature
		* 
		* This action is called once the user's certificate encoding has been read, and contains the 
		* logic to prepare the hash that needs to be actually signed with the user's private key
		* (the "to-sign-hash").
		*/
		[HttpPost]
		public ActionResult Index(SignatureStartModel model) {

			byte[] toSignBytes, transferData;
			SignatureAlgorithm signatureAlg;

			try {

				// Verify if the userfile exists and get its absolute path.
				string userfilePath;
				if (!StorageMock.TryGetFile(model.UserFile, out userfilePath)) {
					return HttpNotFound();
				}

				// Decode the user's certificate.
				var cert = PKCertificate.Decode(model.CertContent);

				// Get an instance of the PadesSigner class.
				var padesSigner = new PadesSigner();

				// Set the file to be signed.
				padesSigner.SetPdfToSign(userfilePath);

				// Set the signer certificate.
				padesSigner.SetSigningCertificate(cert);

				// Set the signature policy.
				padesSigner.SetPolicy(GetSignaturePolicy());

				// Set a visual representation for the signature.
				padesSigner.SetVisualRepresentation(PadesVisualElements.GetVisualRepresentationForPkiSdk(cert));

				// Generate the "to-sign-bytes". This method also yields the signature algorithm that must
				// be used on the client-side, based on the signature policy, as well as the "transfer data",
				// a byte-array that will be needed on the next step.
				toSignBytes = padesSigner.GetToSignBytes(out signatureAlg, out transferData);

			} catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate
				// encoding cannot be read or if the certificate is expired.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View();
			}

			// On the next step (Complete action), we'll need once again some information:
			// - The thumbprint of the selected certificate.
			// - The "transfer data" used to validate the signature in complete action. Its content is stored in
			//   a temporary file (with extension .bin) to be shared with the Complete action.
			// - The "to-sign-hash" (digest of the "to-sign-bytes") to be signed. (see signature-complete-form.js)
			// - The OID of the digest algorithm to be used during the signature operation.
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureCompleteModel"] = new SignatureCompleteModel() {
				CertThumb = model.CertThumb,
				TransferDataFileId = StorageMock.Store(transferData, ".bin"),
				ToSignHash = signatureAlg.DigestAlgorithm.ComputeHash(toSignBytes),
				DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid
			};

			return RedirectToAction("Complete", new { userfile = model.UserFile });
		}

		// GET: CadesSignature/Complete?userfile=<file_id>
		[HttpGet]
		public ActionResult Complete(string userfile) {

			// Recovery data from Index action, if returns null, it'll be redirected to Index 
			// action again.
			var model = TempData["SignatureCompleteModel"] as SignatureCompleteModel;
			if (model == null) {
				return RedirectToAction("Index", new { userfile });
			}

			return View(model);
		}

		/**
		* POST: CadesSignature/Complete
		* 
		* This action is called once the "to-sign-hash" are signed using the user's certificate. After signature,
		* it'll be redirect to SignatureInfo action to show the signature file.
		*/
		[HttpPost]
		public ActionResult Complete(SignatureCompleteModel model) {
			byte[] signatureContent;

			try {

				// Recover the "transfer data" content stored in a temporary file.
				byte[] transferDataContent;
				if (!StorageMock.TryGetFile(model.TransferDataFileId, out transferDataContent)) {
					return HttpNotFound();
				}

				// Get an instance of the PadesSigner class.
				var padesSigner = new PadesSigner();

				// Set the signature policy.
				padesSigner.SetPolicy(GetSignaturePolicy());

				// Set the signature computed on the client-side, along with the "transfer data" (rendered in a hidden field, see the view)
				padesSigner.SetPreComputedSignature(model.Signature, transferDataContent);

				// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
				padesSigner.ComputeSignature();

				// Get the signed PDF as an array of bytes
				signatureContent = padesSigner.GetPadesSignature();

			} catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate is revoked.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				// Return userfile to continue the signature with the same file.
				return View(model);
			}

			// On the next step (SignatureInfo action), we'll render the following information:
			// - The filename to be available to download in next action.
			// - The signer's certificate information to be rendered.
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureInfoModel"] = new SignatureInfoModel() {

				// Store the signature file on the folder "App_Data/" and redirects to the SignatureInfo action with the filename.
				// With this filename, it can show a link to download the signature file.
				File = StorageMock.Store(signatureContent, ".pdf")
			};

			return RedirectToAction("SignatureInfo");
		}

		// GET: PadesSignature/SignatureInfo
		[HttpGet]
		public ActionResult SignatureInfo() {

			// Recovery data from Conplete action, if returns null, it'll be redirected to Index 
			// action again.
			var model = TempData["SignatureInfoModel"] as SignatureInfoModel;
			if (model == null) {
				return RedirectToAction("Index");
			}

			return View(model);
		}
	}
}