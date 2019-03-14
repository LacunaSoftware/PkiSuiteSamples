using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {

	/**
	 * The Basic RSA sample has frontend code only. See file RSA/Index.cshtml
	 */
	public class RSAWebController : BaseController {

		public ActionResult Index() {
			return View();
		}
	}
}