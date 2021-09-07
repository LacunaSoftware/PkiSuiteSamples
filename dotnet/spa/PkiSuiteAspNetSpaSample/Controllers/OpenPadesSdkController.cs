using Lacuna.Pki.Pades;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetSpaSample.Classes;
using PkiSuiteAspNetSpaSample.Models.Sdk;
using System;


namespace PkiSuiteAspNetSpaSample.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class OpenPadesSdkController : ControllerBase {
		private readonly StorageMock _storageMock;
		private readonly Util _util;

		public OpenPadesSdkController(StorageMock storageMock, Util util)
		{
			_storageMock = storageMock;
			_util = util;
		}

		[HttpGet("{userfile}")]
		public PadesSignatureModel Index(string userfile)
		{
			// Our action only works if a userfile is given to work with.
			byte[] userfileContent;
			if (!_storageMock.TryGetFile(userfile, out userfileContent))
			{
				throw new Exception("Userfile not found");
			}
			// Open Cades file
			var signature = PadesSignature.Open(userfileContent);

			// Specify the parameters for the signature validation:
			// Define the trust arbitrator used to validate the certificate.
			var trustArbitrator = Util.GetTrustArbitrator();
			var policyMapper = PadesPoliciesForValidation.GetPadesBasic(trustArbitrator);

			return new PadesSignatureModel(signature, policyMapper);
		}
	}
}
