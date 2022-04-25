package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.util.SampleDocs;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;


@Controller
@RequestMapping("/xml-signature-rest")
public class XmlSignatureRestController {

	/**
	 * GET /xml-signature-rest
	 *
	 * This action initiates a XML signature using REST PKI and renders the signature page.
	 */
	@GetMapping
	public String get(
		Model model,
		HttpServletResponse response
	) throws IOException, RestException {

		// Instantiate the FullXmlSignatureStarter class, responsible for receiving the signature
		// elements and start the signature process.
		FullXmlSignatureStarter signatureStarter = new FullXmlSignatureStarter(Util.getRestPkiClient());

		// Set the path of the Sample XML to be signed.
		signatureStarter.setXml(StorageMock.getSampleDocPath(SampleDocs.SAMPLE_XML));

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.XadesBasic);

		// Set the security context to be used to determine trust in the certificate chain. We have
		// encapsulated the security context choice on Util.cs.
		signatureStarter.setSecurityContext(Util.getSecurityContext());

		// Set the location on which to insert the signature node. If the location is not specified,
		// the signature will appended to the root element (which is most usual with enveloped
		// signatures).
		XmlNamespaceManager nsm = new XmlNamespaceManager();
		nsm.addNamespace("ls", "http://www.lacunasoftware.com/sample");
		signatureStarter.setSignatureElementLocation("//ls:signaturePlaceholder", nsm, XmlInsertionOptions.AppendChild);

		// Call the startWithWebPki() method, which initiates the signature. This yields the token,
		// a 43-character case-sensitive URL-safe string, which identifies this signature process.
		// We'll use this value to call the signWithRestPki() method on the Web PKI component
		// (see file signature-form.js) and also to complete the signature after the form is
		// submitted (see method complete() below). This should not be mistaken with the API access
		// token.
		String token = signatureStarter.startWithWebPki();

		// The token acquired above can only be used for a single signature attempt. In order to
		// retry the signature it is necessary to get a new token. This can be a problem if the user
		// uses the back button of the browser, since the browser might show a cached page that we
		// rendered previously, with a now stale token. To prevent this from happening, we call the
		// method Util.setNoCacheHeaders(), which sets HTTP headers to prevent caching of the page.
		Util.setNoCacheHeaders(response);

		// Render the signature page (templates/xml-diploma-signature-rest.html).
		model.addAttribute("sampleId", SampleDocs.SAMPLE_XML);
		model.addAttribute("token", token);
		return "xml-signature-rest/index";
	}

	/**
	 * POST /xml-signature-rest
	 *
	 * This action receives the form submission from the signature page. We'll call REST PKI to
	 * complete the signature.
	 */
	@PostMapping
	public String post(@RequestParam String token, Model model) throws IOException, RestException {

		// Instantiate the XmlSignatureFinisher class, responsible for completing the signature
		// process.
		XmlSignatureFinisher signatureFinisher = new XmlSignatureFinisher(Util.getRestPkiClient());

		// Set the token for this signature (rendered in a hidden input field, see
		// file templates/xml-full-signature.html).
		signatureFinisher.setToken(token);

		// Call the finish() method, which finalizes the signature process and returns a SignatureResult object
		byte[] signedXml = signatureFinisher.finish();

		// At this point, you'd typically store the signed PDF on your database. For demonstration
		// purposes, we'll store the XML on a temporary folder and return to the page an identifier
		// that can be used to download it.
		String filename = StorageMock.store(signedXml, "xml");

		// Get information about the certificate used by the user to sign the file. This method must
		// only be called after calling the finish() method.
		PKCertificate signerCert = signatureFinisher.getCertificateInfo();

		// Render the signature page (templates/xml-diploma-signature-rest.html).
		model.addAttribute("signerCert", signerCert);
		model.addAttribute("filename", filename);
		return "xml-signature-rest/signature-info";
	}
}
