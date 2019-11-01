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
	public class OpenCadesSignatureRestController : BaseController {

		/**
		 * This action submits a CAdES signature file to REST PKI for inspection.
		 */
		[HttpGet]
		public async Task<ActionResult> Index(string userfile) {

			// Our action only works if a userfile is given to work with.
			string userfilePath;
			if (!StorageMock.TryGetFile(userfile, out userfilePath)) {
				return HttpNotFound();
			}

			// Get an instance of the CadesSignatureExplorer class, used to open/validate CAdES
			// signatures.
			var sigExplorer = new CadesSignatureExplorer(Util.GetRestPkiClient()) {
				// Specify that we want to validate the signatures in the file, not only inspect them.
				Validate = true,
				// Specify the parameters for the signature validation:
				// Full compliance with ICP-Brasil as long as the signer has an ICP-Brasil certificate.
				AcceptableExplicitPolicies = SignaturePolicyCatalog.GetPkiBrazilCades(),
				// Specify the security context to be used to determine trust in the certificate chain. We
				// have encapsulated the security context choice on Util.cs.
				SecurityContextId = Util.GetSecurityContextId(),
			};

			// Set the CAdES signature file.
			sigExplorer.SetSignatureFile(userfilePath);

			// Call the OpenAndExtractContent() method, which returns the signature file's information and the encapsulated content.
			var data = await sigExplorer.OpenAndExtractContentAsync();
			var signature = data.Signature;
			var encapsulatedContent = data.Signature.HasEncapsulatedContent ? data.EncapsulatedContent : null;
			
			// Render the information (see file OpenCadesSignature/Index.html for more information on
			// the information returned).
			return View(new OpenCadesSignatureModel() {
				Signature = signature,
				// WARNING: this sample always consider the encapsulated content type as pdf, so the downloadable file uses pdf extension
				File = encapsulatedContent != null ? StorageMock.Store(encapsulatedContent.GetContent(), ".pdf") : ""
			});
		}
	}
}