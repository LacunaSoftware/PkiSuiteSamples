using PkiSuiteAspNetMvcSample.Classes;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class HomeController : BaseController {

		// Renders the main page
		public ActionResult Index() {
			return View();
		}

		// Checks PKI SDK license
		public ActionResult CheckPkiLicense(string rc, string ctrl = "", string op = "") {
			if (!System.IO.File.Exists(Util.PkiLicensePath)) {
				return View("PkiLicenseNotFound");
			}

			if (string.IsNullOrEmpty(rc)) {
				return RedirectToAction("Index", "Home");
			}

			if (!string.IsNullOrEmpty(ctrl)) {
				if (!string.IsNullOrEmpty(op)) {
					return RedirectToAction("Index", rc, new { rc = ctrl, operation = op });
				} else {
					return RedirectToAction("Index", rc, new { rc = ctrl });
				}
			}

			return RedirectToAction("Index", rc);
		}

		// Checks REST PKI access token
		public ActionResult CheckRestPkiToken(string rc, string ctrl = "", string op = "") {
			var accessToken = ConfigurationManager.AppSettings["RestPkiAccessToken"];
			if (string.IsNullOrEmpty(accessToken) || accessToken.Contains(" API ")) {
				return View("RestPkiTokenNotSet");
			}

			if (string.IsNullOrEmpty(rc)) {
				return RedirectToAction("Index", "Home");
			}

			if (!string.IsNullOrEmpty(ctrl)) {
				if (!string.IsNullOrEmpty(op)) {
					return RedirectToAction("Index", rc, new { rc = ctrl, operation = op });
				} else {
					return RedirectToAction("Index", rc, new { rc = ctrl });
				}
			}

			return RedirectToAction("Index", rc);
		}

	}
}