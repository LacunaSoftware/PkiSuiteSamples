using Lacuna.Pki.Xml;
using PkiSuiteAspNetMvcSample.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class OpenXmlSignaturePkiController : BaseController {

		// GET: OpenXmlSignaturePki
		public ActionResult Index(string userfile) {

			byte[] content;
			string extension;
			if (!StorageMock.TryGetFile(userfile, out content, out extension)) {
				return HttpNotFound();
			}

			var xmlSignatureLocator = new XmlSignatureLocator(content);
			var signatures = xmlSignatureLocator.GetSignatures();
			return View(signatures);
		}
	}
}