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
		public ActionResult CheckPkiLicense(string rc, string uploadCtrl = "") {
			if (!System.IO.File.Exists(Util.PkiLicensePath)) {
				return View("PkiLicenseNotFound");
			}
			if (!string.IsNullOrEmpty(uploadCtrl)) {
				return RedirectToAction("Index", rc, new { rc = uploadCtrl });
			}
			return RedirectToAction("Index", rc);
		}

		// Checks REST PKI access token
		public ActionResult CheckRestPkiToken(string rc, string uploadCtrl = "") {
			var accessToken = ConfigurationManager.AppSettings["RestPkiAccessToken"];
			if (string.IsNullOrEmpty(accessToken) || accessToken.Contains(" API ")) {
				return View("RestPkiTokenNotSet");
			}
			if (string.IsNullOrEmpty(uploadCtrl)) {
				return RedirectToAction("Index", rc, new { rc = uploadCtrl });
			}
			return RedirectToAction("Index", rc);
		}

		public ActionResult InvalidOption(string op) {
			return View(op);
		}

	}
}