using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetSpaSample.Classes;
using PkiSuiteAspNetSpaSample.Models.Rest;
using System;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Controllers {
	[Route("api/[controller]/[action]")]
	[ApiController]
	public class AuthenticationRestController : ControllerBase {
		private readonly Util _util;

		public AuthenticationRestController(Util util)
		{
			_util = util;
		}

		/**
		* GET: AuthenticationRestPki/Start
		* This action initiates an authentication with REST PKI and renders the authentication page.
		*/
		[HttpGet]
		public async Task<SignatureStartResponse> StartAsync()
		{

			// Get an instance of the Authentication class.
			var auth = _util.GetRestPkiClient().GetAuthentication();

			// Call the StartWithWebPki() method, which initiates the authentication. This yields the
			// "token", a 22-character case-sensitive URL-safe string, which represents this authentication
			// process. We'll use this value to call the signWithRestPki() method on the Web PKI component
			// (see javascript on the view) and also to call the CompleteWithWebPki() method on the POST
			// action below (this should not be mistaken with the API access token). We have encapsulated the
			// security context choice on Util.cs.
			var token = await auth.StartWithWebPkiAsync(Util.GetSecurityContextId());

			return new SignatureStartResponse()
			{
				Token = token
			};
		}

		/**
		* POST: AuthenticationRestPki/Complete
		* 
		* This action receives the form submission form the view. We'll call REST PKI to validate the
		* authentication.
		*/
		[HttpPost]
		public async Task<AuthenticationCompleteResponse> CompleteAsync([FromBody] SignatureCompleteRequest request)
		{
			// Get an instance of the Authentication class.
			var auth = _util.GetRestPkiClient().GetAuthentication();

			// Call the CompleteWithWebPki() method with the token, which finalizes the authentication
			// process. The call yields a ValidationResults which denotes whether the authentication was
			// successful or not.
			var validationResults = await auth.CompleteWithWebPkiAsync(request.Token);

			// Check the authentication result.
			if (validationResults.IsValid)
			{
				return new AuthenticationCompleteResponse()
				{
					IsValid = validationResults.IsValid,
					ValidationResults = validationResults.ToModel(),
					Certificate = new CertificateModel(auth.GetCertificate())
				};
			} else {
				return new AuthenticationCompleteResponse()
				{
					IsValid = validationResults.IsValid,
					ValidationResults = validationResults.ToModel()
				};
			}
		}
	}
}