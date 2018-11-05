using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.RestPki;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class OpenPadesSignatureBStampRestPkiController : BaseController {

		/**
		 *	This action submits a PDF file to Rest PKI for inspection of its signatures, specifying that an
		 *	"audit package" should be generated.
		 */
		[HttpGet]
		public async Task<ActionResult> Index(string userfile) {

			// Get an instance of the PadesSignatureExplorer class, used to open/validate PDF signatures.
			var sigExplorer = new PadesSignatureExplorer(Util.GetRestPkiClient()) {
				// Specify that we want an audit package to be generated, and that the signed file should be
				// included in the package.
				GenerateAuditPackage = true,
				IncludeSignedFileInAuditPackage = true,
				// In order to generate an audit package, we must also pass Validate = true.
				Validate = true,
				// Specify the parameters for the signature validation:
				// Accept any PAdES signature as long as the signer has an ICP-Brasil certificate.
				DefaultSignaturePolicyId = StandardPadesSignaturePolicies.Basic,
				// Specify the security context to be used to determine trust in the certificate chain. We
				// have encapsulated the security context choice on Util.cs.
				SecurityContextId = Util.GetSecurityContextId()
			};

			// Set the PDF file.
			if (!string.IsNullOrEmpty(userfile)) {

				// Verify if the provided userfile exits and get its absolute path.
				string userfilePath;
				if (!StorageMock.TryGetFile(userfile, out userfilePath)) {
					return HttpNotFound();
				}

				// Set the userfile's absolute path to the PadesSignatureExplorer instance.
				sigExplorer.SetSignatureFile(userfilePath);

			} else {

				// If no userfile is passed, we use a previously signed and B-Stamped file.
				sigExplorer.SetSignatureFile(StorageMock.GetSampleBStampedPath());
			}

			// Call the Open() method, which returns the signature file's information.
			var signature = await sigExplorer.OpenAsync();

			// If the document has been B-Stamped, store the "digest index file" to show a link on the page.
			string indexFileId = null;
			if (signature.BStamp != null) {
				using (var indexFileStream = signature.BStamp.IndexFile.OpenRead()) {
					indexFileId = StorageMock.Store(indexFileStream, ".txt");
				}
			}

			// Store the generated audit package. Notice that although we asked for its generation, the
			// signature might not have been B-Stamped yet, so an audit package might not be returned.
			string auditPkgId = null;
			if (signature.AuditPackage != null) {
				using (var auditPkgStream = signature.AuditPackage.OpenRead()) {
					auditPkgId = StorageMock.Store(auditPkgStream, ".zip");
				}
			}

			// Render the information (see file OpenPadesSignatureBStamp/Index.html for more
			// information on the information returned).
			return View(new OpenPadesSignatureBStampModel() {
				Signature = signature,
				BStampIndexFile = indexFileId,
				AuditPackageFile = auditPkgId
			});
		}
	}
}