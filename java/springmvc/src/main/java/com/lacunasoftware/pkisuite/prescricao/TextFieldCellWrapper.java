package com.lacunasoftware.pkisuite.prescricao;

import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.*;

/**
 * This class is used to encapsulated a text field inside a table's cell.
 * It is not mandadory to use this class in the sample, but it helps to
 * create a grid to organize things into the PDF.
 */
public class TextFieldCellWrapper implements PdfPCellEvent {
	private String fieldName;
	private String value;
	private boolean readOnly = false;
	private boolean hidden = false;


	@Override
	public void cellLayout(PdfPCell cell, Rectangle position, PdfContentByte[] canvases) {
		// Get cell writer.
		PdfWriter writer = canvases[0].getPdfWriter();

		// Create text field.
		TextField field = new TextField(writer, position, fieldName);
		field.setText(value);

		// Configure read-only option.
		if (readOnly) {
			field.setOptions(BaseField.READ_ONLY);
		}

		// Configure read-only option.
		if (hidden) {
			field.setVisibility(BaseField.HIDDEN);
		}

		// Add text field.
		try {
			writer.addAnnotation(field.getTextField());
		} catch (Exception e) {
			throw new RuntimeException("Could not be possible to add a text field");
		}
	}

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public boolean isReadOnly() {
		return readOnly;
	}

	public void setReadOnly(boolean readOnly) {
		this.readOnly = readOnly;
	}

	public boolean isHidden() {
		return hidden;
	}

	public void setHidden(boolean hidden) {
		this.hidden = hidden;
	}
}
