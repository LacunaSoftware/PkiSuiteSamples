using Lacuna.Pki;
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
	public class AuthenticationSdkController : ControllerBase {
		private readonly Util _util;

		public AuthenticationSdkController(Util util)
		{
			_util = util;
		}

		/**
		* GET: AuthenticationSdk/Start
		* 
		* This action sets a NonceStore needed for authentication. And if it is rendered by some error that
		* occured, it will show the error message to the user and generate another instance of a NonceStore,
		* letting the user to sign again.
		*/
		[HttpGet]
		public AuthenticationStartResponse Start()
		{
			// The PKCertificateAuthentication class requires an implementation of INonceStore. We'll use the
			// FileSystemNonceStore class.
			var nonceStore = _util.GetNonceStore();

			// Instantiate the PKCertificateAuthentication class passing our EntityFrameworkNonceStore.
			var certAuth = new PKCertificateAuthentication(nonceStore);

			// Call the Start() method, which is the first of the two server-side steps. This yields the nonce,
			// a 16-byte-array which we'll send to the view.
			var nonce = certAuth.Start();

			// Notice that this previous will be executed even if an error has occured and it was redirected to
			// this action.
			return new AuthenticationStartResponse()
			{
				Nonce = nonce,
				DigestAlgorithm = PKCertificateAuthentication.DigestAlgorithm.Oid,
			};
		}

		/**
		* POST: AuthenticationSdk/Complete
		* 
		* It uses the PKCertificateAuthentication class to generate and store a 
		* cryptographic nonce, which will then be sent to the view for signature
		* using the user's certificate.
		*/
		[HttpPost]
		public AuthenticationCompleteResponse Complete([FromBody] AuthenticationCompleteRequest request)
		{
			// As before, we instantiate a FileSystemNonceStore class and use that to instantiate a
			// PKCertificateAuthentication.
			var nonceStore = _util.GetNonceStore();
			var certAuth = new PKCertificateAuthentication(nonceStore);

			// Call the Complete() method, which is the last of the two server-side steps. It receives:
			// - The nonce which was signed using the user's certificate.
			// - The user's certificate encoding.
			// - The nonce signature.
			// - A TrustArbitrator to be used to determine trust in the certificate.
			// The call yields:
			// - A ValidationResults which denotes whether the authentication was successful or not.
			// - The user's decoded certificate.
			var vr = certAuth.Complete(request.Nonce, request.Certificate, request.Signature, Util.GetTrustArbitrator(), out PKCertificate certificate);

			// Check the authentication result.
			if (vr.IsValid)
			{
				return new AuthenticationCompleteResponse()
				{
					IsValid = vr.IsValid,
					ValidationResults = vr.ToModel(),
					Certificate = new CertificateModel(certificate)
				};
			}
			else
			{
				return new AuthenticationCompleteResponse()
				{
					IsValid = vr.IsValid,
					ValidationResults = vr.ToModel()
				};
			}
		}
	}
}