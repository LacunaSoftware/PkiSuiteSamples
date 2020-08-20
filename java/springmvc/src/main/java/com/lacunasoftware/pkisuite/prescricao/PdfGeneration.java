package com.lacunasoftware.pkisuite.prescricao;

import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.IOException;
import java.io.*;

public class PdfGeneration {
    public static byte[] receitaSimples(String name, String crm, String crmUf) throws IOException, DocumentException {
        String[] DefaultLabels = new String[] { 
            "Telefone", "Endereço", "Bairro", "Cidade", "UF", "Nome Local de Atendimento", "CNES",
            "Nome do Paciente", "Prescrição", "Data de Emissão" };

        String[] DefaultValues = new String[] { 
            "+00 (00) 0000-0000", "Complexo Hospitalar", "Bairro do Mar", "Brasília", "DF", "Clínica Local", "0000000", 
            "Maria da Silva", "Remédio X ---------- 1 comprimido de 12 em 12 horas por 3 dias", "00/00/0000" };

        ByteArrayOutputStream fos = new ByteArrayOutputStream();
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

        // Field "Nome do(a) Médico(a)".
        PdfPCell doctorNameLabel = new PdfPCell();
        doctorNameLabel.setColspan(2);
        doctorNameLabel.setBorder(Rectangle.NO_BORDER);
        doctorNameLabel.addElement(new Phrase("NOME DO(A) M\u00C9DICO(A):"));
        table.addCell(doctorNameLabel);
        PdfPCell doctorNameValue = new PdfPCell();
        doctorNameValue.setColspan(4);
        doctorNameValue.setBorder(Rectangle.NO_BORDER);
        doctorNameValue.addElement(new Phrase(name));
        table.addCell(doctorNameValue);

        
        // Field "CRM". This text field contains the doctor's register
        // number on CRM.
        PdfPCell crmLabel = new PdfPCell();
        crmLabel.setColspan(2);
        crmLabel.setBorder(Rectangle.NO_BORDER);
        crmLabel.addElement(new Phrase("CRM:"));
        table.addCell(crmLabel);
        PdfPCell crmValue = new PdfPCell();
        crmValue.setColspan(4);
        crmValue.setBorder(Rectangle.NO_BORDER);
        crmValue.addElement(new Phrase(crm));
        table.addCell(crmValue);

        // Field "CRM UF". This combo box field contains the "UF" where the
        // doctor is registered.
        PdfPCell crmUfLabel = new PdfPCell();
        crmUfLabel.setColspan(2);
        crmUfLabel.setBorder(Rectangle.NO_BORDER);
        crmUfLabel.addElement(new Phrase("CRM UF:"));
        table.addCell(crmUfLabel);
        PdfPCell crmUfValue = new PdfPCell();
        crmUfValue.setColspan(4);
        crmUfValue.setBorder(Rectangle.NO_BORDER);
        crmUfValue.addElement(new Phrase(crmUf));
        table.addCell(crmUfValue);

        // Other data
        PdfPCell otherLabel;
        PdfPCell otherValue;

        for (int i = 0; i < DefaultValues.length; i++) {
            otherLabel = new PdfPCell();
            otherLabel.setColspan(2);
            otherLabel.setBorder(Rectangle.NO_BORDER);
            otherLabel.addElement(new Phrase(DefaultLabels[i] + ":"));
            table.addCell(otherLabel);

            otherValue = new PdfPCell();
            otherValue.setColspan(4);
            otherValue.setBorder(Rectangle.NO_BORDER);
            otherValue.addElement(new Phrase(DefaultValues[i]));
            table.addCell(otherValue);
        }

        PdfPCell empty = new PdfPCell();
        empty.setColspan(3);
        empty.setBorder(Rectangle.NO_BORDER);
        table.addCell(empty);

        // Add table.
        document.add(table);

        document.close();
        writer.close();

        byte[] array = fos.toByteArray();
        fos.close();
        return array;
    }

}