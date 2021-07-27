using Pki = Lacuna.Pki.Pades;
using Lacuna.RestPki.Api.PadesSignature;
using RestPki = Lacuna.RestPki.Client;
using System;
using System.Drawing;

namespace PkiSuiteAspNetSpaSample.Classes {
	public class PadesVisualElements {
		private readonly StorageMock _storageMock;

		public PadesVisualElements(StorageMock storageMock)
		{
			_storageMock = storageMock;
		}

		#region PKI SDK

		// This function is called by the PAdES samples for PKI SDK. It contains a example of signature visual
		// representation. This is only a separate function in order to organize the variaous examples.
		public Pki.PadesVisualRepresentation2 GetVisualRepresentationForPkiSdk(Lacuna.Pki.PKCertificate cert) {

			// Create a visual representation.
			var visualRepresentation = new Pki.PadesVisualRepresentation2() {

				// Text of the visual representation.
				Text = new Pki.PadesVisualText() {
					CustomText = String.Format("Signed by {0} ({1})", cert.SubjectDisplayName, cert.PkiBrazil.CPF),
					FontSize = 13.0,
					// Specify that the signing time should also be rendered.
					IncludeSigningTime = true,
					// Optionally set the horizontal alignment of the text ('Left' or 'Right'), if not set the
					// default is Left.
					HorizontalAlign = Pki.PadesTextHorizontalAlign.Left,
					// Optionally set the container within the signature rectangle on which to place the
					// text. By default, the text can occupy the entire rectangle (how much of the rectangle the
					// text will actually fill depends on the length and font size). Below, we specify that text
					// should respect a right margin of 1.5 cm.
					Container = new Pki.PadesVisualRectangle() {
						Left = 0.2,
						Top = 0.2,
						Right = 0.2,
						Bottom = 0.2
					}
				},
				Image = new Pki.PadesVisualImage() {
					// We'll use as background the image in Content/PdfStamp.png
					Content = _storageMock.GetPdfStampContent(),
					// Align image to the right horizontally.
					HorizontalAlign = Pki.PadesHorizontalAlign.Right,
					// Align image to center vertically.
					VerticalAlign = Pki.PadesVerticalAlign.Center
				}
			};

			// Position of the visual representation. We get the footnote position preset and customize it.
			var visualPositioning = Pki.PadesVisualAutoPositioning.GetFootnote();
			visualPositioning.Container.Height = 4.94;
			visualPositioning.SignatureRectangleSize.Width = 8.0;
			visualPositioning.SignatureRectangleSize.Height = 4.94;
			visualRepresentation.Position = visualPositioning;

			return visualRepresentation;
		}

		#endregion

		#region REST PKI

		// This function is called by the PAdES samples for REST PKI. It contains a example of signature visual
		// representation. This is only in a separate function in order to organize the various examples.
		public RestPki.PadesVisualRepresentation GetVisualRepresentationForRestPki() {

			// Create a visual representation.
			var visualRepresentation = new RestPki.PadesVisualRepresentation() {
				// For a full list of the supported tags, see:
				// https://github.com/LacunaSoftware/RestPkiSamples/blob/master/PadesTags.md
				Text = new RestPki.PadesVisualText("Signed by {{name}} ({{national_id}})") {
					FontSize = 13.0,
					// Specify that the signing time should also be rendered.
					IncludeSigningTime = true,
					// Optionally, set the horizontal alignment of the text. If not set, the default is
					// Left.
					HorizontalAlign = PadesTextHorizontalAlign.Left,
					// Optionally set the container within the signature rectangle on which to place the
					// text. By default, the text can occupy the entire rectangle (how much of the
					// rectangle the text will actually fill depends on the length and font size).
					// Below, we specify that the text should respect a right margin of 1.5 cm.
					Container = new RestPki.PadesVisualRectangle() {
						Left = 0.2,
						Top = 0.2,
						Right = 0.2,
						Bottom = 0.2
					}
				},
				Image = new RestPki.PadesVisualImage(_storageMock.GetPdfStampContent(), "image/png") {
					// Align image to the right horizontally.
					HorizontalAlign = PadesHorizontalAlign.Right,
					// Align image to center vertically.
					VerticalAlign = PadesVerticalAlign.Center
				},
			};

			// Position of the visual represention. We get the footnote position preset and customize
			// it.
			var visualPositioning = RestPki.PadesVisualPositioning.GetFootnote(Util.GetRestPkiClient());
			visualPositioning.Container.Height = 4.94;
			visualPositioning.SignatureRectangleSize.Width = 8.0;
			visualPositioning.SignatureRectangleSize.Height = 4.94;
			visualRepresentation.Position = visualPositioning;

			return visualRepresentation;
		}

