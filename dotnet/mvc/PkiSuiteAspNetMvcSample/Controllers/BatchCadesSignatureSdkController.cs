using Lacuna.Pki;
using Lacuna.Pki.Cades;
using PkiSuiteAspNetMvcSample.Api.Models.Sdk;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class BatchCadesSignatureSdkController : BaseController {
		/**
			This method defines the signature policy that will be used on the signature.
		 */
		private ICadesPolicyMapper getSignaturePolicy() {

			var policy = CadesPoliciesForGeneration.GetPkiBrazilAdrBasica();

#if DEBUG
			// During debug only, we return a wrapper which will overwrite the policy's default trust arbitrator
			// (which in this case corresponds to the ICP-Brasil roots only), with our custom trust arbitrator
			// which accepts test certificates (see Util.GetTrustArbitrator()).
			return new CadesPolicyMapperWrapper(policy, Util.GetTrustArbitrator());
#else
			return policy;
#endif
		}

		// GET: BatchCadesSignatureSdk
		public ActionResult Index() {
			// It is up to your application's business logic to determine which documents will compose the
			// batch.
			var model = new BatchSignatureModel() {
				DocumentIds = Enumerable.Range(1, 30).ToList() // From 1 to 30.
			};
			// Render the batch signature page.
			return View(model);
		}

		/**
		 * POST /BatchCadesSignatureSdk/Start
		 * 
		 * This action is called asynchronously from the batch signature page in order to initiate the signature
		 * of each document in the batch.
		 */
		[HttpPost]
		public ActionResult Start(BatchSignatureStartRequest request) {
			// Instantiate a CadesSigner class
			var cadesSigner = new CadesSigner();

			// Get the file's content.
			if (!StorageMock.TryGetFileUrlSafe(StorageMock.GetBatchDocPath(request.Id), out byte[] fileContent)) {
				return HttpNotFound();
			}

			// We'll set the content of the file to be signed.
			cadesSigner.SetDataToSign(fileContent);

			// Decode the user's certificate and set as the signer certificate.
			var cert = PKCertificate.Decode(request.CertContent);
			cadesSigner.SetSigningCertificate(cert);

			// Set the signature policy
			cadesSigner.SetPolicy(getSignaturePolicy());

			// Generate the "to-sign-bytes". This method also yields the signature algorithm that must
			// be used on the client-side, based on the signature policy.
			byte[] toSignBytes = cadesSigner.GenerateToSignBytes(out SignatureAlgorithm signatureAlg);

			// For the next steps, we'll need once again some information:
			// - The "to-sign-hash" (digest of the "to-sign-bytes"). And the OID of the digest algorithm to be 
			// used during the signature operation. this information is need in the signature computation with
			// Web PKI component. (see batch-cades-signature-form.js). And the to-sign-bytes.
			return Json(new BatchCadesSignatureStartResponse() {
				ToSignHash = signatureAlg.DigestAlgorithm.ComputeHash(toSignBytes),
				DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid,
				ToSignBytes = toSignBytes
			});

		}

		/**
		 * POST: /BatchCadesSignatureSdk/Complete
		 * 
		 * This action is called once the "to-sign-hash" are signed using the user's certificate. After signature,
		 * it'll be redirect to SignatureInfo action to show the signature file.
		 */
		[HttpPost]
		public ActionResult Complete(BatchCadesSignatureCompleteRequest request) {
			// Instantiate a CadesSigner class
			var cadesSigner = new CadesSigner();

			StorageMock.TryGetFileUrlSafe(StorageMock.GetBatchDocPath(request.Id), out byte[] fileContent);

			cadesSigner.SetDataToSign(fileContent);

			// Set the signature policy, exactly like in the Start method.
			cadesSigner.SetPolicy(getSignaturePolicy());

			// Decode the user's certificate and set as the signer certificate.
			var cert = PKCertificate.Decode(request.CertContent);
			cadesSigner.SetSigningCertificate(cert);

			// Set the signature computed on the client-side, along with the "to-sign-bytes"
			cadesSigner.SetPrecomputedSignature(request.Signature, request.ToSignBytes);

			// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
			cadesSigner.ComputeSignature();

			// Get the signature as an array of bytes
			byte[] signatureContent = cadesSigner.GetSignature();

			return Json(new BatchSignatureCompleteResponse() {
				SignedFileId = StorageMock.Store(signatureContent, ".p7s")
			});
		}

	}
}