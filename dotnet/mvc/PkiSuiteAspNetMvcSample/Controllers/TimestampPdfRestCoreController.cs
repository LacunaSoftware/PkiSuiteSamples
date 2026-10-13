using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {

	/**
	 * This controller adds a document timestamp to the uploaded PDF using REST PKI Core and renders
	 * a page with a link to download the timestamped PDF. It is a server-only operation: no
	 * signature is made and Web PKI is not involved. The user reaches it after uploading a PDF on
	 * the upload page, which redirects here passing the file's id on the "userfile" URL argument.
	 */
	public class TimestampPdfRestCoreController : BaseController {

		public async Task<ActionResult> Index(string userfile) {
			var restPkiService = Util.GetRestPkiService();

			// Get reference for the file to be timestamped
			if (!StorageMock.TryGetFile(userfile, out string userfilePath)) {
				return HttpNotFound();
			}
			var fileReference = FileReference.FromFile(userfilePath, userfile);

			var options = new StampPdfOptions() {
				// The timestamp tier determines which timestamp authority issues the timestamp. Here
				// we use the Lacuna Test tier, which the trial API keys can use (for development
				// purposes only!). In production, use StandardTimestampTiers.PkiBrazil (ICP-Brasil
				// timestamps) or your subscription's own tier, which needs an API key with access to
				// it. The API accepts a tier's ID or name.
				TimestampTier = StandardTimestampTiers.LacunaTest.ToString(),
				// Have REST PKI Core return the timestamped PDF as a link to download, rather than
				// inline. This client version (Lacuna.RestPkiCore.Client 3.5.0) cannot read an inline
				// result: its FileReference.OpenReadAsync() throws NotImplementedException.
				ForceBlobResult = true,
			};

			// Add the document timestamp in REST PKI Core
			var result = await restPkiService.StampPdfAsync(fileReference, options);

			// At this point, you'd typically store the timestamped PDF on your database. For
			// demonstration purposes, we'll store it with our StorageMock class.
			string stampedFilename;
			using (var docStream = await result.File.OpenReadAsync()) {
				stampedFilename = StorageMock.Store(docStream, ".pdf");
			}

			return View(new SignatureInfoModel() {
				File = stampedFilename,
			});
		}
	}
}