		// This function is called by the PAdES samples. It contains examples of PDF marks, visual
		// elements of arbitrary content placed in every page.
		public RestPki.PdfMark GetPdfMark(int sampleNumber) {

			switch (sampleNumber) {

				case 1:
					// Example #1: A sample text and image are placed at the bottom of every page.
					// First, we create the mark object. It contains no elements, being a simple empty
					// box.
					var mark = new RestPki.PdfMark() {
						// Here, we set the mark's position in every page.
						Container = new RestPki.PadesVisualRectangle() {
							// Specifying the width (but no left nor right) results in a horizontally
							// centered fixed-width container.
							Width = 8,
							// Specifying bottom and height (but no top) results in a bottom-aligned
							// fixed-height container.
							Bottom = 0.2,
							Height = 0.6
						}
						// This example has no background and no borders, so we don't set
						// BackgroundColor nor BorderColor.
					};

					// First, the image.
					mark.Elements.Add(new RestPki.PdfMarkImageElement() {
						// We'll position it to the right of the text.
						RelativeContainer = new RestPki.PadesVisualRectangle() {
							// Specifying right and width (but no left) results in a right-aligned
							// fixed-width container.
							Right = 0,
							Width = 1,
							// Specifying top and bottom (but no height) results in a variable-height
							// container with the given margins.
							Top = 0,
							Bottom = 0
						},
						// We'll use the image at 'Content/PdfStamp.png'.
						Image = new RestPki.PdfMarkImage(_storageMock.GetPdfStampContent(), "image/png"),
						// Opacity is an integer from 0 to 100 (0 is completely transparent, 100 is
						// completely opaque).
						Opacity = 75
					});

					// Then, the text.
					mark.Elements.Add(new RestPki.PdfMarkTextElement() {
						// We center the text.
						RelativeContainer = new RestPki.PadesVisualRectangle() {
							// Specifying left and right (but no width) results in a variable-width
							// container with the given margins.
							Left = 1,
							Right = 0,
							// Specifying just the height results in a vertically centered fixed-height
							// container.
							Height = 0.5
						},
						// Then add the text sections.
						TextSections = {
							// First, a simple message.
							new RestPki.PdfTextSection() {
								// We set the text.
								Text = "This document was digitally signed with ",
								// Its color.
								Color = Color.Black,
								// Its size.
								FontSize = 8,
								// And the style.
								Style = PdfTextStyle.Normal
							},
							// And a bold ending.
							new RestPki.PdfTextSection() {
								// We set the text.
								Text = "RestPKI",
								// Its color.
								Color = Color.Black,
								// Its size.
								FontSize = 8,
								// And the style.
								Style = PdfTextStyle.Bold
							}
						}
					});

					return mark;

				case 2:
					// Example #2: An image will be placed at the bottom of every page.
					// First, we create the mark object. It contains no elements, being a simple empty
					// box.
					mark = new RestPki.PdfMark() {
						// Then, we set the mark's position in every page.
						Container = new RestPki.PadesVisualRectangle() {
							// Specifying right and width (but no left) results in a right-aligned
							// fixed-width container.
							Right = 1,
							Width = 2.54,
							// Specifying bottom and height (but no top) results in a bottom-aligned
							// fixed-height container.
							Bottom = 1,
							Height = 2.54
						},
						// After that, its border must be configured.
						BorderWidth = 0.02,
						BorderColor = Color.Black
					};

					// Add a single image element.
					mark.Elements.Add(new RestPki.PdfMarkImageElement() {
						// We'll make the image fill the entire mark, leaving space for the border.
						RelativeContainer = new RestPki.PadesVisualRectangle() {
							Left = 0.1,
							Right = 0.1,
							Top = 0.1,
							Bottom = 0.1
						},
						// We'll use the 'Content/PdfStamp.png' as background.
						Image = new RestPki.PdfMarkImage(_storageMock.GetPdfStampContent(), "image/png"),
						// Opacity is an integer from 0 to 100 (0 is completely transparent, 100 is
						// completely opaque).
						Opacity = 50
					});

					return mark;

				case 3:
					// Example #3: 'Signed with RestPKI' is printed at the top of every page in a blue
					// horizontal bar. First, we create the mark object. It contains no elements, being
					// a simple empty box.
					mark = new RestPki.PdfMark() {
						// Then, we set the mark's position in every page.
						Container = new RestPki.PadesVisualRectangle() {
							// Specifying left and right (but no width) results in a variable-width
							// container with the given margins.
							Left = 0,
							Right = 0,
							// Specifying top and height (but no bottom) results in a top-aligned
							// fixed-height container.
							Top = 0.5,
							Height = 1
						},
						// We'll not need a border, just a background color.
						BackgroundColor = Color.FromArgb(127, 0, 128, 192)
					};

					// Add a single text element.
					mark.Elements.Add(new RestPki.PdfMarkTextElement() {
						// We center the text.
						RelativeContainer = new RestPki.PadesVisualRectangle() {
							// Specifying just the width results in a horizontally centered fixed-width
							// container.
							Width = 5,
							// Specifying just the height results in a vertically centered fixed-height
							// container.
							Height = 1
						},
						// Then add the text sections.
						TextSections = {
							// This example has a single section.
							new RestPki.PdfTextSection() {
								// We set the text.
								Text = "Signed with RestPKI",
								// Its color.
								Color = Color.White,
								// Its size.
								FontSize = 12,
								// And the style.
								Style = PdfTextStyle.Bold
							}
						}
					});

					return mark;

				default:
					return null;

			}
		}

		#endregion
	}
}