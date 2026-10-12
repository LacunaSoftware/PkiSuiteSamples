package com.lacunasoftware.pkisuite.controller;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import com.lacunasoftware.pkisuite.prescricao.DocumentType;
import com.lacunasoftware.pkisuite.prescricao.FieldName;
import com.lacunasoftware.pkisuite.prescricao.PdfGeneration;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import com.lacunasoftware.pkisuite.util.restpki.PadesVisualElements;
import com.lacunasoftware.restpki.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.Path;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

@Controller
@RequestMapping("/receita-simples-rest")
public class ReceitaSimplesRestController {

	/**
	 * GET /receita-simples-rest
	 *
	 * This action simply renders the page.
	 */
	@GetMapping
	public String get(Model model) throws IOException {
		model.addAttribute("ufs", new String[] { 
			"AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA",
			 "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO" });

		// Render the signature page (templates/receita-simples-rest/index.html)
		return "receita-simples-rest/index";
	}

	/**
	 * POST /receita-simples-rest/sign
	 *
	 * This action generate Receita Simples file, it initiates a PAdES signature using 
	 * REST PKI and renders the signature page.
	 */
	@PostMapping("/sign")
	public String postSign(
		@RequestParam String name,
		@RequestParam String crm,
		@RequestParam String crmUf,
		Model model,
		HttpServletResponse response
	) throws IOException, RestException, DocumentException {
		// Generate the fileId for the file to be generated
		String fileId = StorageMock.generateFilename(".pdf");
		Path path = StorageMock.getTempFolderPath().resolve(fileId);

		try (FileOutputStream fs = new FileOutputStream(path.toFile())) {
	
			// See prescricao/PdfGeneration.java, to see how the custom sample pdf is generated.
			byte[] content = PdfGeneration.receitaSimples(name, crm, crmUf);
			
			PdfReader reader = new PdfReader(content);
			PdfStamper pdfStamper = new PdfStamper(reader, fs);
			
			// REQUIRED!!!
			// Add all the required receita simples metadata,
			// when value is not specified it uses empty strings.
			HashMap<String, String> info = reader.getInfo();
			info.put(DocumentType.PRESCRICAO_MEDICAMENTO.getValue(), "Prescrição de medicamento");
			info.put(FieldName.CRM.getValue(), crm);
			info.put(FieldName.CRM_UF.getValue(), crmUf);
			info.put(FieldName.CRM_ESPECIALIDADE.getValue(), "");
			info.put(FieldName.CRF.getValue(), "");
			info.put(FieldName.CRF_UF.getValue(), "");
			info.put(FieldName.CRF_ESPECIALIDADE.getValue(), "");

			// Add metadata HashMap
			pdfStamper.setMoreInfo(info);
			pdfStamper.close();
		}

		model.addAttribute("fileId", fileId);

		/** START SIGNATURE **/

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
		signatureStarter.setPdfToSign(StorageMock.getDataPath(fileId));

		// Call the startWithWebPki() method, which initiates the signature. This yields a
		// SignatureStartWithWebPkiResult object containing the signer certificate and the token,
		// a 43-character case-sensitive URL-safe string, which identifies this signature process.
		// We'll use this value to call the signWithRestPki() method on the Web PKI component
		// (see file static/js/signature-form.js) and also to complete the signature after the form
		// is submitted (see method complete() below). This should not be mistaken with the API
		// access token.
		SignatureStartWithWebPkiResult result = signatureStarter.startWithWebPki();

		// The token acquired above can only be used for a single signature attempt. In order to
		// retry the signature it is necessary to get a new token. This can be a problem if the user
		// uses the back button of the browser, since the browser might show a cached page that we
		// rendered previously, with a now stale token. To prevent this from happening, we call the
		// method Util.setNoCacheHeaders(), which sets HTTP headers to prevent caching of the page.
		Util.setNoCacheHeaders(response);

		// Render the signature page (templates/receita-simples-rest/sign.html).
		model.addAttribute("token", result.getToken());
		return "receita-simples-rest/sign";
	}

	/**
	 * POST /receita-simples-rest/finish
	 *
	 * This action receives the form submission from the signature page. We'll call REST PKI to
	 * complete the signature.
	 */
	@PostMapping("/finish")
	public String postFinish(@RequestParam String token, Model model) throws IOException, RestException {

		// Get an instance of the PadesSignatureFinisher2 class, responsible for completing the
		// signature process.
		PadesSignatureFinisher2 signatureFinisher = new PadesSignatureFinisher2(Util.getRestPkiClient());

		// Set the token for this signature (rendered in a hidden input field, see file
		// templates/receita-simples.html).
		signatureFinisher.setToken(token);

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

		// Render the signature page (templates/receita-simples-rest/signature-info.html).
		model.addAttribute("signerCert", signerCert);
		model.addAttribute("signedPdf", signedPdf);
		return "receita-simples-rest/signature-info";
	}
}
