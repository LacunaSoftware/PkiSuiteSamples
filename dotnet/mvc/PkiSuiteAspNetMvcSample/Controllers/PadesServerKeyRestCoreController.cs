using Lacuna.RestPki.Client;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using CertificateReference = Lacuna.RestPki.Client.CertificateReference;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class PadesServerKeyRestCoreController : BaseController {

		public async Task<ActionResult> Index(string userfile) {
			string signedFilename;

			try {
				var restPkiService = Util.GetRestPkiService();

				// Read certificate and upload content to REST PKI Core
				var certificatePath = StorageMock.GetServerCertificatePath();
				var certificate = new X509Certificate2(certificatePath, "1234");
				var certificateReference = CertificateReference.FromX509Certificate2(certificate);

				// Get reference for the file to be signed
				if (!StorageMock.TryGetFile(userfile, out string userfilePath)) {
					return HttpNotFound();
				}
				var fileReference = FileReference.FromFile(userfilePath, userfile);

				// Prepare signature in REST PKI Core service and get signature parameters
				var signatureOptions = new PrepareSignatureOptions() { SecurityContextId = Util.GetSecurityContextId() };
				var prepareSignatureResult = await restPkiService.PrepareSignatureAsync(fileReference, certificateReference, signatureOptions);

				// Perform RSA signature using signature parameters and certificate reference
				var toSignHash = prepareSignatureResult.ToSignHash.Value;
				var signature = certificate.GetRSAPrivateKey().SignHash(toSignHash,prepareSignatureResult.ToSignHash.Algorithm.HashAlgorithmName, RSASignaturePadding.Pkcs1);

				// Complete signature in REST PKI Core service
				var signedDocument = await restPkiService.CompleteSignatureAsync(prepareSignatureResult.State, signature);

				// Store file
				using (var docStream = await signedDocument.SignedFile.OpenReadAsync()) {
					signedFilename = StorageMock.Store(docStream, ".pdf");
				}
					
			} catch (Exception ex) {
				ModelState.AddModelError("", ex.ToString());
				return View();
			}

			return View(new SignatureInfoModel() {
				File = signedFilename,
			});
		}
	}
}