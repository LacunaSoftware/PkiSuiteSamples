using PkiSuiteAspNetMvcSample.Models.WebPki;
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
	public class RSAWebPkiController : BaseController {

		public ActionResult Index() {
			return View();
		}

		[HttpPost]
		public ActionResult Validate(ValidationRequest request) {

			var data = Encoding.UTF8.GetBytes(request.OriginalMessage);

			byte[] hash;
			using (var sha256 = SHA256.Create()) {
				hash = sha256.ComputeHash(data);
			}

			var cert = new X509Certificate2(request.Certificate);
			var csp = (RSACryptoServiceProvider)cert.PublicKey.Key;
			var result = csp.VerifyHash(hash, "SHA256", request.SignedMessage);

			return Json(result);
		}
	}
}