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
		public ActionResult CheckPkiLicense(string rc, string upload = "", string cosign = "") {
			if (!System.IO.File.Exists(Util.PkiLicensePath)) {
				return View("PkiLicenseNotFound");
			}
			if (!string.IsNullOrEmpty(upload)) {
				return RedirectToAction("Index", rc, new { rc = upload });
			}
			if (!string.IsNullOrEmpty(cosign)) {
				return RedirectToAction("Index", rc, new { cosignRC = cosign });
			}
			return RedirectToAction("Index", rc);
		}

		// Checks REST PKI access token
		public ActionResult CheckRestPkiToken(string rc, string upload = "", string cosign = "") {
			var accessToken = ConfigurationManager.AppSettings["RestPkiAccessToken"];
			if (string.IsNullOrEmpty(accessToken) || accessToken.Contains(" API ")) {
				return View("RestPkiTokenNotSet");
			}
			if (!string.IsNullOrEmpty(upload)) {
				return RedirectToAction("Index", rc, new { rc = upload });
			}
			if (!string.IsNullOrEmpty(cosign)) {
				return RedirectToAction("Index", rc, new { cosignRC = cosign });
			}
			return RedirectToAction("Index", rc);
		}

		public ActionResult InvalidOption(string op) {
			return View(op);
		}

	}
}