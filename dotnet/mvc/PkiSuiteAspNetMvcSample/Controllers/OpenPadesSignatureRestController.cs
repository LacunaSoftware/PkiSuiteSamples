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
	public class OpenPadesSignatureRestController : BaseController {

		/**
		 *	This action submits a PDF file to Rest PKI for inspection of its signatures.
		 */
		[HttpGet]
		public async Task<ActionResult> Index(string userfile) {

			// Our action only works if a userfile is given to work with.
			if (!StorageMock.TryGetFile(userfile, out string userfilePath))
			{
				return HttpNotFound();
			}

			// Get an instance of the PadesSignatureExplorer class, used to open/validate PDF signatures.
			var sigExplorer = new PadesSignatureExplorer(Util.GetRestPkiClient()) {
				// Specify that we want to validate the signatures in the file, not only inspect them.
				Validate = true,
				// Specify the parameters for the signature validation:
				// Accept any PAdES signature as long as the signer has an ICP-Brasil certificate.
				DefaultSignaturePolicyId = StandardPadesSignaturePolicies.Basic,
				// Specify the security context to be used to determine trust in the certificate chain. We
				// have encapsulated the security context choice on Util.cs.
				SecurityContextId = Util.GetSecurityContextId()
			};

			// Set the PAdES signature file.
			sigExplorer.SetSignatureFile(userfilePath);

			// Call the Open() method, which returns the signature file's information.
			var signature = await sigExplorer.OpenAsync();

			// Render the information (see file OpenPadesSignature/Index.html for more information on
			// the information returned).
			return View(new OpenPadesSignatureModel() {
				Signature = signature
			});
		}
	}
}