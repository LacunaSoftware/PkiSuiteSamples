using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace PkiSuiteAspNetMvcSample.Api {
	
	public class BatchCadesSignatureRestController : ApiController {

		/**
		 * POST: Api/BatchCadesSignature/Start
		 * 
		 * This action is called asynchronously from the batch signature page in order to initiate the
		 * signature of each document in the batch.
		 */
		[HttpPost]
		public async Task<IHttpActionResult> Start(int id) {

			// Get an instance of the CadesSignatureStarter class, responsible for receiving the signature
			// elements and start the signature process.
			var signatureStarter = new CadesSignatureStarter(Util.GetRestPkiClient()) {

				// Set the signature policy.
				SignaturePolicyId = StandardCadesSignaturePolicies.PkiBrazil.AdrBasica,

				// Set the security context to be used to determine trust in the certificate chain. We have
				// encapsulated the security context choice on Util.cs.
				SecurityContextId = Util.GetSecurityContextId(),

				// Optionally, set whether the content should be encapsulated in the resulting CMS.
				EncapsulateContent = true
			};

			// Set the document to be signed based on its ID (passed to us from the page).
			signatureStarter.SetFileToSign(StorageMock.GetBatchDocPath(id));

			// Call the StartWithWebPki() method, which initiates the signature. This yields the token, a
			// 43-character case-sensitive URL-safe string, which identifies this signature process. We'll
			// use this value to call the signWithRestPki() method on the Web PKI component (see
			// batch-signature-form.js) and also to complete the signature on the POST action below (this
			// should not be mistaken with the API access token).
			var token = await signatureStarter.StartWithWebPkiAsync();

			// Return a JSON with the token obtained from REST PKI. (the page will use jQuery to decode this 
			// value)
			return Ok(token);
		}

		/**
		 * POST: Api/BatchCadesSignature/Complete
		 * 
		 * This action receives the form submission from the view. We'll call REST PKI to complete the
		 * signature.
		 *
		 * Notice that the "id" is actually the signature process token. We're naming it "id" so that the
		 * action can be called as /BatchCadesSignature/Complete/{token}
		 */
		[HttpPost]
		public async Task<IHttpActionResult> Complete(string id) {

			// Get an instance of the CadesSignatureFinisher2 class, responsible for completing the signature
			// process.
			var signatureFinisher = new CadesSignatureFinisher2(Util.GetRestPkiClient()) {

				// Set the token for this signature. (rendered in a hidden input field, see the view)
				Token = id
			};

			// Call the Finish() method, which finalizes the signature process and returns a
			// SignatureResult object.
			var result = await signatureFinisher.FinishAsync();

			// The "Certificate" property of the SignatureResult object contains information about the
			// certificate used by the user to sign the file.
			var signerCert = result.Certificate;

			// At this point, you'd typically store the signed PDF on your database. For demonstration
			// purposes, we'll store the PDF on our mock Storage class.

			// The SignatureResult object has various methods for writing the signature file to a stream
			// (WriteTo()), local file (WriteToFile()), open a stream to read the content (OpenRead()) and
			// get its contents (GetContent()). For large files, avoid the method GetContent() to avoid
			// memory allocation issues.
			string fileId;
			using (var resultStream = result.OpenRead()) {
				fileId = StorageMock.Store(resultStream, ".p7s");
			}

			// Return a JSON with the signed file's id, stored using our mock class (the page will use
			// jQuery to decode this value).
			return Ok(fileId);
		}
	}
}
