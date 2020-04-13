using Lacuna.Pki.Cades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers
{
    public class MergeCadesSdkController : BaseController
    {
        // GET: MergeCadesSdk
        public ActionResult Index(string file1, string file2, string datafile = null)
        {
			// Verify if the files exist and get the content of both.
			if (!StorageMock.TryGetFile(file1, out byte[] file1Content) ||
				!StorageMock.TryGetFile(file2, out byte[] file2Content))
			{
				return HttpNotFound();
			}

			// Create list with all CAdES files to be merged
			var signatures = new List<CadesSignature>
			{
				CadesSignature.Open(file1Content),
				CadesSignature.Open(file2Content)
			};

			byte[] mergedSignature;
			// If both files have encapsulated content, no datafile is required
			if (string.IsNullOrEmpty(datafile))
			{
				mergedSignature = CadesSignatureEditor.MergeSignatures(signatures);
			}
			else
			{
				// Verify if the datafile exist and retrive it's content
				if (!StorageMock.TryGetFile(datafile, out byte[] dataFileContent))
				{
					return HttpNotFound();
				}
				// Datafile content is required when at least one of the signatures is a CAdES signature without encapsulated content
				mergedSignature = CadesSignatureEditor.MergeSignatures(signatures, dataFileContent);

				// Attaches the data file content if missing
				var editor = CadesSignatureEditor.Open(mergedSignature);
				if (!editor.Signature.HasEncapsulatedContent)
				{
					editor.AddEncapsulatedContent(dataFileContent);
				}
			}
			
            return View(new SignatureInfoModel()
			{
				// Store the signature file on the folder "App_Data/" and redirects to the SignatureInfo action with the filename.
				// With this filename, it can show a link to download the signature file.
				File = StorageMock.Store(mergedSignature, ".p7s")
			});
        }
    }
}