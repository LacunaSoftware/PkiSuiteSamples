using Lacuna.Pki;
using Lacuna.RestPki.Api;
using Lacuna.RestPki.Api.PadesSignature;
// PKI SDK and Rest PKI Core both define PadesHorizontalAlign, PadesVerticalAlign, ... This file uses
// both, so it refers to PKI SDK's PAdES types as Pki.*
using Pki = Lacuna.Pki.Pades;

namespace PkiSuiteAspNetCoreAngularSample.Classes;

/// <summary>
/// The visual representation (the "stamp" drawn on the page) of the PAdES signatures made by the
/// samples. It is kept here only to keep the PAdES samples short; both look the same.
/// </summary>
public class PadesVisualElements(StorageMock storageMock) {

	/// <summary>
	/// Visual representation for the PAdES samples that use PKI SDK.
	/// </summary>
	public Pki.PadesVisualRepresentation2 GetVisualRepresentationForPkiSdk(PKCertificate certificate) {
		var visualRepresentation = new Pki.PadesVisualRepresentation2() {

			// Text of the visual representation. PKI SDK signs on this server, so we already know
			// the signer's certificate and can write its fields ourselves.
			Text = new Pki.PadesVisualText() {
				CustomText = $"Signed by {certificate.SubjectDisplayName} ({certificate.PkiBrazil.CPF})",
				FontSize = 13.0,
				// Specify that the signing time should also be rendered.
				IncludeSigningTime = true,
				// Optionally set the horizontal alignment of the text ('Left' or 'Right'). If not
				// set, the default is Left.
				HorizontalAlign = Pki.PadesTextHorizontalAlign.Left,
				// Optionally set the container within the signature rectangle on which to place the
				// text. By default, the text can occupy the entire rectangle.
				Container = new Pki.PadesVisualRectangle() {
					Left = 0.2,
					Top = 0.2,
					Right = 0.2,
					Bottom = 0.2,
				},
			},

			// We'll use as background the image in Content/PdfStamp.png.
			Image = new Pki.PadesVisualImage() {
				Content = storageMock.GetPdfStampContent(),
				// Align the image to the right horizontally.
				HorizontalAlign = Pki.PadesHorizontalAlign.Right,
				// Align the image to the center vertically.
				VerticalAlign = Pki.PadesVerticalAlign.Center,
			},
		};

		// Position of the visual representation. We get the footnote position preset and customize
		// it to fit the background image.
		var visualPositioning = Pki.PadesVisualAutoPositioning.GetFootnote();
		visualPositioning.Container.Height = 4.94;
		visualPositioning.SignatureRectangleSize.Width = 8.0;
		visualPositioning.SignatureRectangleSize.Height = 4.94;
		visualRepresentation.Position = visualPositioning;

		return visualRepresentation;
	}

	/// <summary>
	/// Visual representation for the PAdES samples that use Rest PKI Core. It goes on
	/// PrepareSignatureOptions.PdfSignatureOptions.VisualRepresentation.
	/// </summary>
	public PadesVisualRepresentationModel GetVisualRepresentationForRestPkiCore() {
		return new PadesVisualRepresentationModel() {

			Text = new PadesVisualTextModel() {
				// Rest PKI Core fills in the tags with the signer's certificate fields. For a full
				// list of the supported tags, see:
				// https://docs.lacunasoftware.com/articles/rest-pki/pades-tags.html
				Text = "Signed by {{name}} ({{national_id}})",
				FontSize = 13.0,
				// Specify that the signing time should also be rendered.
				IncludeSigningTime = true,
				// Optionally set the horizontal alignment of the text. If not set, the default is
				// Left.
				HorizontalAlign = PadesTextHorizontalAlign.Left,
				// Optionally set the container within the signature rectangle on which to place the
				// text. By default, the text can occupy the entire rectangle.
				Container = new PadesVisualRectangleModel() {
					Left = 0.2,
					Top = 0.2,
					Right = 0.2,
					Bottom = 0.2,
				},
			},

			// We'll use as background the image in Content/PdfStamp.png.
			Image = new PadesVisualImageModel() {
				Resource = new ResourceContentOrReference() {
					Content = storageMock.GetPdfStampContent(),
					MimeType = "image/png",
				},
				// Align the image to the right horizontally.
				HorizontalAlign = PadesHorizontalAlign.Right,
				// Align the image to the center vertically.
				VerticalAlign = PadesVerticalAlign.Center,
			},

			// Place the signatures side by side at the bottom of the last page. These are the values
			// of the "footnote" preset, with a larger rectangle to fit the background image.
			Position = new PadesVisualPositioningModel() {
				PageNumber = -1,
				MeasurementUnits = PadesMeasurementUnits.Centimeters,
				Auto = new PadesVisualAutoPositioningModel() {
					Container = new PadesVisualRectangleModel() {
						Left = 1.0,
						Right = 1.0,
						Bottom = 1.0,
						Height = 4.94,
					},
					SignatureRectangleSize = new PadesSizeModel() {
						Width = 8.0,
						Height = 4.94,
					},
					RowSpacing = 0.3,
				},
			},
		};
	}
}
