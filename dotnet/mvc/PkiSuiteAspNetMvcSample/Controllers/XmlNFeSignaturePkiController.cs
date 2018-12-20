using Lacuna.Pki;
using Lacuna.Pki.Xml;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Pki;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class XmlNFeSignaturePkiController : BaseController {

		/**
		 * This method defines the signature policy that will be used on the signature.
		 */
		private XmlPolicySpec getSignaturePolicy() {

			var policy = BrazilXmlPolicySpec.GetNFePadraoNacional();

#if DEBUG
			// During debug only, we clear the policy's default trust arbitrator (which, in the case of
			// the policy returned by BrazilXmlPolicySpec.GetNFePadraoNacional(), corresponds to the ICP-Brasil roots only),
			// and use our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator())
			policy.ClearTrustArbitrators();
			policy.AddTrustArbitrator(Util.GetTrustArbitrator());
#endif

			return policy;
		}

		// GET: XmlElementSignature
		[HttpGet]
		public ActionResult Index() {
			return View();
		}

		/**
		 * POST: XmlElementSignature
		 * 
		 * This action is called once the user's certificate encoding has been read, and contains the
		 * logic to prepare the hash that needs to be actually signed with the user's private key
		 * (the "to-sign-hash").
		 */
		[HttpPost]
		public ActionResult Index(SignatureStartModel model) {

			byte[] toSignHash, transferData;
			SignatureAlgorithm signatureAlg;

			try {
				// Instantiate a XmlElementSigner class
				var signer = new XmlElementSigner();

				// Set the data to sign, which in the case of this example is a fixed sample document
				signer.SetXml(StorageMock.GetSampleNFeContent());

				// static Id from node <infNFe> from SampleNFe.xml document
				signer.SetToSignElementId("NFe35141214314050000662550010001084271182362300");

				// Decode the user's certificate and set as the signer certificate
				signer.SetSigningCertificate(PKCertificate.Decode(model.CertContent));

				// Set the signature policy
				signer.SetPolicy(getSignaturePolicy());

				// Generate the "to-sign-hash". This method also yields the signature algorithm that must
				// be used on the client-side, based on the signature policy.
				toSignHash = signer.GenerateToSignHash(out signatureAlg, out transferData);

			} catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate
				// encoding cannot be read or if the certificate is expired. 
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View();
			}

			// On the next step (Complete action), we'll need once again some information:
			// - The thumpprint of the selected certificate.
			// - The "transfer data" used to validate the signature in complete action.Its content is stored in
			//   a temporary file (with extension .bin) to be shared with the Complete action.
			// - The "to-sign-hash" to be signed. (see signature-complete-form.js)
			// - The OID of the digest algorithm to be used during the signature operation.
			// We'll store this value on TempData, that will store in dictionary shared between actions.
			TempData["SignatureCompleteModel"] = new SignatureCompleteModel() {
				CertThumb = model.CertThumb,
				TransferDataFileId = StorageMock.Store(transferData, ".bin"),
				ToSignHash = toSignHash,
				DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid
			};

			return RedirectToAction("Complete");
		}

		// GET: XmlElementSignature/Complete
		[HttpGet]
		public ActionResult Complete() {

			// Recovery data from Index action, if returns null, it'll be redirected to Index 
			// action again.
			var model = TempData["SignatureCompleteModel"] as SignatureCompleteModel;
			if (model == null) {
				return RedirectToAction("Index");
			}

			return View(model);
		}

		/**
		 * POST: XmlElementSignature/Complete
		 * 
		 * This action is called once the "to-sign-hash" are signed using the user's certificate. After signature,
		 * it'll be redirect to SignatureInfo action to show the signature file.
		 */
		[HttpPost]
		public ActionResult Complete(SignatureCompleteModel model) {

			byte[] signatureContent;

			try {

				// Recover the "transfer data" content stored in a temporary file.
				byte[] transferDataContent;
				if (!StorageMock.TryGetFile(model.TransferDataFileId, out transferDataContent)) {
					return HttpNotFound();
				}

				// Instantiate a XmlElementSigner class
				var signer = new XmlElementSigner();

				// Set the document to be signed and the policy, exactly like in the Start method
				signer.SetXml(StorageMock.GetSampleNFeContent());
				signer.SetPolicy(getSignaturePolicy());

				// Set the signature computed on the client-side, along with the "transfer data" (rendered in a hidden field, see the view)
				signer.SetPrecomputedSignature(model.Signature, transferDataContent);

				// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
				signer.ComputeSignature();

				// Get the signed XML as an array of bytes
				signatureContent = signer.GetSignedXml();

			} catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate is revoked.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View();
			}

			// On the next step (SignatureInfo action), we'll render the following information:]
			// - The filename to be available to download in next action.
			// - The signer's certificate information to be rendered.
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureInfoModel"] = new SignatureInfoModel() {

				// Store the signature file on the folder "App_Data/" and redirects to the SignatureInfo action with the filename.
				// With this filename, it can show a link to download the signature file.
				File = StorageMock.Store(signatureContent, ".xml")
			};

			return RedirectToAction("SignatureInfo");
		}

		// GET: XmlElementSignature/SignatureInfo
		[HttpGet]
		public ActionResult SignatureInfo() {

			// Recovery data from Conplete action, if returns null, it'll be redirected to Index 
			// action again.
			var model = TempData["SignatureInfoModel"] as SignatureInfoModel;
			if (model == null) {
				return RedirectToAction("Index");
			}

			return View(model);
		}
	}
}