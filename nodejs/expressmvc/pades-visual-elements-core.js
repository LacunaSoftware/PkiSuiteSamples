const { StorageMock } = require('./storage-mock');

class PadesVisualElementsCore {
	/**
	 * Returns the visual representation of the signature used by the REST PKI
	 * Core samples. It follows the PadesVisualRepresentationModel of the REST
	 * PKI Core API (see https://core.pki.rest/swagger) and goes on the
	 * "pdfSignatureOptions.visualRepresentation" field of the request.
	 */
	static getVisualRepresentation() {
		return {
			text: {

				// For a full list of the supported tags, see:
				// https://docs.lacunasoftware.com/articles/rest-pki/pades-tags.html
				text: 'Signed by {{name}} ({{national_id}})',
				fontSize: 13.0,
				// Specify that the signing time should also be rendered.
				includeSigningTime: true,
				// Optionally set the horizontal alignment of the text ('Left' or
				// 'Right'), if not set the default is 'Left'.
				horizontalAlign: 'Left',
				// Optionally set the container within the signature rectangle on
				// which to place the text. By default, the text can occupy the
				// entire rectangle (how much of the rectangle the text will actually
				// fill depends on the length and font size).
				container: {
					left: 0.2,
					top: 0.2,
					right: 0.2,
					bottom: 0.2,
				},
			},
			image: {

				// We'll use as background the image public/PdfStamp.png.
				resource: {
					content: StorageMock.getPdfStampContent().toString('base64'), // Base64-encoded!
					mimeType: 'image/png',
				},

				// Align the image to the right horizontally.
				horizontalAlign: 'Right',
				// Align the image to the center vertically.
				verticalAlign: 'Center',
			},
			// Position the signatures side by side at the bottom of the last page.
			// These are the values of REST PKI Core's "footnote" preset, with a
			// larger rectangle to fit the background image.
			position: {
				pageNumber: -1,
				measurementUnits: 'Centimeters',
				auto: {
					container: {
						left: 1.0,
						right: 1.0,
						bottom: 1.0,
						height: 4.94,
					},
					signatureRectangleSize: {
						width: 8.0,
						height: 4.94,
					},
					rowSpacing: 0.3,
				},
			},
		};
	}
}

exports.PadesVisualElementsCore = PadesVisualElementsCore;
