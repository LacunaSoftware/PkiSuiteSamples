package com.lacunasoftware.pkisuite.controller;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import com.lacunasoftware.pkisuite.prescricao.DocumentType;
import com.lacunasoftware.pkisuite.prescricao.FieldName;
import com.lacunasoftware.pkisuite.prescricao.PdfGeneration;
import com.lacunasoftware.pkisuite.util.express.PadesVisualElements;

import com.lacunasoftware.pkiexpress.PadesSignatureStarter;
import com.lacunasoftware.pkiexpress.SignatureFinisher;
import com.lacunasoftware.pkiexpress.SignatureStartResult;
import com.lacunasoftware.pkiexpress.StandardSignaturePolicies;
import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.pkisuite.util.Util;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;

@Controller
@RequestMapping("/receita-simples-express")
public class ReceitaSimplesExpressController {

	/**
	 * GET /receita-simples-express
	 *
	 * This action simply renders the page.
	 */
	@GetMapping
	public String get(Model model) throws IOException {
		model.addAttribute("ufs", new String[] { 
			"AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA",
			 "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO" });

		// Render the signature page (templates/receita-simples-express/index.html)
		return "receita-simples-express/index";
	}

	/**
	 * POST /receita-simples-express/sign
	 *
	 * This action receives the form submission from the generation page. It will 
	 * generate the Receita Simples file.
	 */
	@PostMapping("/sign")
	public String postSign(
		@RequestParam String name,
		@RequestParam String crm,
		@RequestParam String crmUf,
		Model model
	) throws IOException, DocumentException {
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
		return "receita-simples-express/sign";
	}

	/**
	 * POST /receita-simples-express/start?fileId={fileToSign}
	 *
	 * This action receives the form submission from the signature page. It will perform a PAdES
	 * signature in three steps using PKI Express and Web PKI.
	 */
	@PostMapping("/start")
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

		// REQUIRED!
		// Use a policy accepted by ICP-Brasil.
		signatureStarter.setSignaturePolicy(StandardSignaturePolicies.PadesBasic);

		// Set PDF to be signed.
		signatureStarter.setPdfToSign(StorageMock.getDataPath(fileToSign));

		// REQUIRED!
		// Provide the signer's certificate. You must sign with a valid digital
		// certificate of a doctor, who was registered on CRM.
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
		return "receita-simples-express/start";
	}

	/**
	 * GET /receita-simples-express/complete?fileId={fileToSign}
	 *
	 * This action receives the form submission from the signature page. It will perform a PAdES
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
		signatureFinisher.setTransferFilePath(transferFileId);

		// Set the signature value.
		signatureFinisher.setSignature(signature);

		// Generate path for output file and add to signature finisher.
		String outputFile = StorageMock.generateFileId("pdf");
		signatureFinisher.setOutputFilePath(StorageMock.getDataPath(outputFile));

		// Complete the signature process.
		signatureFinisher.complete();

		// If you want to delete the temporary files created by this step, use the method
		// dispose(). This method MUST be called after the complete() method, because it
		// deletes some files needed by the method.
		signatureFinisher.dispose();

		// Render the signature page (templates/receita-simples-express/signature-info.html).
		model.addAttribute("signedPdf", outputFile);
		return "receita-simples-express/signature-info";
	}
}
