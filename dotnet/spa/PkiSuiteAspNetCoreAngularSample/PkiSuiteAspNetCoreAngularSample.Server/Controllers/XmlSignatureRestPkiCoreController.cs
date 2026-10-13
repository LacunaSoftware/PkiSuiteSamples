using System.Xml;
using Lacuna.RestPki.Api;
using Lacuna.RestPki.Api.Signature;
using Lacuna.RestPki.Api.XmlSignature;
using Lacuna.RestPki.Client;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// XML signature with Rest PKI Core: signs a whole XML document (an enveloped XAdES signature)
/// with the user's certificate, through Web PKI.
/// </summary>
/// <remarks>
/// The signature takes two steps, with the browser in between:
/// 1. start: the browser sends the user's certificate; the server asks Rest PKI Core to prepare
///    the signature, and returns the hash to be signed with the certificate's private key (the
///    "to-sign hash") and the signature "state";
/// 2. the browser signs the hash with Web PKI (signHash), so the private key never leaves the
///    user's computer;
/// 3. complete: the browser sends the signature value and the state back; the server asks Rest
///    PKI Core to finish the signed XML.
///
/// XML signatures need Lacuna.RestPkiCore.Client 5.x: earlier versions have no XmlSignatureOptions.
/// </remarks>
[ApiController]
[Route("api/xml-signature-rest-pki-core")]
public class XmlSignatureRestPkiCoreController(StorageMock storageMock, Util util) : ControllerBase {

	// The sample document (Content/SampleDocument.xml) has an element where the signature must be
	// inserted. Other documents get the signature appended to their root element.
	private const string SampleNamespace = "http://www.lacunasoftware.com/sample";
	private const string SignaturePlaceholderXPath = "//ls:signaturePlaceholder";

	// POST api/xml-signature-rest-pki-core/start
	[HttpPost("start")]
	public async Task<ActionResult<XmlSignatureRestPkiCoreStartResponse>> Start(XmlSignatureRestPkiCoreStartRequest request) {
		if (!util.IsRestPkiCoreConfigured) {
			return Problem(detail: Util.RestPkiCoreNotConfiguredMessage, statusCode: StatusCodes.Status503ServiceUnavailable);
		}

		if (!storageMock.TryGetFile(request.FileId, out var path)) {
			return Problem(detail: "The file to be signed was not found.", statusCode: StatusCodes.Status404NotFound);
		}
		var xml = await System.IO.File.ReadAllBytesAsync(path);

		var xmlSignatureOptions = new XmlSignatureOptions {
			// Sign the whole XML document. To sign a single element, use XmlSignatureTypes.XmlElement
			// and set ElementToSignId.
			Type = XmlSignatureTypes.FullXml,
		};
		try {
			// Set where to insert the signature element. If no location is set, the signature is
			// appended to the root element, which is the usual place for enveloped signatures.
			if (HasSignaturePlaceholder(xml)) {
				xmlSignatureOptions.SignatureElementLocation = new XmlElementLocationModel {
					XPath = SignaturePlaceholderXPath,
					Namespaces = [new NamespaceModel { Prefix = "ls", Uri = SampleNamespace }],
					InsertionOption = XmlInsertionOptions.AppendChild,
				};
			}
		} catch (XmlException ex) {
			// An uploaded file that is not XML.
			return Problem(detail: $"The file is not a valid XML document: {ex.Message}", statusCode: StatusCodes.Status422UnprocessableEntity);
		}

		PrepareSignatureResult result;
		try {
			// Ask Rest PKI Core to prepare the signature of the document with the user's
			// certificate (read with Web PKI's readCertificate()).
			result = await util.GetRestPkiService().PrepareSignatureAsync(
				FileReference.FromBytes(xml, Path.GetFileName(path), "application/xml"),
				CertificateReference.FromBytes(request.CertContent),
				new PrepareSignatureOptions {
					SignatureType = SignatureTypes.Xml,
					XmlSignatureOptions = xmlSignatureOptions,
					// The security context decides which certificates are trusted: ICP-Brasil, plus
					// Lacuna's test PKI in Development (see Util.GetSecurityContextId()).
					SecurityContextId = util.GetSecurityContextId(),
				}
			);
		} catch (PrepareSignatureException ex) {
			// Rest PKI Core refused to prepare the signature, for instance because the certificate is
			// expired or not trusted.
			return Problem(
				detail: $"The signature could not be prepared ({ex.Failure}).",
				statusCode: StatusCodes.Status422UnprocessableEntity,
				// The validation results, when there are any, tell why. The page shows them below the
				// message.
				extensions: new Dictionary<string, object?> { ["validationResults"] = ex.ValidationResults?.ToString() }
			);
		}

		return new XmlSignatureRestPkiCoreStartResponse(
			ToSignHash: result.ToSign.Hash,
			DigestAlgorithmOid: result.ToSign.SignatureAlgorithm.DigestAlgorithm.Oid,
			// The state goes to the browser, which sends it back on the complete step.
			State: result.State
		);
	}

