package com.lacunasoftware.pkisuite.controller;

import java.io.FileNotFoundException;
import java.io.IOException;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.lacunasoftware.pkiexpress.PKCertificate;
import com.lacunasoftware.pkiexpress.SignatureFinisher;
import com.lacunasoftware.pkiexpress.SignatureStartResult;
import com.lacunasoftware.pkiexpress.StandardSignaturePolicies;
import com.lacunasoftware.pkiexpress.XmlSignatureStarter;
import com.lacunasoftware.pkisuite.util.SampleDocs;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;


@Controller
@RequestMapping("/xml-signature-express")
public class XmlSignatureExpressController {


    /**
	 * GET /xml-signature-express?fileId={fileToSign}
	 *
	 * This action simply renders the page.
	 */
	@GetMapping
	public String get(@RequestParam(value = "fileId") String fileToSign) throws IOException {

		// Verify if the fileToSign exists.
		if (fileToSign == null || !StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}

		// Render the signature page (templates/xml-signature-express/index.html)
		return "xml-signature-express/index";
	}

	/**
	 * POST /xml-signature-express/start?fileId={fileToSign}
	 *
	 * This action receives the form submission from the signature page. It will perform a XML
	 * signature in three steps using PKI Express and Web PKI.
	 */
	@PostMapping("/start")
	public String postStart(
		@RequestParam(value = "fileId") String fileToSign,
		@RequestParam String certThumb,
		@RequestParam String certContent,
		Model model
	) throws IOException {

		// Instantiate the XmlSignatureStarter class, responsible for receiving the signature
		// elements and start the signature process.
		XmlSignatureStarter signatureStarter = new XmlSignatureStarter();

        // Set PKI Default options
        Util.setPkiDefaults(signatureStarter);

		// Set the signature policy.
        signatureStarter.setSignaturePolicy(StandardSignaturePolicies.PkiBrazilXadesAdrBasica);

		// Set the path of the Sample XML to be signed.
		signatureStarter.setXmlToSign(StorageMock.getSampleDocPath(SampleDocs.SAMPLE_XML));

        // You may also want to set the element to be signed, if the element is ommited, then
        // the entire XML is signed instead
        // signatureStarter.setToSignElementId("NFe35141214314050000662550010001084271182362300");

		// Set Base64-encoded certificate's content to signature starter.
		signatureStarter.setCertificateBase64(certContent);

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
		return "xml-signature-express/start";
	}

	/**
	 * GET /xml-signature-express/complete?fileId={fileToSign}
	 *
	 * This action receives the form submission from the signature page. It will perform a XML
	 * signature in three steps using PKI Express and Web PKI.
	 */
	@PostMapping("/complete")
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
		signatureFinisher.setTransferFileId(transferFileId);

		// Set the signature value.
		signatureFinisher.setSignature(signature);

		// Generate path for output file and add to signature finisher.
		String outputFile = StorageMock.generateFileId("xml");
		signatureFinisher.setOutputFilePath(StorageMock.getDataPath(outputFile));

		// Call the finish() method, which finalizes the signature process and returns a SignatureResult object
		PKCertificate signerCert = signatureFinisher.complete(true);

		// Render the signature page (templates/xml-diploma-signature-rest.html).
		model.addAttribute("signerCert", signerCert);
		model.addAttribute("filename", outputFile);

		// Render the signature page (templates/xml-signature-express/signature-info.html).
		return "xml-signature-express/signature-info";
	}
}
