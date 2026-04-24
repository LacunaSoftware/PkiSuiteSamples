using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Mvc;
using Lacuna.Cloudhub.Api;
using Lacuna.Cloudhub.Client;
using Lacuna.Pki;
using Lacuna.Pki.Pades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;

namespace PkiSuiteAspNetMvcSample.Controllers {

	/**
	 * This sample performs a CloudHub flow to communicate with PSCs (Prestadores de Serviço de
	 * Confiança) to perform a PAdES signature using a cloud certificate.
	 *
	 * To run this sample, configure the CloudHub settings in Web.config.
	 *
	 * Supported providers:
	 *    - BirdId
	 *    - ViDaaS
	 *    - NeoId
	 *    - RemoteId
	 *    - SafeId
	 * It's also possible to configure a custom provider if necessary.
	 *
	 * Available configuration keys:
	 *    - clientId
	 *    - clientSecret
	 *    - endpoint
	 *    - provider
	 *    - badgeUrl
	 *    - protocolVariant (error handling, normally depends on the provider)
	 *
	 * Only the PSCs that are configured will be displayed to the user.
	 */
	public class PadesCloudHubSdkController : Controller {

		// Redirect URL that the PSC will send the user back to after authentication.
		private const string RedirectUrl = "http://localhost:54123/PadesCloudHubSdk/Complete";
		CloudhubClient cloudhubClient = Util.GetCloudhubClient();

		private IPadesPolicyMapper GetSignaturePolicy() {

			// Get our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator()).
			var arbitrator = Util.GetTrustArbitrator();

			return PadesPoliciesForGeneration.GetPadesBasic(arbitrator);
		}

		/**
		 * GET /PadesCloudHubSdk
		 * 
		 * Renders the initial page where the user enters their CPF. The CPF is used to discover
		 * which PSCs have a certificate associated with it.
		 */
		[HttpGet]
		public ActionResult Index() {
			return View();
		}

		/**
		 * POST /PadesCloudHubSdk/Discover
		 * 
		 * Called when the user submits their CPF on the Index page. Creates a CloudHub session
		 * using the provided CPF to discover which PSCs hold a matching certificate. Returns a
		 * view listing the available trust services so the user can choose one and be redirected
		 * to the PSC's authentication page.
		 */
		[HttpPost]
		public async Task<ActionResult> Discover(string cpf, string userfile) {
			var plainCpf = Regex.Replace(cpf, @"[.-]+", "");

			var sessionRequest = new SessionCreateRequest {
				Identifier = plainCpf,
				// Append fileId to the redirect URL so it survives the PSC round-trip.
				RedirectUri = RedirectUrl + "?fileId=" + userfile,
				Type = Lacuna.Cloudhub.Api.TrustServiceSessionTypes.SingleSignature,
			};

			SessionModel session = await cloudhubClient.CreateSessionAsync(sessionRequest);

			return View(new AuthenticationCloudHubSdkModel() {
				Services = session.Services,
				Cpf = plainCpf,
			});
		}

		/**
		 * GET /PadesCloudHubSdk/Complete
		 * 
		 * Called when the user is redirected back from the PSC after completing authentication.
		 * Receives the session token and file ID, retrieves the user's certificate from CloudHub,
		 * and performs the PAdES signature on the specified PDF.
		 */
		public async Task<ActionResult> Complete(string session, string fileId) {
			byte[] signatureContent;
			PKCertificate pkCertificate;
			try {
				// Retrieve the user's certificate from CloudHub using the session token
				// returned by the PSC after authentication.
				var cert = await cloudhubClient.GetCertificateAsync(session);

				// Verify that the file to be signed exists and get its absolute path.
				string userfilePath;
				if (!StorageMock.TryGetFile(fileId, out userfilePath)) {
					return HttpNotFound();
				}

				// Create a PadesSigner instance to perform the signature.
				var signer = new PadesSigner();
				// Set the signature policy.
				signer.SetPolicy(GetSignaturePolicy());
				// Set the PDF file to be signed.
				signer.SetPdfToSign(userfilePath);
				// Decode the certificate returned by CloudHub and set it as the signing certificate.
				pkCertificate = PKCertificate.Decode(cert);
				signer.SetSigningCertificate(pkCertificate);
				// Set a visual representation for the signature.
				signer.SetVisualRepresentation(PadesVisualElements.GetVisualRepresentationForPkiSdk(pkCertificate));

				// Compute the to-sign bytes and get the signature algorithm and transfer data.
				var toSignBytes = signer.GetToSignBytes(out SignatureAlgorithm signatureAlg, out byte[] transferData);

				// Hash the bytes using the digest algorithm, then send to CloudHub for signing.
				var toSignHash = signatureAlg.DigestAlgorithm.ComputeHash(toSignBytes);
				var signature = await cloudhubClient.SignHashAsync(new SignHashRequest() {
					DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid,
					Hash = toSignHash,
					Session = session
				});

				signer.SetPreComputedSignature(signature, transferData);
				signatureContent = signer.GetPadesSignature();
			}
			catch (ValidationException ex) {
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View();
			}

			// Store the signed PDF and display the signature info page.
			return View("SignatureInfo", new SignatureInfoModel() {
				File = StorageMock.Store(signatureContent, ".pdf"),
				SignerCertificate = pkCertificate
			});
		}
	}
}