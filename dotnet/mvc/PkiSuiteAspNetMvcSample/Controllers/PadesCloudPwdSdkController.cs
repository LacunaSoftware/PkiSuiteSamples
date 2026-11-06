using Lacuna.Pki;
using Lacuna.Pki.BrazilTrustServices;
using Lacuna.Pki.Pades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {

	/**
	 * This sample performs a password authorization flow to communicate with PSCs to perform a
	 * signature. To run this sample, it's necessary to configure this project in the Web.config file.
	 *
	 * All standard providers:
	 *    - BirdId
	 *    - ViDaaS
	 *    - NeoId
	 *    - RemoteId
	 *    - SafeId
	 * It's possible to create a custom provider if necessary.
	 *
	 * All configuration available:
	 *    - clientId
	 *    - clientSecret
	 *    - endpoint
	 *    - provider
	 *    - badgeUrl
	 *    - protocolVariant (error handling, normally it depends on the used provider)
	 *
	 * This sample will only show the PSCs that are configured.
	 */
	public class PadesCloudPwdSdkController : Controller {
		private IPadesPolicyMapper GetSignaturePolicy() {

			// Get our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator()).
			var arbitrator = Util.GetTrustArbitrator();

			return PadesPoliciesForGeneration.GetPadesBasic(arbitrator);
		}

		/**
		 * GET /PadesCloudPwdSdk
		 * 
		 * This action will render a page that requests the user's CPF. This CPF is used to discover
		 * which PSCs have a certificate containing that CPF.
		 */
		[HttpGet]
		public ActionResult Index() {
			// If an earlier attempt failed validation, show why (see the catch below).
			var vr = TempData["ValidationResults"] as ValidationResults;
			if (vr != null && !vr.IsValid) {
				ModelState.AddModelError("", vr.ToString());
			}
			return View();
		}

		/**
		 * POST /PadesCloudPwdSdk/Discover
		 * 
		 * This action will be called after the user clicks the "Search" button on the Index page. It will
		 * search for all PSCs that have a certificate with the provided CPF and render a page where the
		 * user chooses one of them and enters their password.
		 */
		[HttpPost]
		public async Task<ActionResult> Discover(string userfile, string cpf) {

			// Process CPF, removing all formatting.
			var plainCpf = Regex.Replace(cpf, @"[.-]+", "");

			// Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
			// and handling the password authorization.
			var manager = Util.GetTrustServicesManager();

			// Discover available PSCs.
			var services = await manager.DiscoverByCpfAsync(plainCpf);

			// Render the page that lists the available PSCs.
			return View(new PadesCloudPwdModel() {
				Services = services,
				Cpf = cpf,
			});
		}

		/**
		 * This action is called when the user clicks the "Sign" button on the Discover page. It receives
		 * the user's CPF, the chosen PSC and the user's current password.
		 */
		public async Task<ActionResult> Authorize(string userfile, string cpf, string service, string password) {
			byte[] signatureContent;
			PKCertificateWithKey signingCertificate;

			try {
				// Process CPF, removing all formatting.
				var plainCpf = Regex.Replace(cpf, @"[.-]+", "");

				// Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
				// and handling the password authorization.
				var manager = Util.GetTrustServicesManager();

				// Complete authentication using CPF and current password. The following method accepts three
				// session types:
				// - SingleSignature: The returned token can only be used for one single signature request.
				// - MultiSignature: The returned token can only be used for one multi signature request.
				// - SignatureSession: The returned token can be used for one or more signature requests.
				var passwordAuthorizeResult = await manager.PasswordAuthorizeAsync(service, plainCpf, password, TrustServiceSessionTypes.SignatureSession);

				// Verify if the userfile exists and get its absolute path.
				string userfilePath;
				if (!StorageMock.TryGetFile(userfile, out userfilePath)) {
					return HttpNotFound();
				}

				// Get an instance of the PadesSigner class, responsible for receiving the signature elements
				// and performing the local signature.
				var signer = new PadesSigner();

				// Set signature policy.
				signer.SetPolicy(GetSignaturePolicy());

				// Set file to be signed.
				signer.SetPdfToSign(userfilePath);

				// Recover the interface for the cloud certificate to be passed to PadesSigner class.
				var certificatesWithKey = await passwordAuthorizeResult.GetCertificatesWithKeyAsync();
				signingCertificate = certificatesWithKey.First();
				signer.SetSigningCertificate(signingCertificate);

				// Set a visual representation for the signature.
				signer.SetVisualRepresentation(PadesVisualElements.GetVisualRepresentationForPkiSdk(signingCertificate.Certificate));

				// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
				signer.ComputeSignature();

				// Get the signed PDF as an array of bytes
				signatureContent = signer.GetPadesSignature();
			} catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate
				// encoding cannot be read or if the certificate is expired.
				TempData["ValidationResults"] = ex.ValidationResults;
				return RedirectToAction("Index", new { userfile = userfile });
			}

			return View("SignatureInfo", new SignatureInfoModel() {
				// Store the signature file on the folder "App_Data/".
				// With this filename, it can show a link to download the signature file.
				File = StorageMock.Store(signatureContent, ".pdf"),
				SignerCertificate = signingCertificate.Certificate
			});
		}
	}
}