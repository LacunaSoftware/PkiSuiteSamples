using Lacuna.Pki;
using Lacuna.Pki.Xml;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {

	/**
	 * This controller performs two signatures on the same XML document, one on each element, according to the standard Certificación de Origen Digital (COD),
	 * from Asociación Latinoamericana de Integración (ALADI). For more information, please see:
	 * 
	 * - Spanish: http://www.aladi.org/nsfweb/Documentos/2327Rev2.pdf
	 * - Portuguese: http://www.mdic.gov.br/images/REPOSITORIO/secex/deint/coreo/2014_09_19_-_Brasaladi_761_-_Documento_ALADI_SEC__di_2327__Rev_2_al_port_.pdf
	 */
	public class XmlCodSignatureSdkController : BaseController {

		/**
		 * This method defines the signature policy that will be used on the signatures.
		 */
		private XmlPolicySpec getSignaturePolicy() {

			// The trust arbitrator determines which root certificates shall be trusted during certificate and signature validation. See Util.GetTrustArbitrator().
			var trustArbitrator = Util.GetTrustArbitrator();

			// The digest algorithm to be used on the signatures. The SHA-1 algorithm is no longer considered secure since February 2017 and is being
			// deprecated in favour of SHA-256. However, using SHA-256 may break implementations, for instance of the receiving parties. Check current
			// legislation or with the receiving parties if SHA-256 may be used.
			var digestAlg = DigestAlgorithm.SHA1; // or, preferably, DigestAlgorithm.SHA256

			// Get the "basic" XmlDSig signature policy with the trust arbitrator and digest algorithm chosen above
			var policy = XmlPolicySpec.GetXmlDSigBasic(trustArbitrator, digestAlg);

			// Optionally customize policy. The customizations below are a suggestion based on existing signed COD XML documents.
			policy.Generation.XmlTransformations.Clear();
			policy.Generation.XmlTransformations.Add(XmlTransformation.EnvelopedSignature);
			policy.Generation.OmitSignatureElementIds = true;
			policy.Generation.IncludeKeyValue = true;
			policy.Generation.X509DataCertificates = InclusionLevel.SigningCertificateOnly;
			policy.Generation.X509DataFields = X509DataFields.X509SubjectName;

			return policy;
		}

		/**
		 * GET CodXmlSignature
		 * 
		 * Renders the first signature page (for the COD element)
		 */
		public ActionResult Index() {
			return View();
		}

		/**
		 * POST CodXmlSignature
		 * 
		 * This action is called once the user's certificate encoding has been read, and contains the
		 * logic to prepare the COD element to be signed, yielding the byte array that needs to be 
		 * actually signed with the user's private key (the "to-sign-hash").
		 */
		[HttpPost]
		public ActionResult Index(SignatureStartModel model) {

			byte[] toSignHash, transferData;
			SignatureAlgorithm signatureAlg;

			try {
				// Instantiate a CadesSigner class
				var signer = new XmlElementSigner();

				// Set the data to sign, which in the case of this example is a fixed sample "COD envelope"
				signer.SetXml(StorageMock.GetSampleCodEnvelopeContent());

				// Set the ID of the COD element
				signer.SetToSignElementId("COD");

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

			// On the next step (SignCodComplete action), we'll need once again some information:
			// - The thumpprint of the selected certificate
			// - The "to-sign-hash"
			// - The OID of the digest algorithm to be used during the signature operation
			// - The "transfer data" used to validate the signature in complete action.Its content is stored in
			//   a temporary file (with extension .bin) to be shared with the Complete action.
			TempData["SignatureCompleteModel"] = new SignatureCompleteModel() {
				CertThumb = model.CertThumb,
				ToSignHash = toSignHash,
				DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid,
				TransferDataFileId = StorageMock.Store(transferData, ".bin"),
			};

			return RedirectToAction("Complete");
		}

		/**
		 * GET CodXmlSignature/Complete
		 * 
		 * Renders the page on which the signature of the COD element will actually be computed
		 * using the "to-sign-hash" generated on the SignCod action
		 */
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
		 * POST CodXmlSignature/SignCodComplete
		 * 
		 * This action is called once the "to-sign-hash" is signed using the user's certificate. After signature,
		 * we'll redirect the user to the SignCodResult action to show the signed file.
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

				// Get an instance of the XmlElementSigner class.
				var signer = new XmlElementSigner();

				// Set the document to be signed and the policy, exactly like in the SignCod method.
				signer.SetXml(StorageMock.GetSampleCodEnvelopeContent());
				signer.SetPolicy(getSignaturePolicy());

				// Set the signature computed on the client-side, along with the "transfer data"
				signer.SetPrecomputedSignature(model.Signature, transferDataContent);

				// Call ComputeSignature(), which validates the signature of the "to-sign-hash" and finishes the signature process
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
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureInfoModel"] = new SignatureInfoModel() {

				// Store the signature file on the folder "App_Data/" and redirect to the SignatureInfo action with the filename.
				File = StorageMock.Store(signatureContent, ".xml")
			};

			return RedirectToAction("SignatureInfo");
		}

		/**
		 * GET CodXmlSignature/SignatureInfo
		 */
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

		/**
		 * GET CodXmlSignature/SignCodeh
		 * 
		 * Renders the second signature page (for the CODEH element)
		 */
		[HttpGet]
		public ActionResult SignCodeh(string id) {

			// This sample only works with the file id with COD signature is provided.
			if (string.IsNullOrEmpty(id)) {
				return RedirectToAction("Index");
			}

			return View();
		}

		/**
		 * POST CodXmlSignature/SignCodeh
		 * 
		 * This action is called once the user's certificate encoding has been read, and contains the
		 * logic to prepare the CODEH element to be signed, yielding the byte array that needs to be 
		 * actually signed with the user's private key (the "to-sign-hash-bytes").
		 */
		[HttpPost]
		public ActionResult SignCodeh(string id, SignatureStartModel model) {

			// Recover XML envelope with signed COD element from "storage" based on its ID
			byte[] content;
			if (!StorageMock.TryGetFile(id, out content)) {
				return HttpNotFound();
			}

			byte[] toSignHash, transferData;
			SignatureAlgorithm signatureAlg;

			try {

				// Get an instance of the XmlElementSigner class.
				var signer = new XmlElementSigner();

				// Set the XML to sign
				signer.SetXml(content);

				// Set the ID of the CODEH element
				signer.SetToSignElementId("CODEH");

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

			// On the next step (SignCodehComplete action), we'll need once again some information:
			// - The thumpprint of the selected certificate
			// - The "to-sign-hash"
			// - The OID of the digest algorithm to be used during the signature operation
			// - The "transfer data" used to validate the signature in complete action.Its content is stored in
			//   a temporary file (with extension .bin) to be shared with the Complete action.
			TempData["SignatureCompleteModel"] = new SignatureCompleteModel() {
				CertThumb = model.CertThumb,
				ToSignHash = toSignHash,
				DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid,
				TransferDataFileId = StorageMock.Store(transferData, ".bin"),
			};

			return RedirectToAction("SignCodehComplete", new { id });
		}

		/**
		 * GET CodXmlSignature/SignCodeh/Complete
		 * 
		 * Renders the page on which the signature of the CODEH element will actually be computed
		 * using the "to-sign-hash" generated on the SignCodeh action
		 */
		[HttpGet]
		[Route("SignCodeh/Complete")]
		public ActionResult SignCodehComplete(string id) {

			// Recover data from SignCodeh action
			var model = TempData["SignatureCompleteModel"] as SignatureCompleteModel;
			if (model == null) {
				return RedirectToAction("Index");
			}

			return View(model);
		}

		/**
		 * POST CodXmlSignature/SignCodeh/Complete
		 * 
		 * This action is called once the "to-sign-hash" is signed using the user's certificate. After signature,
		 * we'll redirect the user to the SignCodehResult action to show the signed file.
		 */
		[HttpPost]
		[Route("SignCodeh/Complete")]
		public ActionResult SignCodehComplete(string id, SignatureCompleteModel model) {

			// Recover XML envelope with signed COD element from "storage" based on its ID
			byte[] content;
			if (!StorageMock.TryGetFile(id, out content)) {
				return HttpNotFound();
			}

			byte[] signatureContent;

			try {

				// Recover the "transfer data" content stored in a temporary file.
				byte[] transferDataContent;
				if (!StorageMock.TryGetFile(model.TransferDataFileId, out transferDataContent)) {
					return HttpNotFound();
				}

				// Get an instance of the XmlElementSigner class.
				var signer = new XmlElementSigner();

				// Set the document to be signed and the policy, exactly like in the SignCodeh method
				signer.SetXml(content);
				signer.SetPolicy(getSignaturePolicy());

				// Set the signature computed on the client-side, along with the "transfer data"
				signer.SetPrecomputedSignature(model.Signature, transferDataContent);

				// Call ComputeSignature(), which validates the signature of the "to-sign-hash" and finishes the signature process
				signer.ComputeSignature();

				// Get the signed XML as an array of bytes
				signatureContent = signer.GetSignedXml();

			} catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate is revoked.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View();
			}

			// On the next step (SignatureInfo action), we'll render the following information:
			// - The filename to be available to download in next action.
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureInfoModel"] = new SignatureInfoModel() {

				// Store the signature file on the folder "App_Data/" and redirect to the SignCodehResult action with the filename.
				File = StorageMock.Store(signatureContent, ".xml")
			};

			return RedirectToAction("SignCodehSignatureInfo");
		}

		/**
		 * GET CodXmlSignature/SignCodeh/SignatureInfo
		 */
		[HttpGet]
		[Route("SignCodeh/SignatureInfo")]
		public ActionResult SignCodehSignatureInfo() {

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