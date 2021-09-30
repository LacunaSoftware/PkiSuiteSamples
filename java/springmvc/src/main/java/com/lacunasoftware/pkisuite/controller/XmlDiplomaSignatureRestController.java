package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.FileNotFoundException;
import java.io.IOException;

@Controller
@RequestMapping("/xml-diploma-signature-rest")
public class XmlDiplomaSignatureRestController {

	/**
	 * GET /xml-diploma-signature-rest/
	 * This action initiates a Xml signature using REST PKI
	 * that will sign the element DadosDiploma with e-CNPJ.
	 */
	@GetMapping
	public String get(
			Model model,
			HttpServletResponse response
	) throws IOException, RestException {
		// Instantiate the XmlElementSignatureStarter class, responsible for receiving the signature
		// elements and start the signature process.
		XmlElementSignatureStarter signatureStarter = new XmlElementSignatureStarter(Util.getRestPkiClient());

		// Set the path of the XML to be signed, a sample Brazilian fiscal invoice pre-generated.
		signatureStarter.setXml(StorageMock.getSampleDiplomaPath());

		// Set the ID of the element to be signed.
		signatureStarter.setElementToSIgnId("Dip35141214314050000662550010001084271182362300");

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.PkiBrazilXadesAdrTempo);

		// Set the security context to be used to determine trust in the certificate chain. We have
		// encapsulated the security context choice on Util.java.
		signatureStarter.setSecurityContext(Util.getSecurityContextId());

		// Call the startWithWebPki() method, which initiates the signature. This yields the token,
		// a 43-character case-sensitive URL-safe string, which identifies this signature process.
		// We'll use this value to call the signWithRestPki() method on the Web PKI component
		// (see file signature-form.js) and also to complete the signature after the form is
		// submitted (see method post() below). This should not be mistaken with the API access
		// token.
		String token = signatureStarter.startWithWebPki();

		// The token acquired above can only be used for a single signature attempt. In order to
		// retry the signature it is necessary to get a new token. This can be a problem if the user
		// uses the back button of the browser, since the browser might show a cached page that we
		// rendered previously, with a now stale token. To prevent this from happening, we call the
		// method Util.setNoCacheHeaders(), which sets HTTP headers to prevent caching of the page.
		Util.setNoCacheHeaders(response);

