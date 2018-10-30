using Lacuna.Pki;
using Lacuna.Pki.Pades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Pki;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class PadesSignaturePkiController : BaseController {

		/**
		 * This method defines the signature policy that will be used on the signature.
		 */
		private IPadesPolicyMapper getSignaturePolicy() {

#if DEBUG
			// During debug only, we return a wrapper which will overwrite the policy's default trust arbitrator
			// (which in this case corresponds to the ICP-Brasil roots only), with our custom trust arbitrator
			// which accepts test certificates (see Util.GetTrustArbitrator()).
			return PadesPoliciesForGeneration.GetPadesBasic(Util.GetTrustArbitrator());
#else
			return PadesPoliciesForGeneration.GetPadesBasic(TrustArbitrators.PkiBrazil);
#endif
		}

		// GET: PadesSignature
		public ActionResult Index(string userfile, string fileToCoSign) {
			return View(new SignatureStartModel() {
				Userfile = userfile,
				FileToCoSign = fileToCoSign
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

				// Decode the user's certificate.
				var cert = PKCertificate.Decode(model.CertContent);

				// Get an instance of the PadesSigner class.
				var padesSigner = new PadesSigner();

				// Set the file to be signed.
				if (!string.IsNullOrEmpty(model.Userfile)) {

					// Verify if the userfile exists and get its absolute path.
					string userfilePath;
					if (!StorageMock.TryGetFile(model.Userfile, out userfilePath)) {
						return HttpNotFound();
					}

					// If the URL argument "userfile" is filled, it means the user was redirected here by
					// UploadController (signature with file uploaded by user). We'll set the path of the file to
					// be signed, which was saved in the App_Data folder by UploadController.
					padesSigner.SetPdfToSign(userfilePath);

				} else if (!string.IsNullOrEmpty(model.FileToCoSign)) {

					// Verify if the fileToCoSign exists and get its absolute path.
					string fileToCoSignPath;
					if (!StorageMock.TryGetFile(model.FileToCoSign, out fileToCoSignPath)) {
						return HttpNotFound();
					}

					// If the URL argument "fileToCoSign" is filled, it means the user was redirected here by
					// UploadController (CoSign() action) or by the result page of a PAdES signature. We'll set the
					// path of the file to be co-signed, which was save in the App_Data folder by UploadController or
					// by the previous signature. Notice: It uses the same method that is used to perform the first
					// signature.
					padesSigner.SetPdfToSign(fileToCoSignPath);

				} else {

					// If both userfile and fileToCoSign are null, this is the "signature with server file" case. 
					// We'll set the path of the file to be signed.
					padesSigner.SetPdfToSign(StorageMock.GetSampleDocPath());

				}

				// Set the signer certificate.
				padesSigner.SetSigningCertificate(cert);

				// Set the signature policy.
				padesSigner.SetPolicy(getSignaturePolicy());

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
			// - The content of the selected certificate only used to render the user's certificate information 
			//  after the signature is completed. It is no longer needed for the signature process.
			// - The thumbprint of the selected certificate.
			// - The "transfer data" used to validate the signature in complete action.
			// - The "to-sign-hash" (digest of the "to-sign-bytes") to be signed. (see signature-complete-form.js)
			// - The OID of the digest algorithm to be used during the signature operation.
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureCompleteModel"] = new SignatureCompleteModel() {
				CertContent = model.CertContent,
				CertThumb = model.CertThumb,
				TransferData = transferData,
				ToSignHash = signatureAlg.DigestAlgorithm.ComputeHash(toSignBytes),
				DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid
			};

			return RedirectToAction("Complete");
		}

		// GET: CadesSignature/Complete
		[HttpGet]
		public ActionResult Complete() {

			// Recovery data from Index action, if returns null, it'll be redirected to Index 
			// action again.
			var model = TempData["SignatureCompleteModel"] as SignatureCompleteModel;
			if (model == null) {
				return RedirectToAction("Index");
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

				// Get an instance of the PadesSigner class.
				var padesSigner = new PadesSigner();

				// Set the signature policy, exactly like in the Start method.
				padesSigner.SetPolicy(getSignaturePolicy());

				// Set the signature computed on the client-side, along with the "transfer data" (rendered in a hidden field, see the view)
				padesSigner.SetPreComputedSignature(model.Signature, model.TransferData);

				// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
				padesSigner.ComputeSignature();

				// Get the signed PDF as an array of bytes
				signatureContent = padesSigner.GetPadesSignature();

			}
			catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate is revoked.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View();
			}

			// On the next step (SignatureInfo action), we'll render the following information:
			// - The filename to be available to download in next action.
			// - The signer's certificate information to be rendered.
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureInfoModel"] = new SignatureInfoModel() {

				// Store the signature file on the folder "App_Data/" and redirects to the SignatureInfo action with the filename.
				// With this filename, it can show a link to download the signature file.
				Filename = StorageMock.Store(signatureContent, ".pdf"),
				UserCert = PKCertificate.Decode(model.CertContent)
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