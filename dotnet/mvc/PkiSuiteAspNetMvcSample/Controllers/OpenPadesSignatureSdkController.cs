using Lacuna.Pki.Pades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class OpenPadesSignatureSdkController : BaseController
    {
		/**
		 * This action open a Cades file and inspect its signatures.
		 */
		public ActionResult Index(string userfile)
		{
			// Our action only works if a userfile is given to work with.
			byte[] userfileContent;
			if (!StorageMock.TryGetFile(userfile, out userfileContent))
			{
				return HttpNotFound();
			}
			// Open Cades file
			var signature = PadesSignature.Open(userfileContent);

			// Specify the parameters for the signature validation:
			// Define the trust arbitrator used to validate the certificate.
			var trustArbitrator = Util.GetTrustArbitrator();
			var policyMapper = PadesPoliciesForValidation.GetPadesBasic(trustArbitrator);

			return View(new OpenPadesSignatureModel()
			{
				Signature = new PadesSignatureModel(signature, policyMapper)
			});
		}
	}
}