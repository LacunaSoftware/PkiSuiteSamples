using Lacuna.Pki;
using Lacuna.Pki.Pades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class BatchPadesSignatureSdkController : BaseController {

		// GET: BatchSignature
		public ActionResult Index() {
			// It is up to your application's business logic to determine which documents will compose the batch
			var model = new BatchSignatureModel() {
				DocumentIds = Enumerable.Range(1, 30).ToList() // from 1 to 30
			};
			// Render the batch signature page
			return View(model);
		}
	}
}