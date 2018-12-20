package com.lacunasoftware.suite.sample.controller;

import com.lacunasoftware.restpki.*;
import com.lacunasoftware.suite.sample.util.StorageMock;
import com.lacunasoftware.suite.sample.util.Util;
import com.lacunasoftware.suite.sample.util.restpki.PadesVisualElements;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Controller
public class BatchPadesSignatureRestPkiController {

	/**
	 * This action renders the batch signature page.
	 *
	 * Notice that the only thing we'll do on the server-side at this point is determine the IDs of
	 * the documents to be signed. The page will handle each document one by one and will call the
	 * server asynchronously to start and complete each signature.
	 */
	@RequestMapping(value = "/batch-signature-restpki", method = {RequestMethod.GET})
	public String get(Model model) {

		// It is up to your application's business logic to determine which documents will compose
		// the batch.
		List<Integer> documentIds = new ArrayList<Integer>();
		for (int i = 1; i <= 30; i++) {
			documentIds.add(i);
		}

		// Render the batch signature page (templates/batch-signature-restpki/index.html.html).
		model.addAttribute("documentIds", documentIds);
		return "batch-signature-restpki/index";
	}

	/**
	 * This action is called asynchronously from the batch signature page in order to initiate the
	 * signature of each document in the batch.
	 */
	@RequestMapping(value = "/batch-signature-restpki/start", method = {RequestMethod.POST})
	public @ResponseBody String start(
		@RequestParam int id
	) throws IOException, RestException {

		// Get an instance of the PadesSignatureStarter2 class, responsible for receiving the
		// signature elements and start the signature process.
		PadesSignatureStarter2 signatureStarter = new PadesSignatureStarter2(Util.getRestPkiClient());

		// Set the unit of measurement used to edit the pdf marks and visual representations.
		signatureStarter.setMeasurementUnits(PadesMeasurementUnits.Centimeters);

		// Set the signature policy.
		signatureStarter.setSignaturePolicy(SignaturePolicy.PadesBasic);

		// Set the security context to be used to determine trust in the certificate chain. We have
		// encapsulated the security context choice on Util.java.
		signatureStarter.setSecurityContext(Util.getSecurityContextId());

		// Create a visual representation for the signature.
		signatureStarter.setVisualRepresentation(PadesVisualElements.getVisualRepresentation());

		// Set the document to be signed based on its ID (passed to us from the page).
		signatureStarter.setPdfToSign(StorageMock.getBatchDocPath(id));

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
		signatureStarter.addPdfMark(PadesVisualElements.getPdfMark(1));

		// Call the startWithWebPki() method, which initiates the signature. This yields a
		// SignatureStartWithWebPkiResult object containing the signer certificate and the token,
		// a 43-character case-sensitive URL-safe string, which identifies this signature process.
		// We'll use this value to call the signWithRestPki() method on the Web PKI component (see
		// file signature-form.js) and also to complete the signature after the form is submitted
		// (see method complete() below). This should not be mistaken with the API access token.
		SignatureStartWithWebPkiResult result = signatureStarter.startWithWebPki();

		// Return a JSON with the token obtained from REST PKI (the page will use jQuery to decode
		// this value)
		return "\"" + result.getToken() + "\"";
	}

	/**
	 * This action receives the form submission from the view. We'll call REST PKI to complete the
	 * signature.
	 *
	 * The action can be called as /batch-signature/complete/token?=W6J3tzpW4x..., passing the
	 * token as URL parameter.
	 */
	@RequestMapping(value = "/batch-signature-restpki/complete", method = {RequestMethod.POST})
	public @ResponseBody String complete(
		@RequestParam(value = "token") String token
	) throws IOException, RestException {

		// Get an instance of the PadesSignatureFinisher2 class, responsible for completing the
		// signature process.
		PadesSignatureFinisher2 signatureFinisher = new PadesSignatureFinisher2(Util.getRestPkiClient());

		// Set the token for this signature, received as URL parameter.
		signatureFinisher.setToken(token);

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

		return "\"" + signedPdf + "\"";
	}


}
