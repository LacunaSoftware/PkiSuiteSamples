using Lacuna.Pki.BrazilTrustServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PkiSuiteAspNetSpaSample.Models;
using System.Collections.Generic;
using System.Linq;

namespace PkiSuiteAspNetSpaSample.Controllers {

	[Route("api/[controller]")]
	[ApiController]
	public class ConfigurationController : ControllerBase {

		private readonly PkiSuiteConfig pkiSuiteConfig;

		public ConfigurationController(
			IOptions<PkiSuiteConfig> pkiSuiteConfig
		)
		{
			this.pkiSuiteConfig = pkiSuiteConfig.Value;
		}

		[HttpGet]
		public ClientConfig Get()
		{
			var config = new ClientConfig()
			{
				WebPkiLicense = pkiSuiteConfig.WebPkiLicense
			};
			return config;
		}
	}
}
