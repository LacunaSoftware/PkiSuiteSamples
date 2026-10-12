using System.Text.Json;
using System.Xml;
using Lacuna.Pki;
using Lacuna.Pki.Xml;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// NF-e XML signature with PKI SDK: signs the infNFe element of a Brazilian electronic invoice
/// (NF-e) with the user's certificate, through Web PKI, following the NF-e signature standard.
/// </summary>
/// <remarks>
/// Rest PKI Core has no signature policy or ID-resolution options for NF-e, so this project shows
/// this task with PKI SDK only.
///
/// The signature takes two steps, with the browser in between:
/// 1. start: the browser sends the user's certificate; the server returns the hash to be signed
///    with the certificate's private key (the "to-sign hash");
/// 2. the browser signs the hash with Web PKI (signHash), so the private key never leaves the
///    user's computer;
/// 3. complete: the browser sends the signature value; the server finishes the signed NF-e.
/// </remarks>
[ApiController]
[Route("api/xml-nfe-signature-pki-sdk")]
public class XmlNfeSignaturePkiSdkController(StorageMock storageMock, Util util) : ControllerBase {

	private const string NfeNamespace = "http://www.portalfiscal.inf.br/nfe";

	// POST api/xml-nfe-signature-pki-sdk/start
	[HttpPost("start")]
	public ActionResult<XmlNfeSignaturePkiSdkStartResponse> Start(XmlNfeSignaturePkiSdkStartRequest request) {
		if (!storageMock.TryGetFile(request.FileId, out var path)) {
			return Problem(detail: "The file to be signed was not found.", statusCode: StatusCodes.Status404NotFound);
		}
		var nfe = System.IO.File.ReadAllBytes(path);

		byte[] toSignHash, transferData;
		SignatureAlgorithm signatureAlg;
		try {
			// The element to sign is the invoice's infNFe element, identified by its Id attribute
			// (such as "NFe35141214314050000662550010001084271182362300" in Content/SampleNFe.xml).
			var infNfeId = GetInfNfeId(nfe);
			if (infNfeId == null) {
				return Problem(detail: "The file is not an NF-e: it has no infNFe element with an Id attribute.", statusCode: StatusCodes.Status422UnprocessableEntity);
			}

			// Instantiate an XmlElementSigner, which signs one element of the XML document.
			var signer = new XmlElementSigner();

			// Set the XML to be signed and the element to sign.
			signer.SetXml(nfe);
			signer.SetToSignElementId(infNfeId);

			// Decode the user's certificate and set it as the signer's certificate.
			signer.SetSigningCertificate(PKCertificate.Decode(request.CertContent));

			// Set the signature policy.
			signer.SetPolicy(GetSignaturePolicy());

			// Generate the to-sign hash. This method also returns the signature algorithm, which
			// the browser must use (its digest algorithm goes to Web PKI), and the "transfer data",
			// which the complete step needs.
			toSignHash = signer.GenerateToSignHash(out signatureAlg, out transferData);

		} catch (ValidationException ex) {
			// The operations above throw a ValidationException if, for instance, the certificate is
			// expired or not trusted.
			return Problem(
				detail: "The signer's certificate is not valid.",
				statusCode: StatusCodes.Status422UnprocessableEntity,
				// The validation results tell why. The page shows them below the message.
				extensions: new Dictionary<string, object?> { ["validationResults"] = ex.ValidationResults.ToString() }
			);
		} catch (XmlException ex) {
			// An uploaded file that is not XML.
			return Problem(detail: $"The file is not a valid XML document: {ex.Message}", statusCode: StatusCodes.Status422UnprocessableEntity);
		}

		// The complete step needs the transfer data and the same NF-e. We keep both on this
		// server, and send the browser only an id to retrieve them, so the browser cannot swap the
		// NF-e between the two steps. In a real application, you'd store this in your database or
		// cache, tied to the user's session.
		var state = new XmlNfeSignatureState(request.FileId, transferData);
		var transferDataId = storageMock.StoreTransferData(JsonSerializer.SerializeToUtf8Bytes(state));

		return new XmlNfeSignaturePkiSdkStartResponse(
			TransferDataId: transferDataId,
			// GenerateToSignHash() already returns a hash: send it to the browser as is.
			ToSignHash: toSignHash,
			DigestAlgorithmOid: signatureAlg.DigestAlgorithm.Oid
		);
	}

