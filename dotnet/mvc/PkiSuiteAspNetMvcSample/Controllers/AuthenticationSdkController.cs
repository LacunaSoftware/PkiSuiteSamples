using Lacuna.Pki;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace PkiSuiteAspNetMvcSample.Controllers {

	public class AuthenticationSdkController : BaseController {

		/**
		 * GET: AuthenticationSdk
		 *
		 * This action uses the PKCertificateAuthentication class to generate and store a cryptographic nonce,
		 * which will then be sent to the view for signature using the user's certificate. If a failed
		 * authentication redirected the user here, it also shows the error message, and the new nonce lets
		 * the user try again.
		 */
		[HttpGet]
		public ActionResult Index() {

			// The PKCertificateAuthentication class requires an implementation of INonceStore. We'll use the
			// FileSystemNonceStore class.
			var nonceStore = Util.GetNonceStore();

			// Instantiate the PKCertificateAuthentication class passing our nonce store.
			var certAuth = new PKCertificateAuthentication(nonceStore);

			// Call the Start() method, which is the first of the two server-side steps. This yields the nonce,
			// a 16-byte-array which we'll send to the view.
			var nonce = certAuth.Start();

			// Notice that the code above also runs when a failed authentication redirected the user back to
			// this action.
			var model = new AuthenticationModel() {
				Nonce = nonce,
				DigestAlgorithm = PKCertificateAuthentication.DigestAlgorithm.Oid
			};

			// If this action is called because the authentication failed, show the validation results.
			var vr = TempData["ValidationResults"] as ValidationResults;
			if (vr != null && !vr.IsValid) {
				ModelState.AddModelError("", vr.ToString());
			}
			return View(model);
		}

		/**
		 * POST: AuthenticationSdk
		 *
		 * This action is called once the user clicks the "Sign In" button and the nonce is signed with the
		 * user's certificate. It uses the PKCertificateAuthentication class to validate the signature and
		 * the certificate.
		 */
		[HttpPost]
		public ActionResult Index(AuthenticationModel model) {

			// As before, we instantiate a FileSystemNonceStore class and use that to instantiate a
			// PKCertificateAuthentication.
			var nonceStore = Util.GetNonceStore();
			var certAuth = new PKCertificateAuthentication(nonceStore);

			// Call the Complete() method, which is the last of the two server-side steps. It receives:
			// - The nonce which was signed using the user's certificate.
			// - The user's certificate encoding.
			// - The nonce signature.
			// - A TrustArbitrator to be used to determine trust in the certificate.
			// The call yields:
			// - A ValidationResults which denotes whether the authentication was successful or not.
			// - The user's decoded certificate.
			PKCertificate certificate;
			var vr = certAuth.Complete(model.Nonce, model.Certificate, model.Signature, Util.GetTrustArbitrator(), out certificate);

			// Check the authentication result
			if (!vr.IsValid) {
				// The authentication failed. Redirect to the Index action, which shows the validation results.
				TempData["ValidationResults"] = vr;
				return RedirectToAction("Index");
			}

			// At this point, you have assurance that the certificate is valid according to the
			// TrustArbitrator you selected when starting the authentication and that the user is indeed the
			// certificate's subject. Now, you'd typically query your database for a user that matches one of
			// the certificate's fields, such as userCert.EmailAddress or userCert.PkiBrazil.CPF (the actual
			// field to be used as key depends on your application's business logic) and set the user ID on
			// the auth cookie. For demonstration purposes, we'll just render the certificate's information.
			return View("Success", new AuthenticationInfoModel() {
				UserCert = certificate
			});
		}
	}
}