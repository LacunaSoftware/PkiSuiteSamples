using Lacuna.Pki;
using Lacuna.Pki.Pades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class CheckPadesSdkController : BaseController {
		// GET: CheckPadesSdk?c={id}
		public ActionResult Index(string c) {

			// On PrinterFriendlyVersionController, we stored the unformatted version of the verification
			// code (without hyphens) but used the formatted version (with hiphens) on the printer-friendly
			// PDF. Now, we remove the hyphens before looking it up.
			var verificationCode = AlphaCode.Parse(c);

			// Get document associated with verification code.
			var fileId = StorageMock.LookupVerificationCode(verificationCode);
			if (fileId == null) {
				// Invalid code give!
				// Small delay to slow down brute-force attacks (if you want to be extra careful you might
				// want to add a CAPTCHA to the process).
				Thread.Sleep(TimeSpan.FromSeconds(2));
				// Return Not Found
				return HttpNotFound();
			}

			// Read document from storage.
			var fileContent = StorageMock.Read(fileId);

			var signature = PadesSignature.Open(fileContent);

			// Specify the parameters for the signature validation:
			// Define the trust arbitrator used to validate the certificate.
			var trustArbitrator = Util.GetTrustArbitrator();
			var policyMapper = PadesPoliciesForValidation.GetPadesBasic(trustArbitrator);

			// Render the information (see file Check/Index.html for more information on
			// the information returned).
			return View(new OpenPadesSignatureModel() {
				Signature = new PadesSignatureModel(signature, policyMapper),
				File = fileId
			});
		}
	}
}