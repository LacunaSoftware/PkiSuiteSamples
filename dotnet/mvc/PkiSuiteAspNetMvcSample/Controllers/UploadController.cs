using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {

	/**
	 * This controller allows the user to upload a file to be signed. Once the file is
	 * uploaded, we save it to the App_Data folder and redirect the user to Index action on either
	 * CadesController or PadesController passing the filename on the "userfile" URL argument.
	 */
	public class UploadController : BaseController {

		[HttpGet]
		public ActionResult Index(string rc = "") {

			if (string.IsNullOrEmpty(rc)) {
				return RedirectToAction("Index", "Home");
			}

			return View(new RedirectModel() {
				ReturnController = rc
			});
		}

		[HttpPost]
		public ActionResult Index(RedirectModel model) {

			// Check that a file was indeed uploaded.
			var file = Request.Files.Get("userfile");
			if (file == null || string.IsNullOrEmpty(file.FileName)) {
				throw new Exception("No files uploaded");
			}
			var extension = new FileInfo(file.FileName).Extension;

			// Save the file to the App_Data folder with the unique filename.
			var fileId = StorageMock.Store(file.InputStream, extension);

			// Redirect the user to the ReturnController, passing the name of the file as a URL argument.
			return RedirectToAction("Index", model.ReturnController, new { userfile = fileId });
		}
	}

}