		// Render the signature page (templates/xml-diploma-signature-rest.html).
		model.addAttribute("token", token);
		return "xml-diploma-signature-rest/index";
	}

	/**
	 * POST /xml-diploma-signature-rest/
	 * This action complete a Xml signature using REST PKI
	 * that sign the element DadosDiploma.
	 */
	@PostMapping
	public String post(
			@RequestParam(value = "token") String token,
			Model model
	) throws IOException, RestException {
		// Instantiate the XmlSignatureFinisher class, responsible for completing the signature
		// process.
		XmlSignatureFinisher signatureFinisher = new XmlSignatureFinisher(Util.getRestPkiClient());

		// Set the token for this signature (rendered in a hidden input field, see
		// file templates/xml-full-signature.html).
		signatureFinisher.setToken(token);

		// Call the finish() method, which finalizes the signature process and returns the signed
		// XML's bytes.
		byte[] signedXml = signatureFinisher.finish();

		// At this point, you'd typically store the signed PDF on your database. For demonstration
		// purposes, we'll store the XML on a temporary folder and return to the page an identifier
		// that can be used to download it.
		String filename = StorageMock.store(signedXml, "xml");

		// Render the signature page (templates/xml-diploma-signature-rest.html).
		model.addAttribute("filename", filename);
		return "xml-diploma-signature-rest/dados-diploma";
	}

	/**
	 * GET /xml-diploma-signature-rest/init-dados-registro
	 * This action initiates a Xml signature using REST PKI
	 * that will signs the element DadosRegistro with e-CPF.
	 */
	@GetMapping("/init-dados-registro")
	public String initDadosRegistro(
			@RequestParam(value = "fileId") String fileToSign,
			Model model,
			HttpServletResponse response
	) throws IOException, RestException {
		// Verify if the fileId exists and get the absolute path of the fileId with the help of our
		// StorageMock class. This sample can only execute if the provided file exists.
		if (!StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}
		// Instantiate the XmlElementSignatureStarter class, responsible for receiving the signature
		// elements and start the signature process.
		XmlElementSignatureStarter signatureStarter = new XmlElementSignatureStarter(Util.getRestPkiClient());

		// Set the path of the XML to be signed, a sample Brazilian fiscal invoice pre-generated.
		signatureStarter.setXml(fileToSign);

		// Set the ID of the element to be signed.
		signatureStarter.setElementToSIgnId("Reg35141214314050000662550010001084271182362300");

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.PkiBrazilXadesAdrTempo);

		// Set the security context to be used to determine trust in the certificate chain. We have
		// encapsulated the security context choice on Util.java.
		signatureStarter.setSecurityContext(Util.getSecurityContextId());

		// Call the startWithWebPki() method, which initiates the signature. This yields the token,
		// a 43-character case-sensitive URL-safe string, which identifies this signature process.
		// We'll use this value to call the signWithRestPki() method on the Web PKI component
		// (see file signature-form.js) and also to complete the signature after the form is
		// submitted (see method post() below). This should not be mistaken with the API access
		// token.
		String token = signatureStarter.startWithWebPki();

		// The token acquired above can only be used for a single signature attempt. In order to
		// retry the signature it is necessary to get a new token. This can be a problem if the user
		// uses the back button of the browser, since the browser might show a cached page that we
		// rendered previously, with a now stale token. To prevent this from happening, we call the
		// method Util.setNoCacheHeaders(), which sets HTTP headers to prevent caching of the page.
		Util.setNoCacheHeaders(response);

		// Render the signature page (templates/xml-diploma-signature-rest.html).
		model.addAttribute("token", token);
		return "xml-diploma-signature-rest/sign-dados-registro";
	}

	/**
	 * POST /xml-diploma-signature-rest/complete-dados-registro
	 * This action complete a Xml signature using REST PKI
	 * that signs the element DadosRegistro.
	 */
	@PostMapping("/complete-dados-registro")
	public String completeDadosRegistro(
			@RequestParam(value = "token") String token,
			Model model
	) throws IOException, RestException {
		// Instantiate the XmlSignatureFinisher class, responsible for completing the signature
		// process.
		XmlSignatureFinisher signatureFinisher = new XmlSignatureFinisher(Util.getRestPkiClient());

		// Set the token for this signature (rendered in a hidden input field, see
		// file templates/xml-full-signature.html).
		signatureFinisher.setToken(token);

		// Call the finish() method, which finalizes the signature process and returns the signed
		// XML's bytes.
		byte[] signedXml = signatureFinisher.finish();

		// At this point, you'd typically store the signed PDF on your database. For demonstration
		// purposes, we'll store the XML on a temporary folder and return to the page an identifier
		// that can be used to download it.
		String filename = StorageMock.store(signedXml, "xml");

		// Render the signature page (templates/xml-diploma-signature-rest.html).
		model.addAttribute("filename", filename);
		return "xml-diploma-signature-rest/dados-registro";
	}

	/**
	 * GET /xml-diploma-signature-rest/init-full-diploma
	 * This action initiates a Xml signature using REST PKI
	 * that will sign the full Diploma XML with e-CNPJ (AD-RA).
	 */
	@GetMapping("/init-full-diploma")
	public String initFullDiploma(
			@RequestParam(value = "fileId") String fileToSign,
			Model model,
			HttpServletResponse response
	) throws IOException, RestException {

		// Verify if the fileId exists and get the absolute path of the fileId with the help of our
		// StorageMock class. This sample can only execute if the provided file exists.
		if (!StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}

		// Instantiate the FullXmlSignatureStarter class, responsible for receiving the signature
		// elements and start the signature process.
		FullXmlSignatureStarter signatureStarter = new FullXmlSignatureStarter(Util.getRestPkiClient());

		// Set path of the XML to be signed, a sample XML Document.
		signatureStarter.setXml(fileToSign);

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.PkiBrazilXadesAdrArquivamento);

		// Set the security context to be used to determine trust in the certificate chain. We have
		// encapsulated the security context choice on Util.cs.
		signatureStarter.setSecurityContext(Util.getSecurityContextId());

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
		model.addAttribute("token", token);
		return "xml-diploma-signature-rest/sign-full-diploma";
	}

	/**
	 * POST /xml-diploma-signature-rest/complete-full-diploma
	 * This action complete a Xml signature using REST PKI
	 * that signs the full Diploma XML
	 */
	@PostMapping("/complete-full-diploma")
	public String completeFullDiploma(
			@RequestParam(value = "token") String token,
			Model model
	) throws IOException, RestException {
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

		// Render the signature page (templates/xml-diploma-signature-rest.html).
		model.addAttribute("filename", filename);
		return "xml-diploma-signature-rest/diploma";
	}
}