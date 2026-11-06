using Lacuna.Pki;
using Lacuna.Pki.Cades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class CadesSignatureSdkController : BaseController {

		/**
			This method defines the signature policy that will be used on the signature.
		 */
		private ICadesPolicyMapper getSignaturePolicy() {

			var policy = CadesPoliciesForGeneration.GetPkiBrazilAdrBasica();

#if DEBUG
			// During debug only, we return a wrapper which will overwrite the policy's default trust arbitrator
			// (which in this case corresponds to the ICP-Brasil roots only), with our custom trust arbitrator
			// which accepts test certificates (see Util.GetTrustArbitrator()).
			return new CadesPolicyMapperWrapper(policy, Util.GetTrustArbitrator());
#else
			return policy;
#endif
		}

		// GET: CadesSignatureSdk
		[HttpGet]
		public ActionResult Index(string userfile, string cmsfile) {

			return View(new SignatureStartModel() {
				UserFile = userfile,
				CmsFile = cmsfile
			});
		}

		/**
		 * POST: CadesSignatureSdk
		 *
		 * This action is called once the user's certificate encoding has been read, and contains the
		 * logic to prepare the hash that needs to be actually signed with the user's private key
		 * (the "to-sign-hash").
		 */
		[HttpPost]
		public ActionResult Index(SignatureStartModel model) {

			byte[] toSignBytes;
			SignatureAlgorithm signatureAlg;

			try {

				// Instantiate a CadesSigner class
				var cadesSigner = new CadesSigner();

				if (!string.IsNullOrEmpty(model.CmsFile)) {

					// Verify if the cmsfile exists and get the content of the cmsfile.
					byte[] cmsfileContent;
					if (!StorageMock.TryGetFile(model.CmsFile, out cmsfileContent)) {
						return HttpNotFound();
					}

					// If the URL argument "cmsfile" is filled, the user has asked to co-sign a previously signed
					// CMS. We'll set the content of the CMS to be co-signed, which was previously saved in the
					// App_Data folder by the Complete action on this controller or by ServerFilesController.
					cadesSigner.SetSignatureToCoSign(cmsfileContent);

				} else {

					// Verify if the userfile exists and get the content of the userfile.
					byte[] userfileContent;
					if (!StorageMock.TryGetFile(model.UserFile, out userfileContent)) {
						return HttpNotFound();
					}

					// If the URL argument "userfile" is filled, it means the user was redirected here by
					// UploadController (signature with file uploaded by user) or by ServerFilesController. We'll
					// set the content of the file to be signed, which was saved in the App_Data folder by that
					// controller.
					cadesSigner.SetDataToSign(userfileContent);
				}

				// Decode the user's certificate and set as the signer certificate.
				var cert = PKCertificate.Decode(model.CertContent);
				cadesSigner.SetSigningCertificate(cert);

				// Set the signature policy
				cadesSigner.SetPolicy(getSignaturePolicy());

				// Generate the "to-sign-bytes". This method also yields the signature algorithm that must
				// be used on the client-side, based on the signature policy.
				toSignBytes = cadesSigner.GenerateToSignBytes(out signatureAlg);


			} catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate
				// encoding cannot be read or if the certificate is expired.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View();
			}

			// On the next step (Complete action), we'll need once again some information:
			// - The content of the selected certificate used to validate the signature in complete action.
			// - The thumbprint of the selected certificate.
			// - The "to-sign-bytes" used to validate the signature in complete action.
			// - The "to-sign-hash" (digest of the "to-sign-bytes") to be signed. (see signature-complete-form.js)
			// - The OID of the digest algorithm to be used during the signature operation.
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureCompleteModel"] = new SignatureCompleteModel() {
				UserFile = model.UserFile,
				CmsFile = model.CmsFile,
				CertContent = model.CertContent,
				CertThumb = model.CertThumb,
				ToSignBytes = toSignBytes,
				ToSignHash = signatureAlg.DigestAlgorithm.ComputeHash(toSignBytes),
				DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid
			};

			return RedirectToAction("Complete", new { userfile = model.UserFile, cmsfile = model.CmsFile });
		}

		// GET: CadesSignatureSdk/Complete
		[HttpGet]
		public ActionResult Complete(string userfile, string cmsfile) {

			// Recover data from the Index action. If it returns null, it'll be redirected to the Index
			// action again.
			var model = TempData["SignatureCompleteModel"] as SignatureCompleteModel;
			if (model == null) {
				return RedirectToAction("Index", new { userfile, cmsfile });
			}

			return View(model);
		}

		/**
		 * POST: CadesSignatureSdk/Complete
		 * 
		 * This action is called once the "to-sign-hash" is signed using the user's certificate. After the signature,
		 * it redirects to the SignatureInfo action to show the signature file.
		 */
		[HttpPost]
		public ActionResult Complete(SignatureCompleteModel model) {
			byte[] signatureContent;

			try {

				// Instantiate a CadesSigner class
				var cadesSigner = new CadesSigner();

				// Set the document to be signed, exactly like in the POST Index action.
				if (!string.IsNullOrEmpty(model.CmsFile)) {

					// Verify if the cmsfile exists and get the content of the cmsfile.
					byte[] cmsfileContent;
					if (!StorageMock.TryGetFile(model.CmsFile, out cmsfileContent)) {
						return HttpNotFound();
					}

					// If the URL argument "cmsfile" is filled, the user has asked to co-sign a previously signed
					// CMS. We'll set the content of the CMS to be co-signed, which was previously saved in the
					// App_Data folder by the Complete action on this controller or by ServerFilesController.
					cadesSigner.SetSignatureToCoSign(cmsfileContent);

				} else {

					// Verify if the userfile exists and get the content of the userfile.
					byte[] userfileContent;
					if (!StorageMock.TryGetFile(model.UserFile, out userfileContent)) {
						return HttpNotFound();
					}

					// If the URL argument "userfile" is filled, it means the user was redirected here by
					// UploadController (signature with file uploaded by user) or by ServerFilesController. We'll
					// set the content of the file to be signed, which was saved in the App_Data folder by that
					// controller.
					cadesSigner.SetDataToSign(userfileContent);
				}

				// Set the signature policy, exactly like in the POST Index action.
				cadesSigner.SetPolicy(getSignaturePolicy());

				// Decode the user's certificate and set as the signer certificate.
				var cert = PKCertificate.Decode(model.CertContent);
				cadesSigner.SetSigningCertificate(cert);

				// Set the signature computed on the client-side, along with the "to-sign-bytes" (rendered in a hidden input field, see the view)
				cadesSigner.SetPrecomputedSignature(model.Signature, model.ToSignBytes);

				// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
				cadesSigner.ComputeSignature();

				// Get the signature as an array of bytes
				signatureContent = cadesSigner.GetSignature();

			} catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate is revoked.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				// Return userfile to continue the signature with the same file.
				return View("Complete", model);
			}

			// On the next step (SignatureInfo action), we'll render the following information:
			// - The filename to be available to download in next action.
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureInfoModel"] = new SignatureInfoModel() {

				// Store the signature file on the folder "App_Data/" and redirect to the SignatureInfo action with the filename.
				// With this filename, it can show a link to download the signature file.
				File = StorageMock.Store(signatureContent, ".p7s")
			};

			return RedirectToAction("SignatureInfo");
		}

		// GET: CadesSignatureSdk/SignatureInfo
		[HttpGet]
		public ActionResult SignatureInfo() {

			// Recover data from the Complete action. If it returns null, it'll be redirected to the Index
			// action again.
			var model = TempData["SignatureInfoModel"] as SignatureInfoModel;
			if (model == null) {
				return RedirectToAction("Index");
			}

			return View(model);
		}
	}
}