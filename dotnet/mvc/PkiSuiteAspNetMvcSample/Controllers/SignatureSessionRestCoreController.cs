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
    public class SignatureSessionRestCoreController : Controller
    {
		#region Simple Flow

		// https://docs.lacunasoftware.com/articles/rest-pki/core/integration/signature-sessions/
		[HttpGet]
		public async Task<ActionResult> Index()
		{
			var restPkiService = Util.GetRestPkiService();
			var response = await restPkiService.CreateSignatureSessionAsync(new CreateSignatureSessionRequest()
			{
				ReturnUrl = "http://localhost:54123/SignatureSessionRestCore/Callback",
				// If the user must come back to your site before downloading the signed file,
				// uncomment the line below.
				//DisableDownloads = true,
			});

			return View(response);
		}

		// GET: SignatureSessionRestCore/Callback
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

		#region Webhook flow

		// https://docs.lacunasoftware.com/articles/rest-pki/core/integration/signature-sessions/index#webhook-flow

		[HttpGet]
		public async Task<ActionResult> UsingWebhook()
		{
			var restPkiService = Util.GetRestPkiService();
			var response = await restPkiService.CreateSignatureSessionAsync(new CreateSignatureSessionRequest()
			{
				ReturnUrl = null, // Keep null
				EnableBackgroundProcessing = true,
			});

			return View(response);
		}

		// It doesn't have callback, the files will be given via webhook (see WebhookController)

		#endregion
	}
}