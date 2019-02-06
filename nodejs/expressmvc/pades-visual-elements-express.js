'use strict';

class PadesVisualElementsExpress {

	static getVisualRepresentation() {

		// Create a visual representation.
		return {

			text: {

				// For a full list of the supported tags, see:
				// https://github.com/LacunaSoftware/RestPkiSamples/blob/master/PadesTags.md
				text: 'Signed by {{name}} ({{national_id}})',
				fontSize: 13.0,
				// Specify that the signing time should also be rendered.
				includeSigningTime: true,
				// Optionally set the container within the signature rectangle on
				// which to place the text. By default, the text can occupy the
				// entire rectangle (how much of the rectangle the text will
				// actually fill depends on the length and font size). Below, we
				// specify that the text should respect a right margin of 1.5 cm.
				container: {
					left: 0.2,
					top: 0.2,
					right: 0.2,
					bottom: 0.2
				}
			},
			image: {

				// We'll use as background the image static/PdfStamp.png.
				resource: {
					url: 'fref://stamp'
				},

				// Align the image to the right horizontally.
				horizontalAlign: 'Right',
				// Align the image to the center vertically.
				verticalAlign: 'Center'
			},
			position: {
				pageNumber: -1,
				auto: {
					container: {
						left: 1.5,
						right: 1.5,
						bottom: 1.5,
						height: 4.94
					},
					signatureRectangleSize: {
						height: 4.94,
						width: 8.0
					},
					rowSpacing: 0.0
				}
			}

		};
	}
}

exports.PadesVisualElementsExpress = PadesVisualElementsExpress;