using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Rest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class OpenXmlSignatureRestController : BaseController {

		/**
		 *	This action submits a XML file to Rest PKI for inspection of signatures.
		 */
		[HttpGet]
		public async Task<ActionResult> Index(string userfile) {

			// Our action only works if a userfile is given to work with.
			string userfilePath;
			if (!StorageMock.TryGetFile(userfile, out userfilePath)) {
				return HttpNotFound();
			}

			// Get an instance of the XmlSignatureExplorer class, used to open/validate XML signatures.
			var sigExplorer = new XmlSignatureExplorer(Util.GetRestPkiClient()) {
				// Specify that we want to validate the signatures in the file, not only inspect them.
				Validate = true,
				// Specify the parameters for the signature validation:
				// Accept any valid XmlDSig signature as long as the signer has an ICP-Brasil certificate.
				DefaultSignaturePolicyId = StandardXmlSignaturePolicies.XmlDSigBasic,
				// Specify the security context to be used to determine trust in the certificate chain. We
				// have encapsulated the security context choice on Util.cs.
				SecurityContextId = Util.GetSecurityContextId()
			};

			// Set the XML file.
			sigExplorer.SetSignatureFile(userfilePath);

			// Call the Open() method, which returns a list of signatures found in the XML file.
			var signatures = await sigExplorer.OpenAsync();

			// Render the signatures' information (see file OpenXmlSignature/Index.html for more
			// information on the information returned).
			return View(new OpenXmlSignatureModel() {
				Signatures = signatures
			});
		}
	}
}