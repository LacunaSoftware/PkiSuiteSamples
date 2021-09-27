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

		private readonly WebPkiConfig webPkiConfig;

		public ConfigurationController(
			IOptions<WebPkiConfig> webPkiConfig
		)
		{
			this.webPkiConfig = webPkiConfig.Value;
		}

		[HttpGet]
		public ClientConfig Get()
		{
			var config = new ClientConfig()
			{
				WebPki = webPkiConfig
			};
			return config;
		}
	}
}
