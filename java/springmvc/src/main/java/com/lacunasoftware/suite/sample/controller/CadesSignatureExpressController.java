package com.lacunasoftware.suite.sample.controller;

import com.lacunasoftware.pkiexpress.CadesSignatureStarter;
import com.lacunasoftware.pkiexpress.SignatureFinisher;
import com.lacunasoftware.pkiexpress.SignatureStartResult;
import com.lacunasoftware.pkiexpress.StandardSignaturePolicies;
import com.lacunasoftware.suite.sample.util.StorageMock;
import com.lacunasoftware.suite.sample.util.Util;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.FileNotFoundException;
import java.io.IOException;

@Controller
public class CadesSignatureExpressController {

	/**
	 * This action simple renders the page.
	 */
	@RequestMapping(value = "/cades-signature-express", method = {RequestMethod.GET})
	public String get(
		@RequestParam(value = "fileId") String fileToSign,
		Model model
	) throws IOException {

		// Verify if the fileId correspond to an existing file on our StorageMock class.
		if (fileToSign == null || !StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}

		// Render the signature page (templates/cades-signature-express/index.html.html).
		return "cades-signature-express/index";
	}

	/**
	 * This action receives the form submission from the signature page. It will perform a CAdES
	 * signature in three steps using PKI Express and Web PKI.
	 */
	@RequestMapping(value = "/cades-signature-express/start", method = {RequestMethod.POST})
	public String postStart(
		@RequestParam(value = "fileId") String fileToSign,
		@RequestParam String certThumb,
		@RequestParam String certContent,
		Model model
	) throws IOException {

		// Get an instance of the CadesSignatureStarter class, responsible for receiving
		// the signature elements and start the signature process.
		CadesSignatureStarter signatureStarter = new CadesSignatureStarter();

		// Set PKI default options (see Util.java)
		Util.setPkiDefaults(signatureStarter);

		// Set signature policy.
		signatureStarter.setSignaturePolicy(StandardSignaturePolicies.PkiBrazilCadesAdrBasica);

		// Set file to be signed. If the file is a CMS, the PKI Express will recognize that
		// and will co-sign that file.
		signatureStarter.setFileToSign(StorageMock.getDataPath(fileToSign));

		// Set Base64-encoded certificate's content to signature starter.
		signatureStarter.setCertificateBase64(certContent);

		// Set the 'encapsulate content' option (default: true).
		signatureStarter.setEncapsulateContent(true);

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

		// Render the fields received from start() method as hidden fields to be used on
		// the javascript or on the "complete" step.
		model.addAttribute("certThumb", certThumb);
		model.addAttribute("certContent", certContent);
		model.addAttribute("toSignHash", result.getToSignHash());
		model.addAttribute("transferFileId", result.getTransferFile());
		model.addAttribute("digestAlgorithm", result.getDigestAlgorithm());
		return "cades-signature-express/start";
	}

	/**
	 * This action receives the form submission from the signature page. It will perform a CAdES
	 * signature in three steps using PKI Express and Web PKI.
	 */
	@RequestMapping(value = "/cades-signature-express/complete", method = {RequestMethod.POST})
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

		// Set file to be signed. It's the same file we used on "start" step.
		signatureFinisher.setFileToSign(StorageMock.getDataPath(fileToSign));

		// Set transfer file.
		signatureFinisher.setTransferFilePath(transferFileId);

		// Set the signature value.
		signatureFinisher.setSignature(signature);

		// Generate path for output file and add to signature finisher.
		String outputFile = StorageMock.generateFilename("p7s");
		signatureFinisher.setOutputFilePath(StorageMock.getDataPath(outputFile));

		// Complete the signature process.
		signatureFinisher.complete();

		// If you want to delete the temporary files created by this step, use the method
		// dispose(). This method MUST be called after the complete() method, because it
		// deletes some files needed by the method.
		signatureFinisher.dispose();

		// Render the signature page (templates/cades-signature-express/signature-info.html).
		model.addAttribute("cmsFile", outputFile);
		return "cades-signature-express/signature-info";
	}
}
