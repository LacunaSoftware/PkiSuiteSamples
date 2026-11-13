using Lacuna.Pki;
using Lacuna.Pki.Cades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class OpenCadesSignatureSdkController : BaseController {
		/**
		 * This action opens a CAdES file and inspects its signatures.
		 */
		public ActionResult Index(string userfile) {
			// Our action only works if a userfile is given to work with.
			byte[] userfileContent;
			if (!StorageMock.TryGetFile(userfile, out userfileContent)) {
				return HttpNotFound();
			}
			// Open the CAdES file.
			var cadesSignature = CadesSignature.Open(userfileContent);

			// Specify the parameters for the signature validation:
			// Define the trust arbitrator used to validate the certificate.
			var trustArbitrator = Util.GetTrustArbitrator();
			var policyMapper = CadesPoliciesForValidation.GetCadesBasic(trustArbitrator);

			return View(new OpenCadesSignatureModel() {
				// WARNING: this sample always considers the encapsulated content type as PDF, so the downloadable file uses pdf extension
				File = cadesSignature.HasEncapsulatedContent ? StorageMock.Store(cadesSignature.GetEncapsulatedContent(), ".pdf") : "",
				Signature = new CadesSignatureModel(cadesSignature, policyMapper)
			});
		}
	}
}