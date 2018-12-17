package com.lacunasoftware.suite.sample.controller;

import com.lacunasoftware.pkiexpress.PadesSignatureStarter;
import com.lacunasoftware.pkiexpress.SignatureFinisher;
import com.lacunasoftware.pkiexpress.SignatureStartResult;
import com.lacunasoftware.pkiexpress.StandardSignaturePolicies;
import com.lacunasoftware.suite.sample.model.express.BatchSignatureCompleteRequest;
import com.lacunasoftware.suite.sample.model.express.BatchSignatureStartRequest;
import com.lacunasoftware.suite.sample.model.express.BatchSignatureStartResponse;
import com.lacunasoftware.suite.sample.util.StorageMock;
import com.lacunasoftware.suite.sample.util.Util;
import com.lacunasoftware.suite.sample.util.express.PadesVisualElements;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class BatchPadesSignatureExpressController {

	/**
	 * This action renders the batch signature page.
	 *
	 * Notice that the only thing we'll do on the server-side at this point is determine the IDs of
	 * the documents to be signed. The page will handle each document one by one and will call the
	 * server asynchronously to start and complete each signature.
	 */
	@RequestMapping(value = "/batch-signature-express", method = {RequestMethod.GET})
	public String get(Model model) {

		// It is up to your application's business logic to determine which documents will compose
		// the batch.
		List<Integer> documentIds = new ArrayList<Integer>();
		for (int i = 1; i <= 30; i++) {
			documentIds.add(i);
		}

		// Render the batch signature page (templates/batch-signature-express/index.html.html).
		model.addAttribute("documentIds", documentIds);
		return "batch-signature-express/index";
	}

	/**
	 * This action is called asynchronously from the batch signature page in order to initiate the
	 * signature of each document in the batch.
	 */
	@RequestMapping(value = "/batch-signature-express/start", method = {RequestMethod.POST})
	public @ResponseBody BatchSignatureStartResponse start(
		BatchSignatureStartRequest request
	) throws IOException {

		// Get an instance of the PadesSignatureStarter class, responsible for receiving the
		// signature elements and start the signature process.
		PadesSignatureStarter signatureStarter = new PadesSignatureStarter();

		// Set the PKI default options. (see Util.java)
		Util.setPkiDefaults(signatureStarter);

		// Set signature policy.
		signatureStarter.setSignaturePolicy(StandardSignaturePolicies.PadesBasicWithLTV);

		// Set the PDF to be signed.
		signatureStarter.setPdfToSign(StorageMock.getBatchDocPath(request.getId()));

		// Set Base64-encoded certificate's content to signature starter.
		signatureStarter.setCertificateBase64(request.getCertContent());

		// Set visual representation.
		signatureStarter.setVisualRepresentation(PadesVisualElements.getVisualRepresentation());

		// Start the signature process. Receive as response a SignatureStartResult instance
		// containing the following fields:
		// - toSignHash: The hash to be signed.
		// - digestAlgorithm: The digest algorithm that will inform the Web PKI component to
		// compute the signature.
		// - transferFile: A temporary file to be passed to "complete" step.
		SignatureStartResult result = signatureStarter.start();

		// If you want to delete the temporary files created by this step use the method dispose().
		// This method MUST be called after the start() method, because it deletes some files
		// needed by the method.
		signatureStarter.dispose();

		// Return the fields needed on javascript and complete() method.
		BatchSignatureStartResponse res = new BatchSignatureStartResponse();
		res.setToSignHash(result.getToSignHash());
		res.setDigestAlgorithm(result.getDigestAlgorithm());
		res.setTransferFile(result.getTransferFile());
		return res;
	}

	/**
	 * This action is called asynchronously form the batch signature page in order to complete the
	 * signature of each document in the batch.
	 */
	@RequestMapping(value = "/batch-signature-express/complete", method = {RequestMethod.POST})
	public @ResponseBody String complete(BatchSignatureCompleteRequest request) throws IOException {

		// Get an instance of the SignatureFinisher class, responsible for completing the signature
		// process.
		SignatureFinisher signatureFinisher = new SignatureFinisher();

		// Set PKI default options. (see Util.java)
		Util.setPkiDefaults(signatureFinisher);

		// Set PDF to be signed. It's the same file we used on "start" method.
		signatureFinisher.setFileToSign(StorageMock.getBatchDocPath(request.getId()));

		// Set transfer file.
		signatureFinisher.setTransferFilePath(request.getTransferFile());

		// Set the signature value.
		signatureFinisher.setSignature(request.getSignature());

		// Generate path for the output file and add to signature finisher.
		String fileId = StorageMock.generateFilename("pdf");
		signatureFinisher.setOutputFilePath(StorageMock.getDataPath(fileId));

		// Complete the signature process.
		signatureFinisher.complete();

		// If you want to delete the temporary files created by this step, use the method
		// dispose(). This method MUST be called after the complete() method, because it deletes
		// some files needed by the method.
		signatureFinisher.dispose();

		// Return the JSON with the signed file.
		return "\"" + fileId + "\"";
	}
}
