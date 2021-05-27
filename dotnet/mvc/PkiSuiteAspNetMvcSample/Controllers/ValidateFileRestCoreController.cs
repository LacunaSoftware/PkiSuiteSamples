using Lacuna.RestPki.Api.Documents;
using PkiSuiteAspNetMvcSample.Models.Rest;
using System;
using System.Linq;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {

	public class ValidateFileRestCoreController : BaseController
    {

		[HttpPost]
		public ActionResult Index(ValidateFileRequest request)
		{
			// List invalid file names.
			string[] badNames = {"P111111.pdf", "P222222.pdf", "P333333.pdf",
			 "P444444.pdf", "P555555.pdf", "P666666.pdf",
			 "P777777.pdf", "P888888.pdf", "P999999.pdf" };

			ValidateFileResponse validation;
			// Validate file.
			if (request.Length < 5)
			{
				validation = new ValidateFileResponse { Accept = false, RejectReason = "The file is too small." };
			} else if (request.ContentType != "application/pdf")
			{
				validation = new ValidateFileResponse { Accept = false, RejectReason = "The file is not a PDF." };
			} else if (badNames.Contains(request.Name))
			{
				validation = new ValidateFileResponse { Accept = false, RejectReason = "The file name is invalid." };
			} else
			{
				validation = new ValidateFileResponse { Accept = true };
			}

			return Json(validation);
		}
	}
}