package com.lacunasoftware.pkisuite.api;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.lacunasoftware.pkisuite.api.model.restpki.BatchSignatureRestCompleteRequest;
import com.lacunasoftware.pkisuite.api.model.restpki.BatchSignatureRestStartRequest;
import com.lacunasoftware.pkisuite.api.model.restpki.BatchSignatureRestStartResponse;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.pkisuite.util.restpki.PadesVisualElements;
import com.lacunasoftware.restpki.PadesMeasurementUnits;
import com.lacunasoftware.restpki.PadesSignatureFinisher2;
import com.lacunasoftware.restpki.PadesSignatureStarter2;
import com.lacunasoftware.restpki.RestException;
import com.lacunasoftware.restpki.SignaturePolicy;
import com.lacunasoftware.restpki.SignatureResult;
import com.lacunasoftware.restpki.SignatureStartResult;

@RestController
@RequestMapping("/api/batch-pades-signature-rest-wo-webpki")
public class BatchPadesSignatureRestWithoutWebpkiApiController {

	/**
	 * POST /api/batch-pades-signature-rest/start/{fileId}
	 *
	 * This action is called asynchronously from the batch signature page in order to initiate the
	 * signature of each document in the batch.
	 */
	@PostMapping("/start")
	public String start(@RequestBody BatchSignatureRestStartRequest signatureStartRequest) throws IOException, RestException {

		// Get an instance of the PadesSignatureStarter2 class, responsible for receiving the
		// signature elements and start the signature process.
		PadesSignatureStarter2 signatureStarter = new PadesSignatureStarter2(Util.getRestPkiClient());

		// Set the unit of measurement used to edit the pdf marks and visual representations.
		signatureStarter.setMeasurementUnits(PadesMeasurementUnits.Centimeters);

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.PadesBasic);

		// Set the security context to be used to determine trust in the certificate chain. We have
		// encapsulated the security context choice on Util.java.
		signatureStarter.setSecurityContext(Util.getSecurityContext());

		// Create a visual representation for the signature.
		signatureStarter.setVisualRepresentation(PadesVisualElements.getVisualRepresentation());

		// Set the document to be signed based on its ID (passed to us from the page).
		signatureStarter.setPdfToSign(StorageMock.getBatchDocPath(signatureStartRequest.getDocId()));

		// Optionally, add marks to the PDF before signing. These differ from the signature visual
		// representation in that they are actually changes done to the document prior to signing,
		// not binded to any signature. Therefore, any number of marks can be added, for instance one
		// per page, whereas there can only be one visual representation per signature. However,
		// since the marks are in reality changes to the PDF, they can only be added to documents
		// which have no previous signatures, otherwise such signatures would be made invalid by the
		// changes to the document (see field bypassMarksIfSigned of PadesSignatureStarter2). This
		// problem does not occur with signature visual representations.
		//
		// We have encapsulated this code in a method to include several possibilities depending on
		// the argument passed. Experiment changing the argument to see different examples of PDF
		// marks (valid values are 1-4). Once you decide which is best for your case, you can place
		// the code directly here.
		//signatureStarter.addPdfMark(PadesVisualElements.getPdfMark(1));

		// Set the signer certificate
		signatureStarter.setSignerCertificateBase64(signatureStartRequest.getSignerCertificate());

		// Call the start() method, which initiates the signature. This yields a
		// SignatureStartResult object containing the hash to be signed and digest algorithm,
		// We'll use this value to call the signHash() method on the Web PKI component (see
		// file signature-form.js) and also to complete the signature after the form is submitted
		// (see method complete() below).
		SignatureStartResult signatureStartResult = signatureStarter.start();
		
		// Create a object containing only the relevant information to perform the subsequent requests
		BatchSignatureRestStartResponse signatureResponse = new BatchSignatureRestStartResponse();
		signatureResponse.setToSignHash(signatureStartResult.getToSignHashBase64());
		signatureResponse.setToken(signatureStartResult.getToken());
		signatureResponse.setDigestAlgorithmOid(signatureStartResult.getDigestAlgorithmOid());
		// Let's create a gson to stringify as json the important data we'll use in further steps
		Gson gson = new Gson();
		// Return a JSON with the signatureStartResult obtained from REST PKI (the page will use jQuery to decode
		// this value)
		return gson.toJson(signatureResponse);
	}

	/**
	 * POST /api/batch-signature-rest/complete/{token}
	 *
	 * This action receives the form submission from the view. We'll call REST PKI to complete the
	 * signature.
	 */
	@PostMapping("/complete")
	public String complete(@RequestBody BatchSignatureRestCompleteRequest batchSigRestCompleteReq) throws IOException, RestException {

		// Get an instance of the PadesSignatureFinisher2 class, responsible for completing the
		// signature process.
		PadesSignatureFinisher2 signatureFinisher = new PadesSignatureFinisher2(Util.getRestPkiClient());

		// Set the token for this signature, received as URL parameter.
		signatureFinisher.setToken(batchSigRestCompleteReq.getToken());
		signatureFinisher.setSignature(batchSigRestCompleteReq.getSignatureBytes());

		// Call the finish() method, which finalizes the signature process and returns a
		// SignatureResult object.
		SignatureResult signatureResult = signatureFinisher.finish();

		// At this point, you'd typically store the signed PDF on your database. For demonstration
		// purposes, we'll store the PDF on our StorageMock class.

		// The SignatureResult object has various methods for writing the signature file to a
		// stream (writeTo()), local file (writeToFile()), open a stream to read the content
		// (openRead()) and get its contents (getContent()). For large files, avoid the method
		// getContent() to avoid memory allocation issues.
		String signedPdf;
		try (InputStream resultStream = signatureResult.openRead()) {
			signedPdf = StorageMock.store(resultStream, "pdf");
		}

		return signedPdf;
	}
}
