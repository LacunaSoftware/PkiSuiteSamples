package com.lacunasoftware.suite.sample.controller;

import com.lacunasoftware.pkiexpress.PadesSignatureStarter;
import com.lacunasoftware.pkiexpress.SignatureFinisher;
import com.lacunasoftware.pkiexpress.SignatureStartResult;
import com.lacunasoftware.pkiexpress.StandardSignaturePolicies;
import com.lacunasoftware.suite.sample.util.StorageMock;
import com.lacunasoftware.suite.sample.util.Util;
import com.lacunasoftware.suite.sample.util.express.PadesVisualElements;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.FileNotFoundException;
import java.io.IOException;

@Controller
public class PadesSignatureExpressController {

	/**
	 * This action simple renders the page.
	 */
	@RequestMapping(value = "/pades-signature-express", method = {RequestMethod.GET})
	public String get(
		@RequestParam(value = "fileId") String fileToSign,
		Model model
	) throws IOException {

		// Verify if the fileToSign exists.
		if (fileToSign == null || !StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}

		// Render the signature page (templates/pades-signature-express/index.html)
		return "pades-signature-express/index";
	}

	/**
	 * This action receives the form submission from the signature page. It will perform a PAdES
	 * signature in three steps using PKI Express and Web PKI.
	 */
	@RequestMapping(value = "/pades-signature-express/start", method = {RequestMethod.POST})
	public String postStart(
		@RequestParam(value = "fileId") String fileToSign,
		@RequestParam String certThumb,
		@RequestParam String certContent,
		Model model
	) throws IOException {

		// Get an instance of the PadesSignatureStarter class, responsible for receiving
		// the signature elements and start the signature process.
		PadesSignatureStarter signatureStarter = new PadesSignatureStarter();

		// Set PKI default options (see Util.java)
		Util.setPkiDefaults(signatureStarter);

		// Set signature policy.
		signatureStarter.setSignaturePolicy(StandardSignaturePolicies.PadesBasicWithLTV);

		// Set PDF to be signed.
		signatureStarter.setPdfToSign(StorageMock.getDataPath(fileToSign));

		// Set Base64-encoded certificate's content to signature starter.
		signatureStarter.setCertificateBase64(certContent);

		// Set visual representation. We provide a Java class that represents the visual
		// representation model.
		signatureStarter.setVisualRepresentation(PadesVisualElements.getVisualRepresentation());

		// Start the signature process. Receive as response a SignatureStartResult instance
		// containing the following fields:
		// - toSignHash: The hash to be signed.
		// - digestAlgorithm: The digest algorithm that will inform the Web PKI component
		// to compute the signature.
		// - transferFile: A temporary file to be passed to "complete" step.
		SignatureStartResult result = signatureStarter.start();

		// If you want to delete the temporary files created by this step use the method
		// dispose(). This method MUST be called after the start() method, because it
		// deletes some files needed by the method.
		signatureStarter.dispose();

		// Render the fields received form start() method as hidden fields to be used on
		// the javascript or on the "complete" step.
		model.addAttribute("certThumb", certThumb);
		model.addAttribute("certContent", certContent);
		model.addAttribute("toSignHash", result.getToSignHash());
		model.addAttribute("transferFileId", result.getTransferFile());
		model.addAttribute("digestAlgorithm", result.getDigestAlgorithm());
		return "pades-signature-express/start";
	}

	/**
	 * This action receives the form submission from the signature page. It will perform a PAdES
	 * signature in three steps using PKI Express and Web PKI.
	 */
	@RequestMapping(value = "/pades-signature-express/complete", method = {RequestMethod.POST})
	public String postComplete(
		@RequestParam(value = "fileId") String fileToSign,
		@RequestParam String transferFileId,
		@RequestParam String signature,
		Model model
	) throws IOException {

		// Get an instance of the SignatureFinisher class, responsible for completing the
		// signature process.
		SignatureFinisher signatureFinisher = new SignatureFinisher();

		// Set PKI default options (see Util.java)
		Util.setPkiDefaults(signatureFinisher);

		// Set PDF to be signed. It's the same file we used on "start" step.
		signatureFinisher.setFileToSign(StorageMock.getDataPath(fileToSign));

		// Set transfer file.
		signatureFinisher.setTransferFilePath(transferFileId);

		// Set the signature value.
		signatureFinisher.setSignature(signature);

		// Generate path for output file and add to signature finisher.
		String outputFile = StorageMock.generateFilename("pdf");
		signatureFinisher.setOutputFilePath(StorageMock.getDataPath(outputFile));

		// Complete the signature process.
		signatureFinisher.complete();

		// If you want to delete the temporary files created by this step, use the method
		// dispose(). This method MUST be called after the complete() method, because it
		// deletes some files needed by the method.
		signatureFinisher.dispose();

		// Render the signature page (templates/pades-signature-express/signature-info.html).
		model.addAttribute("signedPdf", outputFile);
		return "pades-signature-express/signature-info";
	}
}
