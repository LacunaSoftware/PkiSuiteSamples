using Lacuna.Pki.Xml;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Pki;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class OpenXmlSignaturePkiController : BaseController {

		/**
		 * This action open a XML file and inspect its signatures.
		 */
		public ActionResult Index(string userfile) {

			// Our action only works if a userfile is given to work with.
			byte[] userfileContent;
			if (!StorageMock.TryGetFile(userfile, out userfileContent)) {
				return HttpNotFound();
			}

			// Instanciate the XmlSignatureLocator class, responsible for opening and validating the signatures
			// in the XML file. The signed XML content is passed as a parameter of the XmlSignatureLocator.
			var xmlSignatureLocator = new XmlSignatureLocator(userfileContent);

			// Get the list of signatures found in the XML file.
			var signatures = xmlSignatureLocator.GetSignatures();

			// Specify the parameters for the signature validation:
			// Define the trust arbitrator used to validate the certificate.
			var trustArbitrator = Util.GetTrustArbitrator();
			// Acces any valid XmlDSig signature as long as the signer certificate is trusted.
			var policyMapper = XmlPoliciesForValidation.GetXmlDSigBasic(trustArbitrator);

			// Generate a model to be shown on the page from each XmlSignature instance retrieved from
			// GetSignatures() method above. This class can be inspected on Models/PKi/OpenXmlSignatureModel.cs
			// file. In this class, we validate each signature based on the policy mapper defined above.
			var sigModels = signatures.Select(s => new XmlSignatureModel(s, policyMapper)).ToList();

			// Render the signatures' information (see file OpenXmlSignaturePki/Index.cshtml for more
			// information on the information returned).
			return View(new OpenXmlSignatureModel() {
				Signatures = sigModels
			});
		}
	}
}