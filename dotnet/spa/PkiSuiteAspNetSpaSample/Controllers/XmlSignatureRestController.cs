using Lacuna.RestPki.Api;
using Lacuna.RestPki.Api.XmlSignature;
using Lacuna.RestPki.Client;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetSpaSample.Classes;
using PkiSuiteAspNetSpaSample.Models.Rest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Controllers {
	[Route("api/[controller]/[action]")]
	[ApiController]
	public class XmlSignatureRestController : ControllerBase {
		private readonly StorageMock _storageMock;
		private readonly Util _util;

		public XmlSignatureRestController(StorageMock storageMock, Util util)
		{
			_storageMock = storageMock;
			_util = util;
		}

		/**
		 * GET: XmlSignatureRest
		 * 
		 * This action is called once the user's certificate encoding has been read, and contains the
		 * logic to prepare the hash that needs to be actually signed with the user's private key
		 * (the "to-sign-hash").
		 */
		[HttpGet]
		public async Task<Models.Rest.SignatureStartResponse> StartAsync()
		{

			// Instantiate the FullXmlSignatureStarter class, responsible for starting the signature process.
			var signatureStarter = new FullXmlSignatureStarter(_util.GetRestPkiClient());

			// Set the XML to be signed, a sample XML Document.
			signatureStarter.SetXml(_storageMock.GetSampleXmlDocumentPath());

			// Set the signature policy.
			signatureStarter.SetSignaturePolicy(StandardXmlSignaturePolicies.XadesBes);

			// Set the security context to be used to determine trust in the certificate chain. We have
			// encapsulated the security context choice on Util.cs.
			signatureStarter.SetSecurityContext(Util.GetSecurityContextId());

			// Set the location on which to insert the signature node. If the location is not specified, the
			// signature will appended to the root element (which is most usual with enveloped signatures).
			var nsm = new NamespaceManager();
			nsm.AddNamespace("ls", "http://www.lacunasoftware.com/sample");
			signatureStarter.SetSignatureElementLocation("//ls:signaturePlaceholder", XmlInsertionOptions.AppendChild, nsm);

			// Call the StartWithWebPki() method, which initiates the signature. This yields the token,
			// a 43-character case-sensitive URL-safe string, which identifies this signature process. We'll
			// use this value to call the signWithRestPki() method on the Web PKI component (see 
			// signature-form.js) and also to complete the signature on the POST action below (this should
			// not be mistaken with the API access token).
			var token = await signatureStarter.StartWithWebPkiAsync();
			return new Models.Rest.SignatureStartResponse()
			{
				Token = token
			};
		}

		/**
		 * POST: XmlSignatureRest/Complete
		 * 
		 * This action is called once the "to-sign-hash" are signed using the user's 
		 * certificate. After signature, it'll return the signature file.
		 */
		[HttpPost]
		public async Task<Models.Rest.SignatureCompleteResponse> CompleteAsync(SignatureCompleteRequest request)
		{
			// Get an instance of the XmlSignatureFinisher class, responsible for completing the signature
			// process.
			var signatureFinisher = new XmlSignatureFinisher(_util.GetRestPkiClient())
			{
				// Set the token for this signature (rendered in a hidden input field, see the view).
				Token = request.Token
			};

			// Call the Finish() method, which finalizes the signature process and returns the signed PDF.
			var signedXml = await signatureFinisher.FinishAsync();

			// Optional - Get information about the signer's certificate used.
			// This method must only be called after calling the Finish() method.
			//var signerCert = signatureFinisher.GetCertificateInfo();

			// At this point, you'd typically store the signed XML on your database. For demonstration
			// purposes, we'll store the PDF on our mock Storage class.
			var fileId = _storageMock.Store(signedXml, ".xml");

			return new Models.Rest.SignatureCompleteResponse()
			{
				SignedFileId = fileId,
			};
		}
	}
}