	// POST api/xml-signature-rest-pki-core/complete
	[HttpPost("complete")]
	public async Task<ActionResult<XmlSignatureRestPkiCoreCompleteResponse>> Complete(XmlSignatureRestPkiCoreCompleteRequest request) {
		if (!util.IsRestPkiCoreConfigured) {
			return Problem(detail: Util.RestPkiCoreNotConfiguredMessage, statusCode: StatusCodes.Status503ServiceUnavailable);
		}

		Document document;
		try {
			// Ask Rest PKI Core to finish the signature with the state from the start step and the
			// signature value computed by Web PKI. This also validates the signature.
			document = await util.GetRestPkiService().CompleteSignatureAsync(request.State, request.Signature);
		} catch (ValidationException ex) {
			return Problem(
				detail: "The signature is not valid.",
				statusCode: StatusCodes.Status422UnprocessableEntity,
				extensions: new Dictionary<string, object?> { ["validationResults"] = ex.ValidationResults.ToString() }
			);
		}

		// Download the signed XML from Rest PKI Core (the link it returns expires) and store it. In a
		// real application, you'd store it in your database or blob storage.
		await using var signedFile = await document.SignedFile.OpenReadAsync();
		return new XmlSignatureRestPkiCoreCompleteResponse(SignedFileId: storageMock.Store(signedFile, ".xml"));
	}

	/// <summary>
	/// Whether the document has the signature placeholder of the sample document.
	/// </summary>
	private static bool HasSignaturePlaceholder(byte[] xml) {
		var document = new XmlDocument();
		using (var stream = new MemoryStream(xml)) {
			document.Load(stream);
		}
		var namespaces = new XmlNamespaceManager(document.NameTable);
		namespaces.AddNamespace("ls", SampleNamespace);
		return document.SelectSingleNode(SignaturePlaceholderXPath, namespaces) != null;
	}
}

// byte[] properties travel as Base64 strings in JSON, as Web PKI expects.

/// <param name="FileId">The document to sign (see FilesController).</param>
/// <param name="CertContent">The user's certificate, read with Web PKI's readCertificate().</param>
public record XmlSignatureRestPkiCoreStartRequest(string FileId, byte[] CertContent);

/// <param name="ToSignHash">The hash for Web PKI's signHash() to sign.</param>
/// <param name="DigestAlgorithmOid">The digest algorithm for Web PKI's signHash().</param>
/// <param name="State">The signature state, to send back on the complete step.</param>
public record XmlSignatureRestPkiCoreStartResponse(byte[] ToSignHash, string DigestAlgorithmOid, string State);

/// <param name="State">Returned by the start step.</param>
/// <param name="Signature">The signature value returned by Web PKI's signHash().</param>
public record XmlSignatureRestPkiCoreCompleteRequest(string State, byte[] Signature);

public record XmlSignatureRestPkiCoreCompleteResponse(string SignedFileId);
