using Lacuna.Pki;
using Lacuna.Pki.Pades;
using Microsoft.AspNetCore.Http;
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
	public class PadesSignatureSdkController : ControllerBase {
		private readonly StorageMock _storageMock;
		private readonly PadesVisualElements _padesVisualElements;

		public PadesSignatureSdkController(StorageMock storageMock, PadesVisualElements padesVisualElements)
		{
			_storageMock = storageMock;
			_padesVisualElements = padesVisualElements;
		}

		private IPadesPolicyMapper GetSignaturePolicy()
		{

			// Get our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator()).
			var arbitrator = Util.GetTrustArbitrator();

			return PadesPoliciesForGeneration.GetPadesBasic(arbitrator);
		}

		/**
		* POST: PadesSignature
		* 
		* This action is called once the user's certificate encoding has been read, and contains the 
		* logic to prepare the hash that needs to be actually signed with the user's private key
		* (the "to-sign-hash").
		*/
		[HttpPost]
		public SignatureStartResponse Start([FromBody] PadesSignatureStartRequest request)
		{

			byte[] toSignBytes, transferData;
			SignatureAlgorithm signatureAlg;

			try
			{
				// Verify if the userfile exists and get its absolute path.
				if (!_storageMock.TryGetFile(request.UserFile, out string userfilePath))
				{
					throw new Exception("Userfile not found");
				}

				// Decode the user's certificate.
				var cert = PKCertificate.Decode(request.CertContent);

				// Get an instance of the PadesSigner class.
				var padesSigner = new PadesSigner();

				// Set the file to be signed.
				padesSigner.SetPdfToSign(userfilePath);

				// Set the signer certificate.
				padesSigner.SetSigningCertificate(cert);

				// Set the signature policy.
				padesSigner.SetPolicy(GetSignaturePolicy());

				// Set a visual representation for the signature.
				padesSigner.SetVisualRepresentation(_padesVisualElements.GetVisualRepresentationForPkiSdk(cert));

				// Generate the "to-sign-bytes". This method also yields the signature algorithm that must
				// be used on the client-side, based on the signature policy, as well as the "transfer data",
				// a byte-array that will be needed on the next step.
				toSignBytes = padesSigner.GetToSignBytes(out signatureAlg, out transferData);

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
				ToSignHash = signatureAlg.DigestAlgorithm.ComputeHash(toSignBytes),
				DigestAlgorithm = signatureAlg.DigestAlgorithm.Oid
			};
		}

		/**
		* POST: CadesSignature/Complete
		* 
		* This action is called once the "to-sign-hash" are signed using the user's certificate. After signature,
		* it'll be redirect to SignatureInfo action to show the signature file.
		*/
		[HttpPost]
		public SignatureCompleteResponse Complete([FromBody] SignatureCompleteRequest request)
		{
			byte[] signatureContent;

			try
			{

				// Recover the "transfer data" content stored in a temporary file.
				if (!_storageMock.TryGetFile(request.TransferDataFileId, out byte[] transferDataContent))
				{
					throw new Exception("TransferData not found");
				}

				// Get an instance of the PadesSigner class.
				var padesSigner = new PadesSigner();

				// Set the signature policy.
				padesSigner.SetPolicy(GetSignaturePolicy());

				// Set the signature computed on the client-side, along with the "transfer data" (rendered in a hidden field, see the view)
				padesSigner.SetPreComputedSignature(request.Signature, transferDataContent);

				// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
				padesSigner.ComputeSignature();

				// Get the signed PDF as an array of bytes
				signatureContent = padesSigner.GetPadesSignature();

			} catch (ValidationException ex)
			{
				// Return userfile to continue the signature with the same file.
				return new SignatureCompleteResponse()
				{
					ValidationResults = ex.ValidationResults.ToModel(),
					Success = false
				};
			}

			return new SignatureCompleteResponse()
			{
				Success = true,
				// Store the signature file on the folder "App_Data/" and redirects to the SignatureInfo action with the filename.
				// With this filename, it can show a link to download the signature file.
				SignedFileId = _storageMock.Store(signatureContent, ".pdf")
			};
		}
	}
}