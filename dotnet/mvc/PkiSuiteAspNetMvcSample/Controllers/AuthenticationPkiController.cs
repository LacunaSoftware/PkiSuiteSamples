using Lacuna.Pki;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Pki;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace PkiSuiteAspNetMvcSample.Controllers {

	public class AuthenticationPkiController : BaseController {

		/**
		 * GET: AuthenticationPki
		 * 
		 * This action sets a NonceStore needed for authentication. And if it is rendered by some error that
		 * occured, it will show the error message to the user and generate another instance of a NonceStore,
		 * letting the user to sign again.
		 */
		[HttpGet]
		public ActionResult Index() {

			// The PKCertificateAuthentication class requires an implementation of INonceStore. We'll use the
			// FileSystemNonceStore class.
			var nonceStore = Util.GetNonceStore();

			// Instantiate the PKCertificateAuthentication class passing our EntityFrameworkNonceStore.
			var certAuth = new PKCertificateAuthentication(nonceStore);

			// Call the Start() method, which is the first of the two server-side steps. This yields the nonce,
			// a 16-byte-array which we'll send to the view.
			var nonce = certAuth.Start();

			// Notice that this previous will be executed even if an error has occured and it was redirected to
			// this action.
			var model = new AuthenticationModel() {
				Nonce = nonce,
				DigestAlgorithm = PKCertificateAuthentication.DigestAlgorithm.Oid
			};

			// If this action is called because occurred an error. This error's message will be shown.
			var vr = TempData["ValidationResults"] as ValidationResults;
			if (vr != null && !vr.IsValid) {
				ModelState.AddModelError("", vr.ToString());
			}
			return View(model);
		}

		/**
		 * POST: AuthenticationPki
		 * 
		 * This action is called once the user clicks the "Sign In" button. It uses the
		 * PKCertificateAuthentication class to generate and store a cryptographic nonce, which will then be
		 * sent to the view for signature using the user's certificate.
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
				// The authentication failed, redirect and inform in index view.
				TempData["ValidationResults"] = vr;
				return RedirectToAction("Index");
			}

			// At this point, you have assurance that the certificate is valid according to the
			// TrustArbitrator you selected when starting the authentication and that the user is indeed the
			// certificate's subject. Now, you'd typically query your database for a user that matches one of
			// the certificate's fields, such as userCert.EmailAddress or userCert.PkiBrazil.CPF (the actual
			// field to be used as key depends on your application's business logic) and set the user ID on
			// the auth cookie. For demonstration purposes, we'll set the email address directly on the
			// cookie as if it were the user ID.
			return View("Success", new AuthenticationInfoModel() {
				UserCert = PKCertificate.Decode(model.Certificate)
			});
		}
	}
}