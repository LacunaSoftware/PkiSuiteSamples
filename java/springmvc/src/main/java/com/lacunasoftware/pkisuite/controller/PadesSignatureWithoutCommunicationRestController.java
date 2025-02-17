package com.lacunasoftware.pkisuite.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.pkisuite.util.restpki.PadesVisualElements;
import com.lacunasoftware.restpki.PKCertificate;
import com.lacunasoftware.restpki.PadesMeasurementUnits;
import com.lacunasoftware.restpki.PadesSignatureFinisher2;
import com.lacunasoftware.restpki.PadesSignatureStarter2;
import com.lacunasoftware.restpki.RestException;
import com.lacunasoftware.restpki.SignaturePolicy;
import com.lacunasoftware.restpki.SignatureResult;
import com.lacunasoftware.restpki.SignatureStartResult;



@Controller
@RequestMapping("/pades-signature-wo-communication-rest")
public class PadesSignatureWithoutCommunicationRestController {
    /**
	 * GET /pades-signature-wo-communication-rest
	 *
	 * This action initiates a PAdES signature using REST PKI and renders the signature page.
	 */
	@GetMapping
	public String get(
		@RequestParam(value = "fileId") String fileToSign,
		Model model,
		HttpServletResponse response
	) throws IOException, RestException {

		// Verify if the fileId exists and get the absolute path of the fileId with the help of our
		// StorageMock class. This sample can only execute if the provided file exists.
		if (!StorageMock.exists(fileToSign)) {
			throw new FileNotFoundException();
		}
		return "pades-signature-wo-communication-rest/index";
    }

	@PostMapping("/start")
	public String postStart(
		@RequestParam(value = "fileId") String fileToSign,
		@RequestParam String certThumb,
		@RequestParam String certContent,
		Model model
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
		signatureStarter.setSecurityContext(Util.getSecurityContext());

		// Create a visual representation for the signature.
		signatureStarter.setVisualRepresentation(PadesVisualElements.getVisualRepresentation());

		// Set the PDF to be signed.
		signatureStarter.setPdfToSign(StorageMock.getDataPath(fileToSign));

		signatureStarter.setSignerCertificateBase64(certContent);

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

		// Call the startWithWebPki() method, which initiates the signature. This yields a
		// SignatureStartWithWebPkiResult object containing the signer certificate and the token,
		// a 43-character case-sensitive URL-safe string, which identifies this signature process.
		// We'll use this value to call the signWithRestPki() method on the Web PKI component
		// (see file static/js/signature-form.js) and also to complete the signature after the form
		// is submitted (see method complete() below). This should not be mistaken with the API
		// access token.
		SignatureStartResult result = signatureStarter.start();

		// The token acquired above can only be used for a single signature attempt. In order to
		// retry the signature it is necessary to get a new token. This can be a problem if the user
		// uses the back button of the browser, since the browser might show a cached page that we
		// rendered previously, with a now stale token. To prevent this from happening, we call the
		// method Util.setNoCacheHeaders(), which sets HTTP headers to prevent caching of the page.
		// Util.setNoCacheHeaders(result);

		// Render the signature page (templates/pades-signature-rest/index.html.html).
		model.addAttribute("token", result.getToken());
		model.addAttribute("certThumb", certThumb);
		model.addAttribute("certContent", certContent);
		model.addAttribute("toSignHash", result.getToSignHashBase64());
		model.addAttribute("digestAlgorithm", result.getDigestAlgorithm());
		return "pades-signature-wo-communication-rest/start";
    }

	@PostMapping("/complete")
	public String postComplete(
		@RequestParam(value = "fileId") String fileToSign,
		@RequestParam(value = "token") String token,
		@RequestParam String signature,
		Model model
	) throws IOException, RestException {

		// Get an instance of the PadesSignatureFinisher2 class, responsible for completing the
		// signature process.
		PadesSignatureFinisher2 signatureFinisher = new PadesSignatureFinisher2(Util.getRestPkiClient());

		// Set the token for this signature and also the signature
		signatureFinisher.setToken(token);
		signatureFinisher.setSignature(Base64.getDecoder().decode(signature));

		// Call the finish() method, which finalizes the signature process and returns a
		// SignatureResult object.
		SignatureResult signatureResult = signatureFinisher.finish();

		// The "certificate" field of the SignatureResult object contains information about the
		// certificate used by the user to sign the file.
		PKCertificate signerCert = signatureResult.getCertificate();

		// At this point, you'd typically store the signed PDF on your database. For demonstration
		// purposes, we'll store the PDF on our StorageMock class.

		// The SignatureResult object has various methods for writing the signature file to a
		// (writeTo()), local file (writeToFile()), open a stream to read the content (openRead())
		// and get its contents (getContent()). For large files, avoid the method getContent() to
		// avoid memory allocation issues.
		String signedPdf;
		try (InputStream resultStream = signatureResult.openRead()) {
			signedPdf = StorageMock.store(resultStream, "pdf");
		}

		// Render the signature page (templates/pades-signature-rest/signature-info.html).
		model.addAttribute("signerCert", signerCert);
		model.addAttribute("signedPdf", signedPdf);
		return "pades-signature-wo-communication-rest/signature-info";

	}


}
