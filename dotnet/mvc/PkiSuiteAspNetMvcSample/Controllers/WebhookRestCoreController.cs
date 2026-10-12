using Lacuna.RestPki.Api;
using Lacuna.RestPki.Api.Documents;
using Lacuna.RestPki.Api.Webhooks;
using PkiSuiteAspNetMvcSample.Classes;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class WebhookRestCoreController : BaseController
	{
		// https://docs.lacunasoftware.com/articles/rest-pki/core/integration/webhooks
		[HttpPost]
		public async Task<ActionResult> Index(WebhookEventModel eventModel)
		{

			switch (eventModel.Type)
			{
				case WebhookEventTypes.DocumentSignatureCompleted:
					await OnDocumentSignatureCompletedAsync(eventModel.Document);
					break;
			}

			return new HttpStatusCodeResult(HttpStatusCode.OK);
		}

		private async Task OnDocumentSignatureCompletedAsync(DocumentModel model)
		{
			var restPkiService = Util.GetRestPkiService();
			var apiDocument = await restPkiService.GetDocumentAsync(model);
			// SignedFile.Url is a temporary link that downloads the signed file without the API key.
			var content = await restPkiService.GetContentAsync(apiDocument.SignedFile.Url);
			StorageMock.Store(content, "", apiDocument.SignedFile.Name);
		}
	}
}