using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetSpaSample.Classes;


namespace PkiSuiteAspNetSpaSample.Controllers {
	[Route("api/[controller]")]
	[ApiController]
	public class ServerFilesController : ControllerBase {
		private readonly StorageMock _storageMock;

		public ServerFilesController(StorageMock storageMock)
		{
			_storageMock = storageMock;
		}

		// GET: ServerFiles
		[HttpGet("{id}")]
		public string Upload(string id)
		{
			// Copy file to the App_Data folder, where the upload files is stored.
			return _storageMock.CopySampleToAppData(int.Parse(id).ToEnum<SampleDocs>());
		}
	}
}