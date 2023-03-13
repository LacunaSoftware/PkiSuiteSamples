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
	 * This sample is responsible to perform a OAuth flow to communicate with PSCs to perform a
	 * signature. To perform this sample it's necessary to configure this project on Web.config file.
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
	public class PadesCloudOauthSdkController : Controller {

		// Redirect URL where it's accessed after OAuth flow is finished.
		private const string RedirectUrl = "http://localhost:54123/PadesCloudOauthSdk/Complete";

		private IPadesPolicyMapper GetSignaturePolicy() {

			// Get our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator()).
			var arbitrator = Util.GetTrustArbitrator();

			return PadesPoliciesForGeneration.GetPadesBasic(arbitrator);
		}

		/**
		 * GET /PadesCloudPwdSdk
		 * 
		 * This action will render a page that request a CPF to the user. This CPF is used to discover
		 * which PSCs have a certificate containing that CPF.
		 */
		[HttpGet]
		public ActionResult Index() {
			return View();
		}

		/**
		 * POST /PadesCloudPwdSdk/Discover
		 * 
		 * This action will be called after the user press the button "Search" on index page. It will
		 * search for all PSCs that have a certificate with the provided CPF. Thus, it will start the
		 * authentication process and return a URL to redirect the user to perform the authentication.
		 *
		 * After this action the user will be redirected, and to store the local data (fileId) to be user
		 * after the user returns to your application. We use the parameter "customState", the last
		 * parameter of the method discoverByCpfAndStartAuth(). This parameter will be recovered in the
		 * next action.
		 */
		[HttpPost]
		public async Task<ActionResult> Discover(string userfile, string cpf) {

			// Process CPF, removing all formatting.
			var plainCpf = Regex.Replace(cpf, "/[.-]/", "");

			// Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
			// and handling the OAuth flow.
			var manager = Util.GetTrustServicesManager();

			// Discover available PSCs.The following method has three sessionTypes:
			// - SingleSignature: The returned token can only be used for one single signature request.
			// - MultiSignature: The returned token can only be used for one multi signature request.
			// - SignatureSession: The return token can only be used for one or more signature requests.
			var services = await manager.DiscoverByCpfAndStartAuthAsync(plainCpf, RedirectUrl, TrustServiceSessionTypes.SignatureSession, userfile);

			// Render complete page.
			return View(new PadesCloudOauthModel() {
				Services = services,
				Cpf = cpf,
			});
		}

		/**
		 * GET /PadesCloudOauthSdk/Complete
		 * 
		 * This action will complete the authentication process and create a signature using a sessionRequest
		 * token returned by user. Also, we recover the parameter "customState" containing the id of the
		 * file that will be signed.
		 */
		public async Task<ActionResult> Complete(string code, string state) {
			byte[] signatureContent;
			PKCertificateWithKey signingCertificate;

			try {

				// Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
				// and handling the OAuth flow.
				var manager = Util.GetTrustServicesManager();

				// Complete the authentication process, recovering the sessionRequest info to be used on the
				// signature and the custom state (fileId).
				var completeAuthResult = await manager.CompleteAuthAsync(code, state);

				// Recover file to be sigend on custom state parameter.
				var userfile = completeAuthResult.CustomState;

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
				var certificatesWithKey = await completeAuthResult.GetCertificatesWithKeyAsync();
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
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View();
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