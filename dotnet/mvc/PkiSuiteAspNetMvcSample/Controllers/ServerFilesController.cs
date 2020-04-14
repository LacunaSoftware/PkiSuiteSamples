using PkiSuiteAspNetMvcSample.Classes;
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
		public ActionResult Index(string rc = "", string operation = "") {

			if (string.IsNullOrEmpty(rc)) {
				return RedirectToAction("Index", "Home");
			}

			ServerFileModel[] availableFiles;
			bool isCmsCoSign = false;
			switch (operation) {
				case "cosignCms":
					isCmsCoSign = true;
					goto case "printerFriendlyCades";
				case "printerFriendlyCades":
					availableFiles = new ServerFileModel[] {
						new ServerFileModel() { Id = SampleDocs.CmsSignedOnce, Description = "A sample CMS file that was signed once." },
						new ServerFileModel() { Id = SampleDocs.CmsSignedTwice, Description = "A sample CMS file that was signed twice." }
					};
					break;
				case "cosignPdf":
				case "printerFriendlyPdf":
					availableFiles = new ServerFileModel[] {
						new ServerFileModel() { Id = SampleDocs.PdfSignedOnce, Description = "A sample PDF that was signed just once." },
						new ServerFileModel() { Id = SampleDocs.PdfSignedTwice, Description = "A sample PDF that was signed twice." }
					};
					break;
				case "signCms":
				case "signPdf":
					availableFiles = new ServerFileModel[] {
						new ServerFileModel() { Id = SampleDocs.SamplePdf, Description = "A sample PDF file to be signed." },
					};
					break;
				default:
					throw new InvalidOperationException();
			}

			// It is up to your application's business logic to determine which server documents to be available
			// for the signature.
			var model = new ServerFilesModel() { 
				ReturnController = rc,
				IsCmsCoSign = isCmsCoSign,
				AvailableFiles = availableFiles,
			};

			return View(model);
		}

		// POST: ServerFiles
		[HttpPost]
		public ActionResult Index(ServerFilesModel model) {
			
			// Copy file to the App_Data folder, where the upload files is stored.
			var fileId = StorageMock.CopySampleToAppData(model.ChosenFileId);

			if (model.IsCmsCoSign) {
				return RedirectToAction("Index", model.ReturnController, new { cmsfile = fileId });
			}

			return RedirectToAction("Index", model.ReturnController, new { userfile = fileId });
		}
	}
}