package com.lacunasoftware.pkisuite.controller;
import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.lacunasoftware.pkisuite.prescricao.ComboFieldCellWrapper;
import com.lacunasoftware.pkisuite.prescricao.DocumentType;
import com.lacunasoftware.pkisuite.prescricao.FieldName;
import com.lacunasoftware.pkisuite.prescricao.TextFieldCellWrapper;
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
		String[] DefaultFieldName = new String[] { 
			"03_Telefone Local de Atendimento", "03_Endereço Local de Atendimento", "03_Data Emissão_af_date",
			"03_Cidade Local de Atendimento", "01_Nome do Paciente", "03_Nome Local de Atendimento", 
			"02_Prescrição", "03_Bairro Local de Atendimento", "03_CNES", "03_UF Local de atendimento" };

		String[] DefaultFieldLabel = new String[] { 
			"Telefone", "Endereço", "Data de Emissão", "Cidade", "Nome do Paciente", "Nome Local de Atendimento",
			"Prescrição", "Bairro", "CNES", "UF" };

		String[] DefaultFieldValues = new String[] { 
			"+00 (00) 0000-0000", "Complexo Hospitalar", "00/00/0000", "Brasília", "Maria da Silva",
			"Clínica Local", "Dipirona ----------- 1 comprimido de 12 em 12 horas por 3 dias", "Bairro do Mar",
			"0000000", "DF" };

		try (FileOutputStream fos = new FileOutputStream(path.toFile())) {
			Document document = new Document();
			PdfWriter writer = PdfWriter.getInstance(document, fos);
			document.open();

			// Add title.
			Paragraph title = new Paragraph("RECEITU\u00C1RIO SIMPLES", new Font((BaseFont) null, 20f, Font.BOLD));
			title.setSpacingAfter(5f);
			title.setAlignment(Element.ALIGN_CENTER);
			document.add(title);

			PdfPTable table = new PdfPTable(6);
			table.setWidthPercentage(100);

			// Field "Tipo de Documento". This text field identifies the type of
			// document is being generated. It's a hidden field because this type
			// is identified by the field name and NOT by the value of this field.
			PdfPCell tipoField = new PdfPCell();
			tipoField.setColspan(6);
			tipoField.setBorder(Rectangle.NO_BORDER);
			TextFieldCellWrapper tipoCellWrapper = new TextFieldCellWrapper();
			// See DocumentType.java, to see what is the vale of this enum below.
			tipoCellWrapper.setFieldName(DocumentType.PRESCRICAO_MEDICAMENTO.getValue());
			tipoCellWrapper.setValue("");
			tipoCellWrapper.setReadOnly(true);
			tipoCellWrapper.setHidden(true);
			tipoField.setCellEvent(tipoCellWrapper);
			table.addCell(tipoField);

			// Field "Nome do(a) Médico(a)".
			PdfPCell doctorNameLabel = new PdfPCell();
			doctorNameLabel.setColspan(2);
			doctorNameLabel.setBorder(Rectangle.NO_BORDER);
			doctorNameLabel.addElement(new Phrase("NOME DO(A) M\u00C9DICO(A):"));
			table.addCell(doctorNameLabel);
			PdfPCell doctorNameField = new PdfPCell();
			doctorNameField.setColspan(4);
			doctorNameField.setBorder(Rectangle.NO_BORDER);
			TextFieldCellWrapper doctorNameCellWrapper = new TextFieldCellWrapper();
			doctorNameCellWrapper.setFieldName("03_Nome Completo Emitente");
			doctorNameCellWrapper.setValue(name);
			doctorNameCellWrapper.setReadOnly(true);
			doctorNameField.setCellEvent(doctorNameCellWrapper);
			table.addCell(doctorNameField);

			// Field "CRM". This text field contains the doctor's register
			// number on CRM.
			PdfPCell crmLabel = new PdfPCell();
			crmLabel.setColspan(2);
			crmLabel.setBorder(Rectangle.NO_BORDER);
			crmLabel.addElement(new Phrase("CRM:"));
			table.addCell(crmLabel);
			PdfPCell crmField = new PdfPCell();
			crmField.setColspan(4);
			crmField.setBorder(Rectangle.NO_BORDER);
			TextFieldCellWrapper crmCellWrapper = new TextFieldCellWrapper();
			// See FieldName.java, to see what is the value of this enum below.
			crmCellWrapper.setFieldName(FieldName.CRM.getValue());
			crmCellWrapper.setValue(crm);
			crmCellWrapper.setReadOnly(true);
			crmField.setCellEvent(crmCellWrapper);
			table.addCell(crmField);

			// Field "CRM UF". This combo box field contains the "UF" where the
			// doctor is registered.
			PdfPCell crmUfLabel = new PdfPCell();
			crmUfLabel.setColspan(2);
			crmUfLabel.setBorder(Rectangle.NO_BORDER);
			crmUfLabel.addElement(new Phrase("CRM UF:"));
			table.addCell(crmUfLabel);
			PdfPCell crmUfField = new PdfPCell();
			crmUfField.setColspan(1);
			crmUfField.setBorder(Rectangle.NO_BORDER);
			ComboFieldCellWrapper crmUfCellWrapper = new ComboFieldCellWrapper();
			// See FieldName.java, to see what is the value of this enum below.
			crmUfCellWrapper.setFieldName(FieldName.CRM_UF.getValue());
			crmUfCellWrapper.setOptions(new String[] { 
				"AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA",
				"PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO" });
			crmUfCellWrapper.setSelection(crmUf);
			crmUfCellWrapper.setReadOnly(true);
			crmUfField.setCellEvent(crmUfCellWrapper);
			table.addCell(crmUfField);
			PdfPCell empty = new PdfPCell();
			empty.setColspan(3);
			empty.setBorder(Rectangle.NO_BORDER);
			table.addCell(empty);

			// Other Fields
			PdfPCell otherFieldLabel;
			PdfPCell otherField;
			TextFieldCellWrapper otherFieldCellWrapper;

			for (int i = 0; i < DefaultFieldValues.length; i++) {
				otherFieldLabel = new PdfPCell();
				otherFieldLabel.setColspan(2);
				otherFieldLabel.setBorder(Rectangle.NO_BORDER);
				otherFieldLabel.addElement(new Phrase(DefaultFieldLabel[i] + ":"));
				table.addCell(otherFieldLabel);
				otherField = new PdfPCell();
				otherField.setColspan(4);
				otherField.setBorder(Rectangle.NO_BORDER);
				otherFieldCellWrapper = new TextFieldCellWrapper();
				otherFieldCellWrapper.setFieldName(DefaultFieldName[i]);
				otherFieldCellWrapper.setValue(DefaultFieldValues[i]);
				otherFieldCellWrapper.setReadOnly(true);
				otherField.setCellEvent(otherFieldCellWrapper);
				table.addCell(otherField);
			}

			// Add table.
			document.add(table);

			document.close();
			writer.close();
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
		signatureStarter.setSignaturePolicy(StandardSignaturePolicies.PadesBasicWithLTV);

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

		// REQUIRED!
		// Use a custom signature field name. This field MUST have the
		// "Emitente" keyword as the last keyword.
		signatureStarter.setCustomSignatureFieldName("Signature1 Emitente");

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
