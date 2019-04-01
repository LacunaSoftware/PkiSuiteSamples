package com.lacunasoftware.pkisuite.api;

import com.lacunasoftware.pkiexpress.PadesSignatureStarter;
import com.lacunasoftware.pkiexpress.SignatureFinisher;
import com.lacunasoftware.pkiexpress.SignatureStartResult;
import com.lacunasoftware.pkiexpress.StandardSignaturePolicies;
import com.lacunasoftware.pkisuite.api.model.express.BatchSignatureCompleteRequest;
import com.lacunasoftware.pkisuite.api.model.express.BatchSignatureStartRequest;
import com.lacunasoftware.pkisuite.api.model.express.BatchSignatureStartResponse;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.pkisuite.util.express.PadesVisualElements;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/batch-signature-express")
public class BatchPadesSignatureExpressApiController {

	/**
	 * POST /api/batch-signature-express/start
	 *
	 * This action is called asynchronously from the batch signature page in order to initiate the
	 * signature of each document in the batch.
	 */
	@PostMapping("/start")
	public BatchSignatureStartResponse start(BatchSignatureStartRequest request) throws IOException {

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
	 * POST /api/batch-signature-express/complete
	 *
	 * This action is called asynchronously form the batch signature page in order to complete the
	 * signature of each document in the batch.
	 */
	@PostMapping("/complete")
	public String complete(BatchSignatureCompleteRequest request) throws IOException {

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
		String fileId = StorageMock.generateFileId("pdf");
		signatureFinisher.setOutputFilePath(StorageMock.getDataPath(fileId));

		// Complete the signature process.
		signatureFinisher.complete();

		// If you want to delete the temporary files created by this step, use the method
		// dispose(). This method MUST be called after the complete() method, because it deletes
		// some files needed by the method.
		signatureFinisher.dispose();

		// Return the JSON with the signed file.
		return fileId;
	}
}