	// POST api/xml-nfe-signature-pki-sdk/complete
	[HttpPost("complete")]
	public ActionResult<XmlNfeSignaturePkiSdkCompleteResponse> Complete(XmlNfeSignaturePkiSdkCompleteRequest request) {
		// Recover what the start step stored. Each id can be used only once.
		XmlNfeSignatureState? state;
		try {
			state = JsonSerializer.Deserialize<XmlNfeSignatureState>(storageMock.ReadTransferData(request.TransferDataId));
		} catch (FileNotFoundException) {
			state = null;
		}
		if (state == null) {
			return Problem(detail: "The signature was not started or was already completed. Please sign again.", statusCode: StatusCodes.Status422UnprocessableEntity);
		}

		// The complete step must use the same NF-e as the start step.
		if (!storageMock.TryGetFile(state.FileId, out var path)) {
			return Problem(detail: "The file to be signed was not found.", statusCode: StatusCodes.Status404NotFound);
		}

		byte[] signedNfe;
		try {
			var signer = new XmlElementSigner();

			// Set the XML and the policy, exactly as in the start step.
			signer.SetXml(System.IO.File.ReadAllBytes(path));
			signer.SetPolicy(GetSignaturePolicy());

			// Set the signature value computed by Web PKI, along with the transfer data.
			signer.SetPrecomputedSignature(request.Signature, state.TransferData);

			// Finish the signature. This also validates the signer's certificate and the resulting
			// signature.
			signer.ComputeSignature();

			signedNfe = signer.GetSignedXml();

		} catch (ValidationException ex) {
			return Problem(
				detail: "The signature is not valid.",
				statusCode: StatusCodes.Status422UnprocessableEntity,
				extensions: new Dictionary<string, object?> { ["validationResults"] = ex.ValidationResults.ToString() }
			);
		}

		// Store the signed NF-e. In a real application, you'd store it in your database or blob
		// storage.
		return new XmlNfeSignaturePkiSdkCompleteResponse(SignedFileId: storageMock.Store(signedNfe, ".xml"));
	}

	/// <summary>
	/// The signature policy: the NF-e national standard ("padrão nacional").
	/// </summary>
	private XmlPolicySpec GetSignaturePolicy() {
		var policy = BrazilXmlPolicySpec.GetNFePadraoNacional();

		// The NF-e policy trusts the ICP-Brasil roots. Replace them with the roots chosen by
		// Util.GetTrustArbitrator(): ICP-Brasil, plus Lacuna's test PKI in Development, so that
		// Lacuna's test certificates are accepted while you develop.
		policy.ClearTrustArbitrators();
		policy.AddTrustArbitrator(util.GetTrustArbitrator());

		return policy;
	}

	/// <summary>
	/// Returns the Id attribute of the NF-e's infNFe element, or null if there is none.
	/// </summary>
	private static string? GetInfNfeId(byte[] nfe) {
		var document = new XmlDocument();
		using (var stream = new MemoryStream(nfe)) {
			document.Load(stream);
		}
		var namespaces = new XmlNamespaceManager(document.NameTable);
		namespaces.AddNamespace("nfe", NfeNamespace);
		var id = (document.SelectSingleNode("//nfe:infNFe", namespaces) as XmlElement)?.GetAttribute("Id");
		return string.IsNullOrEmpty(id) ? null : id;
	}

	/// <summary>
	/// What the complete step needs from the start step, kept on the server.
	/// </summary>
	private record XmlNfeSignatureState(string FileId, byte[] TransferData);
}

// byte[] properties travel as Base64 strings in JSON, as Web PKI expects.

/// <param name="FileId">The NF-e to sign (see FilesController).</param>
/// <param name="CertContent">The user's certificate, read with Web PKI's readCertificate().</param>
public record XmlNfeSignaturePkiSdkStartRequest(string FileId, byte[] CertContent);

/// <param name="TransferDataId">The id of the transfer data, which the complete step needs.</param>
/// <param name="ToSignHash">The hash for Web PKI's signHash() to sign.</param>
/// <param name="DigestAlgorithmOid">The digest algorithm for Web PKI's signHash().</param>
public record XmlNfeSignaturePkiSdkStartResponse(string TransferDataId, byte[] ToSignHash, string DigestAlgorithmOid);

/// <param name="TransferDataId">Returned by the start step.</param>
/// <param name="Signature">The signature value returned by Web PKI's signHash().</param>
public record XmlNfeSignaturePkiSdkCompleteRequest(string TransferDataId, byte[] Signature);

public record XmlNfeSignaturePkiSdkCompleteResponse(string SignedFileId);
