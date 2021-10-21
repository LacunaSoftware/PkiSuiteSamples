using Lacuna.Pki;
using Lacuna.Pki.Xml;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetSpaSample.Classes;
using PkiSuiteAspNetSpaSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Controllers {
	[Route("api/[controller]/[action]")]
	[ApiController]
	public class XmlSignatureSdkController : ControllerBase {
		private readonly StorageMock _storageMock;

		public XmlSignatureSdkController(StorageMock storageMock)
		{
			_storageMock = storageMock;
		}

		/**
		 * POST: XmlSignatureSdk
		 * 
		 * This action is called once the user's certificate encoding has been read, and contains the
		 * logic to prepare the hash that needs to be actually signed with the user's private key
		 * (the "to-sign-hash").
		 */
		[HttpPost]
		public SignatureStartResponse Start(XmlSignatureStartRequest request)
		{

			byte[] toSignHash, transferData;
			SignatureAlgorithm signatureAlg;

			try
			{
				// Instantiate a XmlSigner class
				var signer = new FullXmlSigner();

				// Set the data to sign, which in the case of this example is a fixed sample document
				signer.SetXml(_storageMock.GetSampleXmlDocumentContent());

				// Decode the user's certificate and set as the signer certificate
				signer.SetSigningCertificate(PKCertificate.Decode(request.CertContent));

				// Set the signature policy
				signer.SetPolicy(XmlPolicySpec.GetXadesBasic(Util.GetTrustArbitrator()));

				// Set the location on which to insert the signature node. If the location is not specified, the
				// signature will appended to the root element (which is most usual with enveloped signatures).
				var nsm = new NamespaceManager();
				nsm.AddNamespace("ls", "http://www.lacunasoftware.com/sample");
				signer.SetSignatureElementLocation("//ls:signaturePlaceholder", nsm, XmlInsertionOptions.AppendChild);

				// Generate the "to-sign-hash". This method also yields the signature algorithm that must
				// be used on the client-side, based on the signature policy.
				toSignHash = signer.GenerateToSignHash(out signatureAlg, out transferData);

			} catch (ValidationException ex)
			{
				// Some of the operations above may throw a ValidationException, for instance if the certificate
				// encoding cannot be read or if the certificate is expired.
				//ModelState.AddModelError("", ex.ValidationResults.ToString());
				return new SignatureStartResponse()
				{
					Success = false,
					ValidationResults = ex.ValidationResults.ToModel()
				};
			}

			return new SignatureStartResponse()
			{
				Success = true,
				TransferDataId = _storageMock.Store(transferData, ".bin"),
				ToSignHash = toSignHash,
				DigestAlgorithm = signatureAlg.DigestAlgorithm.Oid
			};
		}

		/**
		 * POST: XmlSignatureSdk/Complete
		 * 
		 * This action is called once the "to-sign-hash" are signed using the user's 
		 * certificate. After signature, it'll return the signature file.
		 */
		[HttpPost]
		public SignatureCompleteResponse Complete(SignatureCompleteRequest request)
		{

			byte[] signatureContent;

			try
			{
				// Recover the "transfer data" content stored in a temporary file.
				if (!_storageMock.TryGetFile(request.TransferDataId, out byte[] transferDataContent))
				{
					throw new Exception("TransferData not found");
				}

				// Instantiate a FullXmlSigner class
				var signer = new FullXmlSigner();

				// Set the document to be signed and the policy, exactly like in the Start method
				signer.SetXml(_storageMock.GetSampleXmlDocumentContent());
				signer.SetPolicy(XmlPolicySpec.GetXadesBasic(Util.GetTrustArbitrator()));

				// Set the signature computed on the client-side, along with the "transfer data" (rendered
				// in a hidden field, see the view)
				signer.SetPrecomputedSignature(request.Signature, transferDataContent);

				// Call ComputeSignature(), which does all the work, including validation of the signer's
				// certificate and of the resulting signature
				signer.ComputeSignature();

				// Get the signed XML as an array of bytes
				signatureContent = signer.GetSignedXml();

			} catch (ValidationException ex)
			{
				// Some of the operations above may throw a ValidationException, for instance
				// if the certificate encoding cannot be read or if the certificate is expired.
				// ModelState.AddModelError("", ex.ValidationResults.ToString());
				return new SignatureCompleteResponse()
				{
					Success = false,
					ValidationResults = ex.ValidationResults.ToModel()
				};
			}
			return new SignatureCompleteResponse()
			{
				// Store the signature file on the folder "App_Data/" and redirects to the
				// SignatureInfo action with the filename. With this filename, it can show
				// a link to download the signature file.
				SignedFileId = _storageMock.Store(signatureContent, ".xml")
			};
		}
	}
}
