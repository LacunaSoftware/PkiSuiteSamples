using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PkiSuiteAspNetCoreAngularSample.Classes;
using PkiSuiteAspNetCoreAngularSample.Configuration;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// The settings the Angular app needs, fetched once when it starts.
/// </summary>
[ApiController]
[Route("api/configuration")]
public class ConfigurationController(IOptions<WebPkiOptions> webPkiOptions, Util util) : ControllerBase {

	// GET api/configuration
	[HttpGet]
	public ClientConfiguration Get() {
		return new ClientConfiguration(
			// The Web PKI license must reach the browser, where the component runs. It is not a
			// secret: it only lists the domains on which Web PKI may run.
			WebPkiLicense: webPkiOptions.Value.License,
			// The home page warns that the Rest PKI Core samples need an API key when none is set.
			// The API key itself never leaves the server.
			IsRestPkiCoreConfigured: util.IsRestPkiCoreConfigured
		);
	}
}

public record ClientConfiguration(string? WebPkiLicense, bool IsRestPkiCoreConfigured);
