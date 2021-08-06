using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PkiSuiteAspNetSpaSample.Models;
using System.Configuration;

namespace PkiSuiteAspNetSpaSample.Controllers {
	public class HomeController : Controller {

		private readonly IOptions<RestPkiConfig> _restPkiConfig;
		private readonly IOptions<RestPkiCoreConfig> _restPkiCoreConfig;

		public HomeController(IOptions<RestPkiConfig> restPkiConfig, IOptions<RestPkiCoreConfig> restPkiCoreConfig)
		{
			_restPkiConfig = restPkiConfig;
			_restPkiCoreConfig = restPkiCoreConfig;
		}

		[HttpGet]
		public IActionResult Index()
		{
			return View();
		}

		[HttpGet]
		// Checks PKI SDK license
		public ActionResult RedirectToSPA(string rc, string fwd = "", string op = "")
		{
			if (string.IsNullOrEmpty(rc))
			{
				return RedirectToAction("Index", "Home");
			}

			if (!string.IsNullOrEmpty(fwd))
			{
				if (!string.IsNullOrEmpty(op))
				{
					return LocalRedirect($"/{rc}?rc={fwd}-sdk&op={op}");
				}
				else
				{
					return LocalRedirect($"/{rc}?rc={fwd}-sdk");
				}
			}

			return LocalRedirect($"/{rc}-sdk");
		}

		[HttpGet]
		// Checks REST PKI access token
		public ActionResult CheckRestPkiToken(string rc, string fwd = "", string op = "")
		{
			var accessToken = _restPkiConfig.Value.AccessToken;
			if (string.IsNullOrEmpty(accessToken) || accessToken.Contains(" API "))
			{
				return View("RestPkiTokenNotSet");
			}

			if (string.IsNullOrEmpty(rc))
			{
				return RedirectToAction("Index", "Home");
			}

			if (!string.IsNullOrEmpty(fwd))
			{
				if (!string.IsNullOrEmpty(op))
				{
					return LocalRedirect($"/{rc}?rc={fwd}-rest&op={op}");
				}
				else
				{
					return LocalRedirect($"/{rc}?rc={fwd}-rest");
				}
			}

			return LocalRedirect($"/{rc}-rest");
		}

	}
}
