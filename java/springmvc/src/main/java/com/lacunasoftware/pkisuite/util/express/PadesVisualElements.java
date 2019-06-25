package com.lacunasoftware.pkisuite.util.express;

import com.lacunasoftware.pkiexpress.*;
import com.lacunasoftware.pkisuite.util.StorageMock;

import java.io.IOException;

public class PadesVisualElements {

	/**
	 * This method is called by the get() method. It contains examples of signature visual
	 * representation positionings.
	 */
	public static PadesVisualRepresentation getVisualRepresentation() throws IOException {

		// Create a visual representation for the signature.
		PadesVisualRepresentation vr = new PadesVisualRepresentation();

		// The tags {{name}} and {{br_cpf_formatted}} will be substituted according to the
		// user's certificate:
		//
		//      name             : full name of the signer;
		//      br_cpf_formatted : if the certificate is ICP-Brasil, contains the signer's
		//                         CPF.
		//
		PadesVisualText text = new PadesVisualText("Signed by {{name}} ({{br_cpf_formatted}})", true);
		// Set font size.
		text.setFontSize(13.0);
		// Create text container and add to PadesVisualText object.
		PadesVisualRectangle container = new PadesVisualRectangle();
		container.setVerticalStretch(0.2, 0.2);
		container.setHorizontalStretch(0.2, 0.2);
		text.setContainer(container);
		// Add text to visual representation.
		vr.setText(text);

		// Create an instance of PadesVisualImage class.
		PadesVisualImage image = new PadesVisualImage();
		// Set the path of the image
		image.setContent(StorageMock.getPdfStampContent());
		// Add image to visual representation.
		vr.setImage(image);

		// Create an instance of PadesVisualAutoPositioning class. This class will create a
		// custom auto positioning for the visual representation.
		PadesVisualAutoPositioning position = new PadesVisualAutoPositioning();
		// Set the page number. Negative values represent pages counted form the end of the
		// document (-1 is the last page)
		position.setPageNumber(-1);
		// Set the row spacing between signatures. The signatures will be placed in the
		// container side by side. If there's no room left, the signatures will "wrap" to
		// the next row. This value specifies the vertical distance between rows.
		position.setRowSpacing(0.0);
		// Specify the size of each signature rectangle.
		PadesSize size = new PadesSize(8.0, 4.94);
		position.setSignatureRectangleSize(size);
		// Create the position container and add to PadesVisualPosition object.
		PadesVisualRectangle positionContainer = new PadesVisualRectangle();
		positionContainer.setHeightBottomAnchored(4.94, 1.5);
		positionContainer.setHorizontalStretch(1.5, 1.5);
		position.setContainer(positionContainer);
		// Add position to visual representation.
		vr.setPosition(position);

		return vr;
	}
}
