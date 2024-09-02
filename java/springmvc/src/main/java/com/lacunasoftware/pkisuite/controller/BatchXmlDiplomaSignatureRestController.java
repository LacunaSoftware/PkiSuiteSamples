package com.lacunasoftware.pkisuite.controller;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.ClientSideSignatureInstructions;
import com.lacunasoftware.restpki.RestException;
import com.lacunasoftware.restpki.SignaturePolicy;
import com.lacunasoftware.restpki.XmlElementSignatureStarter;
import com.lacunasoftware.restpki.XmlInsertionOptions;
import com.lacunasoftware.restpki.XmlNamespaceManager;

@Controller
@RequestMapping("/batch-xml-diploma-signature-rest")
public class BatchXmlDiplomaSignatureRestController {

	
	@GetMapping
	public String index() {
		return "batch-xml-diploma-signature-rest/start";
	}
	

	@PostMapping("/start")
	public String start
	(
		Model model,
		@RequestParam String certThumb,
		@RequestParam String certContent) throws IOException, RestException, NoSuchAlgorithmException, CertificateException, KeyStoreException {
		// It is up to your application's business logic to determine which documents will compose the batch.
		// Create a list which will be used to store the tokens generated in this step
		// the same will be done for the documentIds
		List<String> tokens = new ArrayList<String>();
		List<String> digestAlgorithmList = new ArrayList<String>();
		List<String> toSignHashes = new ArrayList<String>();
		List<Integer> documentIds = new ArrayList<Integer>();

		for (int i = 1; i <= 30; i++) {
			// Instantiate the XmlElementSignatureStarter class, responsible for receiving
			// the signature
			// elements and start the signature process.
			XmlElementSignatureStarter signatureStarter = new XmlElementSignatureStarter(Util.getRestPkiClient());

			signatureStarter.setXml(StorageMock.getBatchXmlPath(i));
			// Set the path of the XML to be signed, a sample Brazilian diploma digital
			// pre-generated.

			// Set the ID of the element to be signed.
			signatureStarter.setElementToSIgnId("Dip35141214314050000662550010001084271182362300");
			signatureStarter.setSignatureElementLocation(".", new XmlNamespaceManager(),
					XmlInsertionOptions.AppendChild);

			// Set the signature policy.
			signatureStarter.setSignaturePolicy(SignaturePolicy.PkiBrazilXadesAdrTempo);
			signatureStarter.setSignerCertificate(certContent);


			// Set the security context to be used to determine trust in the certificate
			// chain. We have
			// encapsulated the security context choice on Util.java.
			signatureStarter.setSecurityContext(Util.getSecurityContext());

			// Call the startWithWebPki() method, which initiates the signature. This yields
			// the token,
			// a 43-character case-sensitive URL-safe string, which identifies this
			// signature process.
			// We'll use this value to call the signWithRestPki() method on the Web PKI
			// component
			// (see file signature-form.js) and also to complete the signature after the
			// form is
			// submitted (see method post() below). This should not be mistaken with the API
			// access
			// token.
			ClientSideSignatureInstructions signatureInstructions = signatureStarter.start();
			// Add newly added token to tokens
			tokens.add(signatureInstructions.getToken());
			toSignHashes.add(signatureInstructions.getToSignHashBase64());
			digestAlgorithmList.add(signatureInstructions.getDigestAlgorithmOid());
			documentIds.add(i);
		}
		model.addAttribute("documentIds", documentIds);
		model.addAttribute("toSignHashes", toSignHashes);
		model.addAttribute("tokens", tokens);
		model.addAttribute("certThumb", certThumb);
		model.addAttribute("digestAlgorithms", digestAlgorithmList);

		// Render the batch signature page
		return "batch-xml-diploma-signature-rest/index";
	}
	

	/**
	 * GET /batch-xml-diploma-signature-rest/
	 * This action initiates a Xml signature using REST PKI
	 * that will sign the element DadosDiploma with e-CNPJ.
	 * @throws IOException 
	 * @throws RestException 
	 * @throws KeyStoreException 
	 * @throws CertificateException 
	 * @throws NoSuchAlgorithmException 
	 */
	// @GetMapping
	// public String index(Model model) throws IOException, RestException, NoSuchAlgorithmException, CertificateException, KeyStoreException {
		
	// }

	/**
	 * POST /batch-xml-diploma-signature-rest/dados-registro
	 * This action adds the signed xmls from the previous step into this one
	 */
	@PostMapping("/dados-registro")
	public String postDadosRegistro(
			@RequestParam(value = "signedXmls") String signedXmls,
			Model model,
			HttpServletResponse response)
			throws IOException, RestException {
		// Split the string based on commas and remove any surrounding spaces
		List<String> stringArray = Arrays.stream(signedXmls.split(","))
				.map(String::trim)
				.collect(Collectors.toList());

		model.addAttribute("inputXmls", stringArray);
		return "batch-xml-diploma-signature-rest/dados-registro";
	}

	/**
	 * GET /batch-xml-diploma-signature-rest/diploma
	 * This action initiates a Xml signature using REST PKI
	 * that will signs the element DadosRegistro with e-CPF.
	 */
	@PostMapping("/diploma")
	public String postDiploma(
			@RequestParam(value = "signedXmls") String signedXmls,
			Model model,
			HttpServletResponse response) throws IOException, RestException {
		// Split the string based on commas and remove any surrounding spaces
		List<String> stringArray = Arrays.stream(signedXmls.split(","))
				.map(String::trim)
				.collect(Collectors.toList());

		model.addAttribute("inputXmls", stringArray);

		// Render the batch signature page
		return "batch-xml-diploma-signature-rest/diploma";
	}

	public Certificate loadCertificate(String pfxFilePath, String password) 
	throws NoSuchAlgorithmException, CertificateException, IOException, KeyStoreException {
		  // Load the PFX file into a KeyStore
		  KeyStore keyStore = KeyStore.getInstance("PKCS12");
		  try (FileInputStream fis = new FileInputStream(pfxFilePath)) {
			  keyStore.load(fis, password.toCharArray());
		  }

		  // Get the alias (typically there is only one entry)
		  String alias = keyStore.aliases().nextElement();

		  // Get the public key from the certificate
		  return keyStore.getCertificate(alias);

	}
}
