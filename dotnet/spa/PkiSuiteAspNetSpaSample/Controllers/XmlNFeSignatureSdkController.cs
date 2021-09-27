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
	public class XmlNFeSignatureSdkController : ControllerBase {
		private readonly StorageMock _storageMock;

		public XmlNFeSignatureSdkController(StorageMock storageMock)
		{
			_storageMock = storageMock;
		}

		/**
		 * This method defines the signature policy that will be used on the signature.
		*/
		private XmlPolicySpec GetSignaturePolicy()
		{

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

		/**
		 * POST: XmlNFeSignatureSdk
		 * 
		 * This action is called once the user's certificate encoding has been read, and contains the
		 * logic to prepare the hash that needs to be actually signed with the user's private key
		 * (the "to-sign-hash").
		 */
		[HttpPost]
		public XmlNFeSignatureStartResponse Start(XmlNFeSignatureStartRequest request)
		{

			byte[] toSignHash, transferData;
			SignatureAlgorithm signatureAlg;

			try
			{
				// Instantiate a XmlElementSigner class
				var signer = new XmlElementSigner();

				// Set the data to sign, which in the case of this example is a fixed sample document
				signer.SetXml(_storageMock.GetSampleNFeContent());

				// static Id from node <infNFe> from SampleNFe.xml document
				signer.SetToSignElementId("NFe35141214314050000662550010001084271182362300");

				// Decode the user's certificate and set as the signer certificate
				var cert = PKCertificate.Decode(request.CertContent);
				signer.SetSigningCertificate(cert);

				// Set the signature policy
				signer.SetPolicy(GetSignaturePolicy());

				// Generate the "to-sign-hash". This method also yields the signature algorithm that must
				// be used on the client-side, based on the signature policy.
				toSignHash = signer.GenerateToSignHash(out signatureAlg, out transferData);

			} catch (ValidationException ex)
			{
				// Some of the operations above may throw a ValidationException, for instance if the certificate
				// encoding cannot be read or if the certificate is expired.
				//ModelState.AddModelError("", ex.ValidationResults.ToString());
				return new XmlNFeSignatureStartResponse()
				{
					Success = false,
					ValidationResults = ex.ValidationResults.ToModel()
				};
			}

			return new XmlNFeSignatureStartResponse()
			{
				Success = true,
				TransferDataFileId = _storageMock.Store(transferData, ".bin"),
				ToSignHash = toSignHash,
				DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid
			};
		}

		/**
		 * POST: XmlNFeSignatureSdk/Complete
		 * 
		 * This action is called once the "to-sign-hash" are signed using the user's 
		 * certificate. After signature, it'll return the signature file.
		 */
		[HttpPost]
		public XmlNFeSignatureCompleteResponse Complete(XmlNFeSignatureCompleteRequest request)
		{

			byte[] signatureContent;

			try
			{

				// Recover the "transfer data" content stored in a temporary file.
				byte[] transferDataContent;
				if (!_storageMock.TryGetFile(request.TransferDataFileId, out transferDataContent))
				{
					throw new Exception("TransferData not found");
				}

				// Instantiate a XmlElementSigner class
				var signer = new XmlElementSigner();

				// Set the document to be signed and the policy, exactly like in the Start method
				signer.SetXml(_storageMock.GetSampleNFeContent());
				signer.SetPolicy(GetSignaturePolicy());

				// Set the signature computed on the client-side, along with the "transfer data"
				// (rendered in a hidden field, see the view)
				signer.SetPrecomputedSignature(request.Signature, transferDataContent);

				// Call ComputeSignature(), which does all the work, including validation
				// of the signer's certificate and of the resulting signature
				signer.ComputeSignature();

				// Get the signed XML as an array of bytes
				signatureContent = signer.GetSignedXml();

			} catch (ValidationException ex)
			{
				// Some of the operations above may throw a ValidationException, for instance
				// if the certificate encoding cannot be read or if the certificate is expired.
				// ModelState.AddModelError("", ex.ValidationResults.ToString());
				return new XmlNFeSignatureCompleteResponse()
				{
					Success = false,
					ValidationResults = ex.ValidationResults.ToModel()
				};
			}
			return new XmlNFeSignatureCompleteResponse()
			{
				// Store the signature file on the folder "App_Data/" and redirects to the
				// SignatureInfo action with the filename. With this filename, it can show
				// a link to download the signature file.
				SignedFileId = _storageMock.Store(signatureContent, ".xml")
			};
		}
	}
}
