package com.lacunasoftware.pkisuite.api;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lacunasoftware.pkisuite.api.model.SignatureTokenPair;
import com.lacunasoftware.pkisuite.api.model.SignatureTokenRequest;
import com.lacunasoftware.pkisuite.controller.DownloadController;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.restpki.FullXmlSignatureStarter;
import com.lacunasoftware.restpki.RestException;
import com.lacunasoftware.restpki.SignaturePolicy;
import com.lacunasoftware.restpki.SignatureResult;
import com.lacunasoftware.restpki.XmlElementSignatureStarter;
import com.lacunasoftware.restpki.XmlInsertionOptions;
import com.lacunasoftware.restpki.XmlNamespaceManager;
import com.lacunasoftware.restpki.XmlSignatureFinisher;

@RestController
@RequestMapping("/api/batch-xml-diploma-signature-rest")
public class BatchXmlDiplomaSignatureRestApiController {
	/**
	 * POST /api/batch-xml-diploma-signature-rest/start/{fileId}
	 *
	 * This action is called asynchronously from the batch signature page in order
	 * to initiate the
	 * signature of each document in the batch.
	 */
	@PostMapping("/start/{fileId:.+}")
	public String start(@PathVariable int fileId) throws IOException, RestException {

		// Instantiate the XmlElementSignatureStarter class, responsible for receiving
		// the signature
		// elements and start the signature process.
		XmlElementSignatureStarter signatureStarter = new XmlElementSignatureStarter(Util.getRestPkiClient());

		// Set the path of the XML to be signed, a sample Brazilian diploma digital
		// pre-generated.
		signatureStarter.setXml(StorageMock.getBatchXmlPath(fileId));

		// Set the ID of the element to be signed.
		signatureStarter.setElementToSIgnId("Dip35141214314050000662550010001084271182362300");
		signatureStarter.setSignatureElementLocation(".", new XmlNamespaceManager(), XmlInsertionOptions.AppendChild);

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.PkiBrazilXadesAdrTempo);

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
		String token = signatureStarter.startWithWebPki();

		return token;
	}

	/**
	 * POST /api/batch-xml-diploma-signature-rest/start/{fileId}
	 *
	 * This action is called asynchronously from the batch signature page in order
	 * to initiate the
	 * signature of each document in the batch.
	 */
	@PostMapping("/start-dados-registro/{fileId:.+}")
	public String startDadosRegistro(@PathVariable String fileId) throws IOException, RestException {

		XmlElementSignatureStarter signatureStarter = new XmlElementSignatureStarter(Util.getRestPkiClient());

		// Set the path of the XML to be signed, a sample Brazilian diploma digital
		// pre-generated.
		signatureStarter.setXml(downloadFile(fileId));

		// Set the ID of the element to be signed.
		signatureStarter.setElementToSIgnId("Reg35141214314050000662550010001084271182362300");
		signatureStarter.setSignatureElementLocation(".", new XmlNamespaceManager(),
				XmlInsertionOptions.AppendChild);

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.PkiBrazilXadesAdrTempo);

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
		String token = signatureStarter.startWithWebPki();
		return token;
	}

	/**
	 * POST /api/batch-xml-diploma-signature-rest/start/{fileId}
	 *
	 * This action is called asynchronously from the batch signature page in order
	 * to initiate the
	 * signature of each document in the batch.
	 */
	@PostMapping("/start-diploma/{fileId:.+}")
	public String startFullDiplomaSignature(@PathVariable String fileId) throws IOException, RestException {

		// Instantiate the FullXmlSignatureStarter class, responsible for receiving the
		// signature
		// elements and start the signature process.
		FullXmlSignatureStarter signatureStarter = new FullXmlSignatureStarter(Util.getRestPkiClient());

		// Set path of the XML to be signed, a sample XML Document.
		signatureStarter.setXml(downloadFile(fileId));

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.PkiBrazilXadesAdrArquivamento);

		// Set the security context to be used to determine trust in the certificate
		// chain. We have
		// encapsulated the security context choice on Util.cs.
		signatureStarter.setSecurityContext(Util.getSecurityContext());

		// Call the startWithWebPki() method, which initiates the signature. This yields
		// the token,
		// a 43-character case-sensitive URL-safe string, which identifies this
		// signature process.
		// We'll use this value to call the signWithRestPki() method on the Web PKI
		// component
		// (see file signature-form.js) and also to complete the signature after the
		// form is

		// submitted (see method complete() below). This should not be mistaken with the
		// API access
		// token.
		String token = signatureStarter.startWithWebPki();

		return token;
	}

	/**
	 * POST /api/batch-signature-rest/complete/{token}
	 *
	 * This action receives the form submission from the view. We'll call REST PKI
	 * to complete the
	 * signature.
	 * 
	 * @throws RestException
	 * @throws IOException
	 */
	@PostMapping("/complete/")
	public List<String> completeSignature(@RequestBody SignatureTokenRequest request) throws RestException, IOException {
		XmlSignatureFinisher signatureFinisher = new XmlSignatureFinisher(Util.getRestPkiClient());
		List<String> filenameList = new ArrayList<String>();

		 // Extract the pairs and process them
        List<SignatureTokenPair> signatureTokenPairs = request.getSignatureTokenPairs();

		// Set the token for this signature (rendered in a hidden input field, see
		// file templates/xml-full-signature.html).
		for (SignatureTokenPair signatureTokenPair : signatureTokenPairs) {
			signatureFinisher.setToken(signatureTokenPair.getToken());
			signatureFinisher.setSignature(signatureTokenPair.getSignature());
			
			// Call the finish() method, which finalizes the signature process and returns
			// the signed XML's bytes.
			byte[] signedXml = signatureFinisher.finish();
			String filename = StorageMock.store(signedXml, "xml");
			filenameList.add(filename);
		}
		return filenameList;
	}

	public static byte[] downloadFile(String id) throws IOException {
		String fileUrl = "http://localhost:60695/download/" + id; // there must be a more elegant way
		URL url = new URL(fileUrl);
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setRequestMethod("GET");

		try (InputStream in = connection.getInputStream();
				ByteArrayOutputStream out = new ByteArrayOutputStream()) {

			byte[] buffer = new byte[1024];
			int bytesRead;
			while ((bytesRead = in.read(buffer)) != -1) {
				out.write(buffer, 0, bytesRead);
			}

			return out.toByteArray();
		}
	}
}
