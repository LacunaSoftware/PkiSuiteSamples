using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class MergeServerFilesController : Controller {
		// GET: MergeServerFiles
		public ActionResult Index(string rc = "") {
			var availableFiles = new MergeServerFileModel[] {
						new MergeServerFileModel() {
							File1 = SampleDocs.CmsDetached1,
							File2 = SampleDocs.CmsDetached2,
							Description = "A sample where both CMS don't have encapsulated content."
						},
						new MergeServerFileModel() {
							File1 = SampleDocs.CmsAttached1,
							File2 = SampleDocs.CmsDetached2,
							Description = "A sample where a CMS has encapsulated content and another doesn't."
						},
						new MergeServerFileModel() {
							File1 = SampleDocs.CmsAttached1,
							File2 = SampleDocs.CmsAttached2,
							Description = "A sample where both CMS have encapsulated content."
						}
					};

			// It is up to your application's business logic to determine which server documents to be available
			// for the signature.
			var model = new MergeServerFilesModel() {
				ReturnController = rc,
				AvailableFiles = availableFiles,
				DataFile = SampleDocs.CmsDataFile
			};

			return View(model);
		}

		// POST: ServerFiles
		[HttpPost]
		public ActionResult Index(MergeServerFilesModel model) {
			string dataFileId, fileId1, fileId2;
			switch (model.ChosenCombination) {
				case 0:
					dataFileId = StorageMock.CopySampleToAppData(SampleDocs.CmsDataFile);
					fileId1 = StorageMock.CopySampleToAppData(SampleDocs.CmsDetached1);
					fileId2 = StorageMock.CopySampleToAppData(SampleDocs.CmsDetached2);
					return RedirectToAction("Index", model.ReturnController, new { file1 = fileId1, file2 = fileId2, datafile = dataFileId });
				case 1:
					dataFileId = StorageMock.CopySampleToAppData(SampleDocs.CmsDataFile);
					fileId1 = StorageMock.CopySampleToAppData(SampleDocs.CmsAttached1);
					fileId2 = StorageMock.CopySampleToAppData(SampleDocs.CmsDetached2);
					return RedirectToAction("Index", model.ReturnController, new { file1 = fileId1, file2 = fileId2, datafile = dataFileId });
				case 2:
				default:
					fileId1 = StorageMock.CopySampleToAppData(SampleDocs.CmsAttached1);
					fileId2 = StorageMock.CopySampleToAppData(SampleDocs.CmsAttached2);
					return RedirectToAction("Index", model.ReturnController, new { file1 = fileId1, file2 = fileId2 });
			}
		}
	}
}