using PkiSuiteAspNetMvcSample.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {

	public class ServerFilesController : Controller {

		// GET: ServerFiles
		[HttpGet]
		public ActionResult Index(string rc = "") {

			if (string.IsNullOrEmpty(rc)) {
				return RedirectToAction("Index", "Home");
			}

			// It is up to your application's business logic to determine which server documents to be available
			// for the signature.
			var model = new ServerFilesModel() { 
				ReturnController = rc,
				AvailableFiles = Enumerable.Range(1, 10) // From 1 to 10.
		};

			return View(model);
		}
	}
}