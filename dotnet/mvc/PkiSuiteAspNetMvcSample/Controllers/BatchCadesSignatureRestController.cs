using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Rest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {

	/**
	 * This controller contains the server-side logic for the batch of CAdES signatures example using
	 * REST PKI.
	 */
	public class BatchCadesSignatureRestController : BaseController {

		/**
		 * GET: BatchCadesSignature
		 * 
		 * This action renders the batch signature page.
		 *
		 * Notice that the only thing we'll do on the server-side at this point is determine the IDs of the
		 * documents to be signed. The page will handle each document one by one and will call the server
		 * asynchronously to start and complete each signature.
		 */
		public ActionResult Index() {
			// It is up to your application's business logic to determine which documents will compose the
			// batch.
			var model = new BatchSignatureModel() {
				DocumentIds = Enumerable.Range(1, 30).ToList() // From 1 to 30.
			};
			// Render the batch signature page.
			return View(model);
		}
	}
}