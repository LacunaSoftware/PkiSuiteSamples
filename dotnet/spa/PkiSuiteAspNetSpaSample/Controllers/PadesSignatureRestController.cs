using Lacuna.RestPki.Api;
using Lacuna.RestPki.Api.PadesSignature;
using Lacuna.RestPki.Client;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetSpaSample.Classes;
using PkiSuiteAspNetSpaSample.Models.Rest;
using System;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Controllers {
	[Route("api/[controller]/[action]")]
	[ApiController]
	public class PadesSignatureRestController : ControllerBase {
		private readonly StorageMock _storageMock;
		private readonly Util _util;
		private readonly PadesVisualElements _padesVisualElements;

		public PadesSignatureRestController(StorageMock storageMock, Util util, PadesVisualElements padesVisualElements)
		{
			_storageMock = storageMock;
			_util = util;
			_padesVisualElements = padesVisualElements;
		}

		/**
		* POST: PadesSignature/Start
		*/
		[HttpPost]
		public async Task<Models.Rest.SignatureStartResponse> StartAsync([FromBody] Models.Rest.SignatureStartRequest request)
		{

			string token;

			try
			{
				// Verify if the userfile exists and get its absolute path.
				if (!_storageMock.TryGetFile(request.UserFile, out string userfilePath))
				{
					throw new Exception("Userfile not found");
				}

				// Get an instance of the PadesSignatureStarter class, responsible for receiving the signature
				// elements and start the signature process.
				var signatureStarter = new PadesSignatureStarter(_util.GetRestPkiClient())
				{

					// Set the unit of measurement used to edit the pdf marks and visual representations.
					MeasurementUnits = PadesMeasurementUnits.Centimeters,

					// Set the signature policy.
					SignaturePolicyId = StandardPadesSignaturePolicies.Basic,

					// Set the security context to be used to determine trust in the certificate chain. We have
					// encapsulated the security context choice on Util.cs.
					SecurityContextId = Util.GetSecurityContextId(),

					// Set a visual representation for the signature.
					VisualRepresentation = this._padesVisualElements.GetVisualRepresentationForRestPki()
				};

				// Set the file to be signed.
				signatureStarter.SetPdfToSign(userfilePath);

				/*
					Optionally, add marks to the PDF before signing. These differ from the signature visual
					representation in that they are actually changes done to the document prior to signing, not
					binded to any signature. Therefore, any number of marks can be added, for instance one per
					page, whereas there can only be one visual representation per signature. However, since the
					marks are in reality changes to the PDF, they can only be added to documents which have no
					previous signatures, otherwise such signatures would be made invalid by the changes to the
					document (see property PadesSignatureStarter.BypassMarksIfSigned). This problem does not
					occurr with signature visual representations.

					We have encapsulated this code in a method to include several possibilities depending on the
					argument passed. Experiment changing the argument to see different examples of PDF marks.
					Once you decide which is best for your case, you can place the code directly here.
				*/
				//signatureStarter.PdfMarks.Add(PadesVisualElements.GetPdfMark(1));

				// Call the StartWithWebPki() method, which initiates the signature. This yields the token, a
				// 43-character case-sensitive URL-safe string, which identifies this signature process. We'll
				// use this value to call the signWithRestPki() method on the Web PKI component (see 
				// signature-forms.js) and also to complete the signature on the POST action below (this should
				// not be mistaken with the API access token).
				token = await signatureStarter.StartWithWebPkiAsync();

			} catch (ValidationException ex)
			{
				// Some of the operations above may throw a ValidationException, for instance if the certificate
				// encoding cannot be read or if the certificate is expired.
				//ModelState.AddModelError("", ex.ValidationResults.ToString());
				return new Models.Rest.SignatureStartResponse()
				{
					Success = false,
					ValidationResults = ex.ValidationResults.ToModel()
				};
			}

			return new Models.Rest.SignatureStartResponse()
			{
				Token = token,
				UserFile = request.UserFile
			};
		}

		/**
		* POST: PadesSignature/Complete
		*/
		[HttpPost]
		public async Task<SignatureCompleteResponse> CompleteAsync([FromBody] SignatureCompleteRequest request)
		{
			string fileId;

			try
			{
				// Get an instance of the PadesSignatureFinisher2 class, responsible for completing the
				// signature process.
				var signatureFinisher = new PadesSignatureFinisher2(_util.GetRestPkiClient())
				{

					// Set the token for this signature. (rendered in a hidden input field, see the view)
					Token = request.Token

				};

				// Call the Finish() method, which finalizes the signature process and returns a
				// SignatureResult object.
				var result = await signatureFinisher.FinishAsync();

				// At this point, you'd typically store the signed PDF on your database. For demonstration
				// purposes, we'll store the PDF on our mock Storage class.
				// The SignatureResult object has various methods for writing the signature file to a stream
				// (WriteTo()), local file (WriteToFile()), open a stream to read the content (OpenRead()) and
				// get its contents (GetContent()). For large files, avoid the method GetContent() to avoid
				// memory allocation issues.
				using (var resultStream = result.OpenRead())
				{
					fileId = _storageMock.Store(resultStream, ".pdf");
				}

			} catch (ValidationException ex)
			{
				// Return userfile to continue the signature with the same file.
				return new SignatureCompleteResponse()
				{
					ValidationResults = ex.ValidationResults.ToModel(),
					Success = false
				};
			}

			return new SignatureCompleteResponse()
			{
				Success = true,
				// Store the signature file on the folder "App_Data/" and redirects to the SignatureInfo action with the filename.
				// With this filename, it can show a link to download the signature file.
				SignedFileId = fileId
			};
		}
	}
}