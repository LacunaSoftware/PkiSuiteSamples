using System.Xml;
using Lacuna.Pki;
using Lacuna.Pki.Xml;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// XML signature with PKI SDK: signs a whole XML document (an enveloped XAdES signature) with the
/// user's certificate, through Web PKI.
/// </summary>
/// <remarks>
/// The signature takes two steps, with the browser in between:
/// 1. start: the browser sends the user's certificate; the server returns the hash to be signed
///    with the certificate's private key (the "to-sign hash");
/// 2. the browser signs the hash with Web PKI (signHash), so the private key never leaves the
///    user's computer;
/// 3. complete: the browser sends the signature value; the server finishes the signed XML.
/// </remarks>
[ApiController]
[Route("api/xml-signature-pki-sdk")]
public class XmlSignaturePkiSdkController(StorageMock storageMock, Util util) : ControllerBase {

	// The sample document (Content/SampleDocument.xml) has an element where the signature must be
	// inserted. Other documents get the signature appended to their root element.
	private const string SampleNamespace = "http://www.lacunasoftware.com/sample";
	private const string SignaturePlaceholderXPath = "//ls:signaturePlaceholder";

	// POST api/xml-signature-pki-sdk/start
	[HttpPost("start")]
	public ActionResult<XmlSignaturePkiSdkStartResponse> Start(XmlSignaturePkiSdkStartRequest request) {
		if (!storageMock.TryGetFile(request.FileId, out var path)) {
			return Problem(detail: "File not found", statusCode: StatusCodes.Status404NotFound);
		}
		var xml = System.IO.File.ReadAllBytes(path);

		byte[] toSignHash, transferData;
		SignatureAlgorithm signatureAlg;
		try {
			// Look for the sample document's signature placeholder (this also rejects files that
			// are not XML).
			var hasSignaturePlaceholder = HasSignaturePlaceholder(xml);

			// Instantiate a FullXmlSigner, which signs the whole XML document.
			var signer = new FullXmlSigner();

			// Set the XML to be signed.
			signer.SetXml(xml);

			// Decode the user's certificate and set it as the signer's certificate.
			signer.SetSigningCertificate(PKCertificate.Decode(request.CertContent));

			// Set the signature policy.
			signer.SetPolicy(GetSignaturePolicy());

			// Set where to insert the signature element. If no location is set, the signature is
			// appended to the root element, which is the usual place for enveloped signatures.
			if (hasSignaturePlaceholder) {
				var nsm = new NamespaceManager();
				nsm.AddNamespace("ls", SampleNamespace);
				signer.SetSignatureElementLocation(SignaturePlaceholderXPath, nsm, XmlInsertionOptions.AppendChild);
			}

			// Generate the to-sign hash. This method also returns the signature algorithm, which
			// the browser must use (its digest algorithm goes to Web PKI), and the "transfer data",
			// which the complete step needs.
			toSignHash = signer.GenerateToSignHash(out signatureAlg, out transferData);

		} catch (ValidationException ex) {
			// The operations above throw a ValidationException if, for instance, the certificate is
			// expired or not trusted.
			return Problem(detail: $"The certificate is not valid: {ex.ValidationResults}", statusCode: StatusCodes.Status422UnprocessableEntity);
		} catch (XmlException ex) {
			// An uploaded file that is not XML.
			return Problem(detail: $"The file is not a valid XML document: {ex.Message}", statusCode: StatusCodes.Status422UnprocessableEntity);
		}

		return new XmlSignaturePkiSdkStartResponse(
			// The transfer data stays on the server; only its id goes to the browser. In a real
			// application, store it in your database or cache, tied to the user's session.
			TransferDataId: storageMock.StoreTransferData(transferData),
			// GenerateToSignHash() already returns a hash: send it to the browser as is.
			ToSignHash: toSignHash,
			DigestAlgorithmOid: signatureAlg.DigestAlgorithm.Oid
		);
	}

	// POST api/xml-signature-pki-sdk/complete
	[HttpPost("complete")]
	public ActionResult<XmlSignaturePkiSdkCompleteResponse> Complete(XmlSignaturePkiSdkCompleteRequest request) {
		// The complete step must use the same document as the start step.
		if (!storageMock.TryGetFile(request.FileId, out var path)) {
			return Problem(detail: "File not found", statusCode: StatusCodes.Status404NotFound);
		}

		byte[] transferData;
		try {
			// Read back the transfer data stored by the start step. It can be used only once.
			transferData = storageMock.ReadTransferData(request.TransferDataId);
		} catch (FileNotFoundException) {
			return Problem(detail: "The signature was not started or was already completed. Please sign again.", statusCode: StatusCodes.Status422UnprocessableEntity);
		}

		byte[] signedXml;
		try {
			var signer = new FullXmlSigner();

			// Set the XML and the policy, exactly as in the start step.
			signer.SetXml(System.IO.File.ReadAllBytes(path));
			signer.SetPolicy(GetSignaturePolicy());

			// Set the signature value computed by Web PKI, along with the transfer data.
			signer.SetPrecomputedSignature(request.Signature, transferData);

			// Finish the signature. This also validates the signer's certificate and the resulting
			// signature.
			signer.ComputeSignature();

			signedXml = signer.GetSignedXml();

		} catch (ValidationException ex) {
			return Problem(detail: $"The signature is not valid: {ex.ValidationResults}", statusCode: StatusCodes.Status422UnprocessableEntity);
		}

		// Store the signed XML. In a real application, you'd store it in your database or blob
		// storage.
		return new XmlSignaturePkiSdkCompleteResponse(SignedFileId: storageMock.Store(signedXml, ".xml"));
	}

	/// <summary>
	/// The signature policy: an XAdES basic signature, which trusts the roots chosen by
	/// Util.GetTrustArbitrator() (ICP-Brasil, plus Lacuna's test PKI in Development).
	/// </summary>
	private XmlPolicySpec GetSignaturePolicy() {
		return XmlPolicySpec.GetXadesBasic(util.GetTrustArbitrator());
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
public record XmlSignaturePkiSdkStartRequest(string FileId, byte[] CertContent);

/// <param name="TransferDataId">The id of the transfer data, which the complete step needs.</param>
/// <param name="ToSignHash">The hash for Web PKI's signHash() to sign.</param>
/// <param name="DigestAlgorithmOid">The digest algorithm for Web PKI's signHash().</param>
public record XmlSignaturePkiSdkStartResponse(string TransferDataId, byte[] ToSignHash, string DigestAlgorithmOid);

/// <param name="FileId">The same document as in the start step.</param>
/// <param name="TransferDataId">Returned by the start step.</param>
/// <param name="Signature">The signature value returned by Web PKI's signHash().</param>
public record XmlSignaturePkiSdkCompleteRequest(string FileId, string TransferDataId, byte[] Signature);

public record XmlSignaturePkiSdkCompleteResponse(string SignedFileId);
