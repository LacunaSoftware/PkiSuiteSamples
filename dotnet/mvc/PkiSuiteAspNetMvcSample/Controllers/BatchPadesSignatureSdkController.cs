using Lacuna.Pki;
using Lacuna.Pki.Pades;
using PkiSuiteAspNetMvcSample.Api.Models.Sdk;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class BatchPadesSignatureSdkController : BaseController {

		private IPadesPolicyMapper GetSignaturePolicy() {

			// Get our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator()).
			var arbitrator = Util.GetTrustArbitrator();

			return PadesPoliciesForGeneration.GetPadesBasic(arbitrator);
		}

		// GET: BatchSignature
		public ActionResult Index() {
			// It is up to your application's business logic to determine which documents will compose the batch
			var model = new BatchSignatureModel() {
				DocumentIds = Enumerable.Range(1, 30).ToList() // from 1 to 30
			};
			// Render the batch signature page
			return View(model);
		}

		/**
		 * POST /BatchPadesSignatureSdk/Start
		 * 
		 * This action is called asynchronously from the batch signature page in order to initiate the signature
		 * of each document in the batch.
		 */
		[HttpPost]
		public ActionResult Start(BatchSignatureStartRequest request) {

			byte[] toSignBytes, transferData;
			SignatureAlgorithm signatureAlg;


			// Decode the user's certificate
			var cert = PKCertificate.Decode(request.CertContent);

			// Instantiate a PadesSigner class
			var padesSigner = new PadesSigner();

			// Set the PDF to sign, which in the case of this example is one of the batch documents
			padesSigner.SetPdfToSign(StorageMock.GetBatchDocPath(request.Id));

			// Set the signer certificate
			padesSigner.SetSigningCertificate(cert);

			// Set the signature policy.
			padesSigner.SetPolicy(GetSignaturePolicy());

			// Set a visual representation for the signature.
			padesSigner.SetVisualRepresentation(PadesVisualElements.GetVisualRepresentationForPkiSdk(cert));

			// Generate the "to-sign-bytes". This method also yields the signature algorithm that must
			// be used on the client-side, based on the signature policy, as well as the "transfer data",
			// a byte-array that will be needed on the next step.
			toSignBytes = padesSigner.GetToSignBytes(out signatureAlg, out transferData);

			// For the next steps, we'll need once again some information:
			// - The "transfer data" filename. Its content is stored in a temporary file (with extension .bin) to
			// be shared with the Complete action.
			// - The "to-sign-hash" (digest of the "to-sign-bytes"). And the OID of the digest algorithm to be 
			// used during the signature operation. this information is need in the signature computation with
			// Web PKI component. (see batch-signature-form.js)
			return Json(new BatchPadesSignatureStartResponse() {
				TransferDataFileId = StorageMock.Store(transferData, ".bin"),
				ToSignHash = signatureAlg.DigestAlgorithm.ComputeHash(toSignBytes),
				DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid
			});
		}

		/**
		 * POST: /BatchPadesSignatureSdk/Complete
		 * 
		 * This action is called once the "to-sign-hash" are signed using the user's certificate. After signature,
		 * it'll be redirect to SignatureInfo action to show the signature file.
		 */
		[HttpPost]
		public ActionResult Complete(BatchPadesSignatureCompleteRequest request) {

			byte[] signatureContent;

			// Recover the "transfer data" content stored in a temporary file.
			byte[] transferDataContent;
			if (!StorageMock.TryGetFile(request.TransferDataFileId, out transferDataContent)) {
				return HttpNotFound();
			}

			// Instantiate a PadesSigner class
			var padesSigner = new PadesSigner();

			// Set the signature policy.
			padesSigner.SetPolicy(GetSignaturePolicy());

			// Set the signature computed on the client-side, along with the "transfer data" recovered from a temporary file
			padesSigner.SetPreComputedSignature(request.Signature, transferDataContent);

			// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the 
			// resulting signature
			padesSigner.ComputeSignature();

			// Get the signed PDF as an array of bytes
			signatureContent = padesSigner.GetPadesSignature();

			return Json(new BatchSignatureCompleteResponse() {
				SignedFileId = StorageMock.Store(signatureContent, ".pdf")
			});
		}
	}
}