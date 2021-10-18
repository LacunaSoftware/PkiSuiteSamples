using Lacuna.RestPki.Api;
using Lacuna.RestPki.Api.SignatureSessions;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class SignatureSessionPreDefRestCoreController : Controller
    {
		#region Simple Flow

		// https://docs.lacunasoftware.com/articles/rest-pki/core/integration/signature-sessions/
		[HttpGet]
		public async Task<ActionResult> Index()
		{
			var restPkiService = Util.GetRestPkiService();

			var docs = new List<SignatureSessionDocumentToSign>();

			for (int i = 0; i < 10; i++)
			{
				SignatureSessionDocumentToSign doc = new SignatureSessionDocumentToSign();
				doc.File = FileReference.FromFile(StorageMock.GetBatchDocPath(i));
				doc.SignatureType = SignatureTypes.Pdf;
				docs.Add(doc);
			}

			var response = await restPkiService.CreateSignatureSessionAsync(new CreateSignatureSessionRequest()
			{
				ReturnUrl = "http://localhost:54123/SignatureSessionPreDefRestCore/Callback",
				DisableDownloads = true,
			}, documents: docs);

			return View(response);
		}

		// GET: SignatureSessionPreDefRestCore/Callback
		[HttpGet]
		public async Task<ActionResult> Callback(Guid signatureSessionId)
		{
			var restPkiService = Util.GetRestPkiService();
			var session = await restPkiService.GetSignatureSessionAsync(signatureSessionId);
			if (session.Status != SignatureSessionStatus.Completed)
			{
				return Redirect("/");
			}
			return View(session);
		}

		#endregion
	}
}