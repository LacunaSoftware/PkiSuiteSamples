package com.lacunasoftware.pkisuite.controller;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.pkisuite.util.restpki.PadesVisualElements;
import com.lacunasoftware.restpki.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.cert.X509Certificate;
import java.util.Enumeration;


@Controller
public class PadesServerKeyRestController {

	/**
	 * GET /pades-server-key-rest
	 *
	 * This action performs a PAdES signature using REST PKI and a PKCS #12 file located on the
	 * server side (the sample certificate "Pierre de Fermat"), and renders the information about
	 * the signed file. The private key never leaves the server, and there is no Web PKI in this
	 * flow.
	 */
	@GetMapping("/pades-server-key-rest")
	public String get(
		@RequestParam(value = "fileId") String fileToSign,
		Model model
	) throws IOException, RestException, GeneralSecurityException {

		// Verify if the fileId exists with the help of our StorageMock class. This sample can only
		// execute if the provided file exists.
		if (!StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}

		// Open the sample PKCS #12 file using the certificate's PIN, obtaining the signer
		// certificate and its private key.
		char[] password = "1234".toCharArray();
		KeyStore keyStore = KeyStore.getInstance("PKCS12");
		try (InputStream pkcs12Stream = Files.newInputStream(StorageMock.getSamplePkcs12Path())) {
			keyStore.load(pkcs12Stream, password);
		}
		String alias = getKeyEntryAlias(keyStore);
		PrivateKey privateKey = (PrivateKey) keyStore.getKey(alias, password);
		X509Certificate certificate = (X509Certificate) keyStore.getCertificate(alias);

		// 1. Start the signature with REST PKI

		// Get an instance of the PadesSignatureStarter2 class, responsible for receiving the
		// signature elements and start the signature process.
		PadesSignatureStarter2 signatureStarter = new PadesSignatureStarter2(Util.getRestPkiClient());

		// Set the PDF to be signed.
		signatureStarter.setPdfToSign(StorageMock.getDataPath(fileToSign));

		// Set the signer certificate (its DER encoding, the private key is not sent).
		signatureStarter.setSignerCertificateRaw(certificate.getEncoded());

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.PadesBasic);

		// Set the security context to be used to determine trust in the certificate chain. We have
		// encapsulated the security context choice on Util.java. Notice that the sample
		// certificate "Pierre de Fermat" is only accepted if the Lacuna Test PKI is trusted (see
		// "trustLacunaTestRoot" on application-dev.yml).
		signatureStarter.setSecurityContext(Util.getSecurityContext());

		// Set the unit of measurement used to edit the pdf marks and visual representations.
		signatureStarter.setMeasurementUnits(PadesMeasurementUnits.Centimeters);

		// Set the visual representation for the signature. We have encapsulated this code (on
		// util/restpki/PadesVisualElements.java) to be used on various PAdES samples.
		signatureStarter.setVisualRepresentation(PadesVisualElements.getVisualRepresentation());

		// Call the start() method, which initiates the signature. This yields the parameters for
		// the signature using the certificate: the token, which identifies this signature process
		// on REST PKI, the data to be signed and the signature algorithm.
		SignatureStartResult signatureParams = signatureStarter.start();

		// 2. Perform the signature

		// Sign the data returned by REST PKI with the private key of the PKCS #12 file, using the
		// signature algorithm also returned by REST PKI (for instance, "SHA256withRSA").
		Signature signer = Signature.getInstance(signatureParams.getSignatureAlgorithm());
		signer.initSign(privateKey);
		signer.update(signatureParams.getToSignDataRaw());
		byte[] signature = signer.sign();

		// 3. Complete the signature with REST PKI

		// Get an instance of the PadesSignatureFinisher2 class, responsible for completing the
		// signature process.
		PadesSignatureFinisher2 signatureFinisher = new PadesSignatureFinisher2(Util.getRestPkiClient());

		// Set the token returned by the start step.
		signatureFinisher.setToken(signatureParams.getToken());

		// Set the signature value computed above.
		signatureFinisher.setSignature(signature);

		// Call the finish() method, which finalizes the signature process and returns a
		// SignatureResult object.
		SignatureResult signatureResult = signatureFinisher.finish();

		// The "certificate" field of the SignatureResult object contains information about the
		// certificate used to sign the file.
		PKCertificate signerCert = signatureResult.getCertificate();

		// At this point, you'd typically store the signed PDF on your database. For demonstration
		// purposes, we'll store the PDF on our StorageMock class.
		String signedPdf;
		try (InputStream resultStream = signatureResult.openRead()) {
			signedPdf = StorageMock.store(resultStream, "pdf");
		}

		// Render the signature information page (templates/pades-server-key-rest/index.html).
		model.addAttribute("signerCert", signerCert);
		model.addAttribute("signedPdf", signedPdf);
		return "pades-server-key-rest/index";
	}

	/**
	 * Returns the alias of the first entry of the key store that holds a private key.
	 */
	private static String getKeyEntryAlias(KeyStore keyStore) throws GeneralSecurityException {
		Enumeration<String> aliases = keyStore.aliases();
		while (aliases.hasMoreElements()) {
			String alias = aliases.nextElement();
			if (keyStore.isKeyEntry(alias)) {
				return alias;
			}
		}
		throw new GeneralSecurityException("The PKCS #12 file has no private key");
	}
}
