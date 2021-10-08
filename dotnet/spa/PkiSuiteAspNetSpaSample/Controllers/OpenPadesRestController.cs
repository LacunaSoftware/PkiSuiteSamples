using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetSpaSample.Classes;
using PkiSuiteAspNetSpaSample.Models.Rest;
using System;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class OpenPadesRestController : ControllerBase {
		private readonly StorageMock _storageMock;
		private readonly Util _util;

		public OpenPadesRestController(StorageMock storageMock, Util util)
		{
			_storageMock = storageMock;
			_util = util;
		}

		[HttpGet("{userfile}")]
		public async Task<PadesSignatureModel> IndexAsync(string userfile)
		{
			// Our action only works if a userfile is given to work with.
			if (!_storageMock.TryGetFile(userfile, out string userfilePath))
			{
				throw new Exception("Userfile not found");
			}

			// Get an instance of the PadesSignatureExplorer class, used to open/validate PDF signatures.
			var sigExplorer = new PadesSignatureExplorer(_util.GetRestPkiClient())
			{
				// Specify that we want to validate the signatures in the file, not only inspect them.
				Validate = true,
				// Specify the parameters for the signature validation:
				// Accept any PAdES signature as long as the signer has an ICP-Brasil certificate.
				DefaultSignaturePolicyId = StandardPadesSignaturePolicies.Basic,
				// Specify the security context to be used to determine trust in the certificate chain. We
				// have encapsulated the security context choice on Util.cs.
				SecurityContextId = Util.GetSecurityContextId()
			};

			// Set the PAdES signature file.
			sigExplorer.SetSignatureFile(userfilePath);

			// Call the Open() method, which returns the signature file's information.
			var signature = await sigExplorer.OpenAsync();

			return new PadesSignatureModel(signature);
		}
	}
}
