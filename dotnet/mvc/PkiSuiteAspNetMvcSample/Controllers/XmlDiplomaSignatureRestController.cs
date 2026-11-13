using Lacuna.RestPki.Api;
using Lacuna.RestPki.Api.XmlSignature;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Rest;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {

	/**
	 * This controller performs the three signatures required on a Brazilian digital diploma XML
	 * (Diploma Digital, from MEC), one after the other, using REST PKI:
	 *
	 *      1. The DadosDiploma element, usually signed with an e-CNPJ, AD-RT policy (Index actions);
	 *      2. The DadosRegistro element, usually signed with an e-CPF, AD-RT policy (DadosRegistro
	 *         actions);
	 *      3. The whole document, usually signed with an e-CNPJ, AD-RA policy (Diploma actions).
	 *
	 * Each step signs the file stored by the previous one, whose ID is passed on the URL argument
	 * "userfile".
	 */
	public class XmlDiplomaSignatureRestController : BaseController {

		// ID of the DadosDiploma element on the sample diploma.
		private const string DadosDiplomaElementId = "Dip35141214314050000662550010001084271182362300";

		// ID of the DadosRegistro element on the sample diploma.
		private const string DadosRegistroElementId = "Reg35141214314050000662550010001084271182362300";

		/**
		 * GET XmlDiplomaSignatureRest
		 *
		 * This action initiates the signature of the DadosDiploma element of the sample diploma using
		 * REST PKI and renders the signature page.
		 */
		[HttpGet]
		public async Task<ActionResult> Index() {

			// Instantiate the XmlElementSignatureStarter class, responsible for receiving the signature
			// elements and start the signature process.
			var signatureStarter = new XmlElementSignatureStarter(Util.GetRestPkiClient());

			// Set the XML to be signed, a pre-generated sample Brazilian digital diploma.
			signatureStarter.SetXml(StorageMock.GetSampleDiplomaPath());

			// Set the ID of the element to be signed (the DadosDiploma element).
			signatureStarter.SetToSignElementId(DadosDiplomaElementId);

			// Insert the signature as the last child of the signed element.
			signatureStarter.SetSignatureElementLocation(".", XmlInsertionOptions.AppendChild, new NamespaceManager());

			// Set the signature policy.
			signatureStarter.SetSignaturePolicy(StandardXmlSignaturePolicies.PkiBrazil.XadesAdrTempo);

			// Set the security context to be used to determine trust in the certificate chain. We have
			// encapsulated the security context choice on Util.cs.
			signatureStarter.SetSecurityContext(Util.GetSecurityContextId());

			// Call the StartWithWebPki() method, which initiates the signature. This yields the token,
			// a 43-character case-sensitive URL-safe string, which identifies this signature process. We'll
			// use this value to call the signWithRestPki() method on the Web PKI component (see
			// signature-form.js) and also to complete the signature on the POST action below (this should
			// not be mistaken for the API access token).
			var token = await signatureStarter.StartWithWebPkiAsync();

			// The token acquired above can only be used for a single signature attempt. In order to retry
			// the signature it is necessary to get a new token. This can be a problem if the user uses the
			// back button of the browser, since the browser might show a cached page that we rendered
			// previously, with a now stale token. To prevent this from happening, we call the method
			// SetNoCacheHeaders() (in BaseController) which sets HTTP headers to prevent caching of the
			// page.
			base.SetNoCacheHeaders();

			// Render the signature page with the token obtained from REST PKI.
			return View(new SignatureModel() {
				Token = token
			});
		}

		/**
		 * POST XmlDiplomaSignatureRest
		 *
		 * This action receives the form submission from the view. We'll call REST PKI to complete the
		 * signature of the DadosDiploma element.
		 */
		[HttpPost]
		public async Task<ActionResult> Index(SignatureModel model) {

			// Get the signed XML from REST PKI and store it.
			var fileId = await FinishSignatureAsync(model.Token);

			// Render the page with the link to the next step, the signature of the DadosRegistro element.
			return View("DadosDiplomaSignatureInfo", new SignatureInfoModel() {
				File = fileId
			});
		}

		/**
		 * GET XmlDiplomaSignatureRest/DadosRegistro?userfile={id}
		 *
		 * This action initiates the signature of the DadosRegistro element of the diploma stored by the
		 * previous step using REST PKI and renders the signature page.
		 */
		[HttpGet]
		public async Task<ActionResult> DadosRegistro(string userfile) {

			// Verify if the diploma signed on the previous step exists and get its absolute path. This
			// step can only be executed on that file.
			string userfilePath;
			if (!StorageMock.TryGetFile(userfile, out userfilePath)) {
				return HttpNotFound();
			}

			// Instantiate the XmlElementSignatureStarter class, responsible for receiving the signature
			// elements and start the signature process.
			var signatureStarter = new XmlElementSignatureStarter(Util.GetRestPkiClient());

			// Set the XML to be signed, the diploma with the DadosDiploma element already signed.
			signatureStarter.SetXml(userfilePath);

			// Set the ID of the element to be signed (the DadosRegistro element).
			signatureStarter.SetToSignElementId(DadosRegistroElementId);

			// Insert the signature as the last child of the signed element.
			signatureStarter.SetSignatureElementLocation(".", XmlInsertionOptions.AppendChild, new NamespaceManager());

			// Set the signature policy.
			signatureStarter.SetSignaturePolicy(StandardXmlSignaturePolicies.PkiBrazil.XadesAdrTempo);

			// Set the security context to be used to determine trust in the certificate chain. We have
			// encapsulated the security context choice on Util.cs.
			signatureStarter.SetSecurityContext(Util.GetSecurityContextId());

			// Call the StartWithWebPki() method, which initiates the signature (see the Index action above
			// for details on the token it returns).
			var token = await signatureStarter.StartWithWebPkiAsync();

			// Prevent the page, which holds a single-use token, from being cached (see the Index action
			// above).
			base.SetNoCacheHeaders();

			// Render the signature page with the token obtained from REST PKI.
			return View(new SignatureModel() {
				Token = token,
				UserFile = userfile
			});
		}

		/**
		 * POST XmlDiplomaSignatureRest/DadosRegistro?userfile={id}
		 *
		 * This action receives the form submission from the view. We'll call REST PKI to complete the
		 * signature of the DadosRegistro element.
		 */
		[HttpPost]
		public async Task<ActionResult> DadosRegistro(SignatureModel model) {

			// Get the signed XML from REST PKI and store it.
			var fileId = await FinishSignatureAsync(model.Token);

			// Render the page with the link to the last step, the signature of the whole diploma.
			return View("DadosRegistroSignatureInfo", new SignatureInfoModel() {
				File = fileId
			});
		}

		/**
		 * GET XmlDiplomaSignatureRest/Diploma?userfile={id}
		 *
		 * This action initiates the signature of the whole diploma stored by the previous step using
		 * REST PKI and renders the signature page.
		 */
		[HttpGet]
		public async Task<ActionResult> Diploma(string userfile) {

			// Verify if the diploma signed on the previous step exists and get its absolute path. This
			// step can only be executed on that file.
			string userfilePath;
			if (!StorageMock.TryGetFile(userfile, out userfilePath)) {
				return HttpNotFound();
			}

			// Instantiate the FullXmlSignatureStarter class, responsible for receiving the signature
			// elements and start the signature process. Unlike the previous steps, this one signs the
			// whole XML document.
			var signatureStarter = new FullXmlSignatureStarter(Util.GetRestPkiClient());

			// Set the XML to be signed, the diploma with the DadosDiploma and DadosRegistro elements
			// already signed.
			signatureStarter.SetXml(userfilePath);

			// Set the signature policy.
			signatureStarter.SetSignaturePolicy(StandardXmlSignaturePolicies.PkiBrazil.XadesAdrArquivamento);

			// Set the security context to be used to determine trust in the certificate chain. We have
			// encapsulated the security context choice on Util.cs.
			signatureStarter.SetSecurityContext(Util.GetSecurityContextId());

			// Call the StartWithWebPki() method, which initiates the signature (see the Index action above
			// for details on the token it returns).
			var token = await signatureStarter.StartWithWebPkiAsync();

			// Prevent the page, which holds a single-use token, from being cached (see the Index action
			// above).
			base.SetNoCacheHeaders();

			// Render the signature page with the token obtained from REST PKI.
			return View(new SignatureModel() {
				Token = token,
				UserFile = userfile
			});
		}

		/**
		 * POST XmlDiplomaSignatureRest/Diploma?userfile={id}
		 *
		 * This action receives the form submission from the view. We'll call REST PKI to complete the
		 * signature of the whole diploma.
		 */
		[HttpPost]
		public async Task<ActionResult> Diploma(SignatureModel model) {

			// Get the signed XML from REST PKI and store it.
			var fileId = await FinishSignatureAsync(model.Token);

			// Render the page with the link to download the fully signed diploma.
			return View("DiplomaSignatureInfo", new SignatureInfoModel() {
				File = fileId
			});
		}

		/**
		 * Completes a signature started by one of the GET actions above and stores the signed XML,
		 * returning its file ID.
		 */
		private async Task<string> FinishSignatureAsync(string token) {

			// Get an instance of the XmlSignatureFinisher class, responsible for completing the signature
			// process.
			var signatureFinisher = new XmlSignatureFinisher(Util.GetRestPkiClient()) {
				// Set the token for this signature (rendered in a hidden input field, see the view).
				Token = token
			};

			// Call the Finish() method, which finalizes the signature process and returns the signed XML.
			var signedXml = await signatureFinisher.FinishAsync();

			// At this point, you'd typically store the signed XML on your database. For demonstration
			// purposes, we'll store it on our mock Storage class.
			return StorageMock.Store(signedXml, ".xml");
		}
	}
}
