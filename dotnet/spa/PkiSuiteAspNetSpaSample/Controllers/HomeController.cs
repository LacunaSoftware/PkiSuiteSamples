using Microsoft.AspNetCore.Mvc;
using System.Configuration;

namespace PkiSuiteAspNetSpaSample.Controllers {
	public class HomeController : Controller {
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
			var accessToken = ConfigurationManager.AppSettings["RestPkiAccessToken"];
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
