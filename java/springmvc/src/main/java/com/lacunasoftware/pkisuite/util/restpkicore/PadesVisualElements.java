package com.lacunasoftware.pkisuite.util.restpkicore;

import com.lacunasoftware.pkisuite.util.StorageMock;
import com.lacunasoftware.restpkicore.PadesHorizontalAlign;
import com.lacunasoftware.restpkicore.PadesMeasurementUnits;
import com.lacunasoftware.restpkicore.PadesSizeModel;
import com.lacunasoftware.restpkicore.PadesTextHorizontalAlign;
import com.lacunasoftware.restpkicore.PadesVerticalAlign;
import com.lacunasoftware.restpkicore.PadesVisualAutoPositioningModel;
import com.lacunasoftware.restpkicore.PadesVisualImageModel;
import com.lacunasoftware.restpkicore.PadesVisualPositioningModel;
import com.lacunasoftware.restpkicore.PadesVisualRectangleModel;
import com.lacunasoftware.restpkicore.PadesVisualRepresentationModel;
import com.lacunasoftware.restpkicore.PadesVisualTextModel;
import com.lacunasoftware.restpkicore.ResourceContentOrReference;

import java.io.IOException;

public class PadesVisualElements {

	/**
	 * This method is called by the REST PKI Core PAdES samples. It contains an example of signature
	 * visual representation, which goes on the "pdfSignatureOptions.visualRepresentation" field of
	 * the request. This is only in a separate class in order to organize the various examples.
	 */
	public static PadesVisualRepresentationModel getVisualRepresentation() throws IOException {

		// Create a visual representation.
		PadesVisualRepresentationModel visualRepresentation = new PadesVisualRepresentationModel();

		// For a full list of supported tags, see:
		// https://docs.lacunasoftware.com/articles/rest-pki/pades-tags.html
		PadesVisualTextModel text = new PadesVisualTextModel();
		text.setText("Signed by {{name}} ({{national_id}})");
		text.setFontSize(13.0);
		// Specify that the signing time should also be rendered.
		text.setIncludeSigningTime(true);
		// Optionally, set the horizontal alignment of the text. If not set, the default is Left.
		text.setHorizontalAlign(PadesTextHorizontalAlign.LEFT);
		// Optionally, set the container within the signature rectangle on which to place the text.
		// By default, the text can occupy the entire rectangle (how much of the rectangle the text
		// will actually fill depends on the length and font size).
		PadesVisualRectangleModel textContainer = new PadesVisualRectangleModel();
		textContainer.setLeft(0.2);
		textContainer.setTop(0.2);
		textContainer.setRight(0.2);
		textContainer.setBottom(0.2);
		text.setContainer(textContainer);
		visualRepresentation.setText(text);

		// We'll use as background the image static/stamp.png.
		ResourceContentOrReference resource = new ResourceContentOrReference();
		resource.setContent(StorageMock.getPdfStampContent());
		resource.setMimeType("image/png");
		PadesVisualImageModel image = new PadesVisualImageModel();
		image.setResource(resource);
		// Align image to the right horizontally.
		image.setHorizontalAlign(PadesHorizontalAlign.RIGHT);
		// Align image to the center vertically.
		image.setVerticalAlign(PadesVerticalAlign.CENTER);
		visualRepresentation.setImage(image);

		// Position the signatures side by side at the bottom of the last page. These are the values
		// of REST PKI Core's "footnote" preset, with a larger rectangle to fit the background
		// image.
		PadesVisualRectangleModel container = new PadesVisualRectangleModel();
		container.setLeft(1.0);
		container.setRight(1.0);
		container.setBottom(1.0);
		container.setHeight(4.94);
		PadesSizeModel signatureRectangleSize = new PadesSizeModel();
		signatureRectangleSize.setWidth(8.0);
		signatureRectangleSize.setHeight(4.94);
		PadesVisualAutoPositioningModel autoPositioning = new PadesVisualAutoPositioningModel();
		autoPositioning.setContainer(container);
		autoPositioning.setSignatureRectangleSize(signatureRectangleSize);
		autoPositioning.setRowSpacing(0.3);

		PadesVisualPositioningModel position = new PadesVisualPositioningModel();
		// Page -1 is the last page.
		position.setPageNumber(-1);
		position.setMeasurementUnits(PadesMeasurementUnits.CENTIMETERS);
		position.setAuto(autoPositioning);
		visualRepresentation.setPosition(position);

		return visualRepresentation;
	}
}
