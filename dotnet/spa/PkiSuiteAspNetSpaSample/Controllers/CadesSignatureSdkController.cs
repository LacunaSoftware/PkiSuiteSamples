using Lacuna.Pki;
using Lacuna.Pki.Cades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetSpaSample.Classes;
using PkiSuiteAspNetSpaSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Controllers {
	[Route("api/[controller]/[action]")]
	[ApiController]
	public class CadesSignatureSdkController : ControllerBase {
		private readonly StorageMock _storageMock;

		public CadesSignatureSdkController(StorageMock storageMock)
		{
			_storageMock = storageMock;
		}

		private ICadesPolicyMapper getSignaturePolicy()
		{
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

		/**
		* POST: CadesSignature
		* 
		* This action is called once the user's certificate encoding has been read, and contains the 
		* logic to prepare the hash that needs to be actually signed with the user's private key
		* (the "to-sign-hash").
		*/
		[HttpPost]
		public CadesSignatureStartResponse Start([FromBody] CadesSignatureStartRequest request) {

			byte[] toSignBytes;
			SignatureAlgorithm signatureAlg;

			try {
				// Verify if the userfile exists and get its absolute path.
				if (!_storageMock.TryGetFile(request.UserFile, out byte[] userfileContent))
				{
					throw new Exception("Userfile not found");
				}

				// Decode the user's certificate.
				var cert = PKCertificate.Decode(request.CertContent);

				// Get an instance of the CadesSigner class.
				var cadesSigner = new CadesSigner();

				if(request.IsCosign)
				{
					cadesSigner.SetSignatureToCoSign(userfileContent);
				} else
				{
					cadesSigner.SetDataToSign(userfileContent);
				}

				// Set the signer certificate.
				cadesSigner.SetSigningCertificate(cert);

				// Set the signature policy.
				cadesSigner.SetPolicy(getSignaturePolicy());

				// Generate the "to-sign-bytes". This method also yields the signature algorithm that must
				// be used on the client-side, based on the signature policy.
				toSignBytes = cadesSigner.GenerateToSignBytes(out signatureAlg);

			} catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate
				// encoding cannot be read or if the certificate is expired.
				//ModelState.AddModelError("", ex.ValidationResults.ToString());
				return new CadesSignatureStartResponse()
				{
					Success = false,
					ValidationResults = ex.ValidationResults.ToModel()
				};
			}

			return new CadesSignatureStartResponse()
			{
				Success = true,
				ToSignBytes = toSignBytes,
				ToSignHash = signatureAlg.DigestAlgorithm.ComputeHash(toSignBytes),
				DigestAlgorithm = signatureAlg.DigestAlgorithm.Oid,
				UserFile = request.UserFile,
				CertContent = request.CertContent,
				CertThumb = request.CertThumb,
				IsCosign = request.IsCosign
			};
		}

		/**
		* POST: CadesSignature/Complete
		* 
		* This action is called once the "to-sign-hash" are signed using the user's certificate.
		* After signature, it'll be redirected to SignatureInfo action to show the signature file.
		*/
		[HttpPost]
		public CadesSignatureCompleteResponse Complete([FromBody] CadesSignatureCompleteRequest request) {
			byte[] signatureContent;

			try {

				// Recover the "transfer data" content stored in a temporary file.
				if (!_storageMock.TryGetFile(request.UserFile, out byte[] userfileContent))
				{
					throw new Exception("TransferData not found");
				}

				// Get an instance of the CadesSigner class.
				var cadesSigner = new CadesSigner();

				if (request.IsCosign)
				{
					cadesSigner.SetSignatureToCoSign(userfileContent);
				}
				else
				{
					cadesSigner.SetDataToSign(userfileContent);
				}

				// Set the signature policy, exactly like in the Start method.
				cadesSigner.SetPolicy(getSignaturePolicy());

				// Decode the user's certificate and set as the signer certificate.
				var cert = PKCertificate.Decode(request.CertContent);
				cadesSigner.SetSigningCertificate(cert);

				// Set the signature computed on the client-side, along with the "to-sign-bytes" (rendered in a hidden input field, see the view)
				cadesSigner.SetPrecomputedSignature(request.Signature, request.ToSignBytes);

				// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
				cadesSigner.ComputeSignature();

				// Get the signature as an array of bytes
				signatureContent = cadesSigner.GetSignature();

			} catch (ValidationException ex) {
				// Return userfile to continue the signature with the same file.
				return new CadesSignatureCompleteResponse()
				{
					ValidationResults = ex.ValidationResults.ToModel(),
					Success = false
				};
			}

			return new CadesSignatureCompleteResponse()
			{
				Success = true,
				// Store the signature file on the folder "App_Data/" and redirects to the SignatureInfo action with the filename.
				// With this filename, it can show a link to download the signature file.
				SignedFileId = _storageMock.Store(signatureContent, ".p7s")
			};
		}
	}
}