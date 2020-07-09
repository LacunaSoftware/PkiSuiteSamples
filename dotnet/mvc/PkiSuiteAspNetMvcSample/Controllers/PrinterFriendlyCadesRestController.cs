using Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using Lacuna.RestPki.Client.FluentApi;
using PkiSuiteAspNetMvcSample.Classes;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class PrinterFriendlyCadesRestController : Controller {
		// ####################################################################################################
		// Configuration of the Printer-Friendly version
		// ####################################################################################################

		// Name of your website, with preceding article (article in lowercase).
		private const string VerificationSiteNameWithArticle = "my Verification Center";

		// Publicly accessible URL of your website. Preferably HTTPS.
		private const string VerificationSite = "http://localhost:54123/";

		// Format of the verification link, with "{0}" as the verification code placeholder.
		private const string VerificationLinkFormat = "http://localhost:54123/CheckCadesRest?c={0}";

		// "Normal" font size. Sizes of header fonts are defined based on this size.
		private const int NormalFontSize = 12;

		// CultureInfo to be used when converting dates to string.
		public static readonly CultureInfo CultureInfo = new CultureInfo("pt-BR");

		// Date format to be used when converting dates to string (for other formats,
		// see https://docs.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings).
		public const string DateFormat = "g"; // Short date with short time.

		// Time zone to be used when converting dates to string (for other time zones,
		// see https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/default-time-zones).
		public static readonly TimeZoneInfo TimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");

		// Display name of the time zone chosen above.
		public const string TimeZoneDisplayName = "Brasilia timezone";

		// You may also change texts, positions and more by editing directly the method
		// generatePrinterFriendlyVersion() below.
		// ####################################################################################################

		// GET: PrinterFriendlyCadesRest?userfile={id}
		public ActionResult Index(string userfile) {
			// Locate document and read content from storage. Our action only works if the a valid fileId is
			// given.
			if (!StorageMock.TryGetFile(userfile, out byte[] fileContent)) {
				return HttpNotFound();
			}

			// Check if doc already has a verification code registered on storage.
			var verificationCode = StorageMock.GetVerificationCode(userfile);
			if (verificationCode == null) {
				// If not, generate a code an register it.
				verificationCode = AlphaCode.Generate();
				StorageMock.SetVerificationCode(userfile, verificationCode);
			}

			// Generate the printer-friendly version.
			var pfvContent = GeneratePrinterFriendlyVersion(fileContent, verificationCode);

			// Return printer-friendly version as a downloadable file.
			return File(pfvContent, "application/pdf", "printer-friendly.pdf");
		}
		private byte[] GeneratePrinterFriendlyVersion(byte[] fileContent, string verificationCode) {

			var client = Util.GetRestPkiClient();

			// The verification code is generated without hyphens to save storage space and avoid
			// copy-and-paste problems. On the PDF generation, we use the "formatted" version, with hyphens
			// (which will later be discarded on the verification page).
			var formattedVerificationCode = AlphaCode.Format(verificationCode);

			// Build the verification link from the constant "VerificationLinkFormat" (see above) and the
			// formatted verification code.
			var verificationLink = string.Format(VerificationLinkFormat, formattedVerificationCode);

			// 1. Upload the CAdES File
			var blob = client.UploadFile(fileContent);

			// 2. Inspect signatures on the uploaded CAdES file
			var sigExplorer = new CadesSignatureExplorer(client) {
				Validate = true,
				AcceptableExplicitPolicies = SignaturePolicyCatalog.GetPkiBrazilCades(),
				SecurityContextId = Util.GetSecurityContextId(),
			};
			sigExplorer.SetSignatureFile(blob);
			var signature = sigExplorer.Open();

			// 3. Create PDF with verification information from CAdES file

			var pdfMarker = new PdfMarker(client);
			pdfMarker.SetFile(StorageMock.GetEmptyPdfContent());

			// Build string with joined names of signers (see method getDisplayName below)
			var signerNames = Util.JoinStringsPt(signature.Signers.Select(s => GetDisplayName(s.Certificate)));
			var allPagesMessage = string.Format("This document was digitally signed by {0}.\nTo verify the signatures go to {1} on {2} and inform the code {3}", signerNames, VerificationSiteNameWithArticle, VerificationSite, formattedVerificationCode);

			// PdfHelper is a class from the Rest PKI Client "fluent API" that helps to create elements and
			// parameters for the PdfMarker.
			var pdf = new PdfHelper();

			// Create a "manifest" mark on a new page added on the end of the document. We'll add several
			// elements to this mark.
			var manifestMark = pdf.Mark()
				// This mark's container is the whole page with 1-inch margins.
				.OnContainer(pdf.Container().VarWidthAndHeight().Margins(2.54, 2.54));

			// We'll keep track of our "vertical offset" as we add elements to the mark.
			double verticalOffset = 0;
			double elementHeight;

			elementHeight = 3;
			manifestMark
			// ICP-Brasil logo on the upper-left corner.
			.AddElement(
				pdf.ImageElement()
				.OnContainer(pdf.Container().Height(elementHeight).AnchorTop(verticalOffset).Width(elementHeight /* using elementHeight as width because the image is square */).AnchorLeft())
				.WithImage(StorageMock.GetIcpBrasilLogoContent(), "image/png")
			)
			// QR Code with the verification link on the upper-right corner.
			.AddElement(
				pdf.QRCodeElement()
				.OnContainer(pdf.Container().Height(elementHeight).AnchorTop(verticalOffset).Width(elementHeight /* using elementHeight as width because QR Codes are square */).AnchorRight())
				.WithQRCodeData(verificationLink)
			)
			// Header "VERIFICAÇÃO DAS ASSINATURAS" centered between ICP-Brasil logo and QR Code.
			.AddElement(
				pdf.TextElement()
				.OnContainer(pdf.Container().Height(elementHeight).AnchorTop(verticalOffset + 0.2).FullWidth())
				.AlignTextCenter()
				.AddSection(pdf.TextSection().WithFontSize(NormalFontSize * 1.6).WithText("SIGNATURE\nCHECK"))
			);
			verticalOffset += elementHeight;

			// Vertical padding.
			verticalOffset += 1.7;

			// Header with verification code.
			elementHeight = 2;
			manifestMark.AddElement(
				pdf.TextElement()
				.OnContainer(pdf.Container().Height(elementHeight).AnchorTop(verticalOffset).FullWidth())
				.AlignTextCenter()
				.AddSection(pdf.TextSection().WithFontSize(NormalFontSize * 1.2).WithText(string.Format("Verification Code: {0}", formattedVerificationCode)))
			);
			verticalOffset += elementHeight;

			// Paragraph saying "this document was signed by the following signers etc" and mentioning the
			// time zone of the date/times below.
			elementHeight = 2.5;
			manifestMark.AddElement(
				pdf.TextElement()
				.OnContainer(pdf.Container().Height(elementHeight).AnchorTop(verticalOffset).FullWidth())
				.AddSection(pdf.TextSection().WithFontSize(NormalFontSize).WithText(string.Format("This document was digitally signed by the following signers on the indicated dates ({0}):", TimeZoneDisplayName)))
			);
			verticalOffset += elementHeight;

			// Iterate signers.
			foreach (var signer in signature.Signers) {

				elementHeight = 1.5;

				manifestMark
				// Green "check" or red "X" icon depending on result of validation for this signer.
				.AddElement(
					pdf.ImageElement()
					.OnContainer(pdf.Container().Height(0.5).AnchorTop(verticalOffset + 0.2).Width(0.5).AnchorLeft())
					.WithImage(StorageMock.GetValidationResultIcon(signer.ValidationResults.IsValid), "image/png")
				)
				// Description of signer (see method getSignerDescription() below).
				.AddElement(
					pdf.TextElement()
					.OnContainer(pdf.Container().Height(elementHeight).AnchorTop(verticalOffset).VarWidth().Margins(0.8, 0))
					.AddSection(pdf.TextSection().WithFontSize(NormalFontSize).WithText(GetSignerDescription(signer)))
				);

				verticalOffset += elementHeight;
			}

			// Some vertical padding from last signer.
			verticalOffset += 1;

			// Paragraph with link to verification site and citing both the verification code above and the
			// verification link below.
			elementHeight = 2.5;
			manifestMark.AddElement(
				pdf.TextElement()
				.OnContainer(pdf.Container().Height(elementHeight).AnchorTop(verticalOffset).FullWidth())
				.AddSection(pdf.TextSection().WithFontSize(NormalFontSize).WithText(string.Format("To verify the signatures, go to {0} on ", VerificationSiteNameWithArticle)))
				.AddSection(pdf.TextSection().WithFontSize(NormalFontSize).WithColor(Color.Blue).WithText(VerificationSite))
				.AddSection(pdf.TextSection().WithFontSize(NormalFontSize).WithText(" and inform the code above or follow the link below:"))
			);
			verticalOffset += elementHeight;

			// Verification link.
			elementHeight = 1.5;
			manifestMark.AddElement(
				pdf.TextElement()
				.OnContainer(pdf.Container().Height(elementHeight).AnchorTop(verticalOffset).FullWidth())
				.AddSection(pdf.TextSection().WithFontSize(NormalFontSize).WithColor(Color.Blue).WithText(verificationLink))
				.AlignTextCenter()
			);

			// Apply marks.
			pdfMarker.Marks.Add(manifestMark);
			var result = pdfMarker.Apply();

			// Return result.
			return result.GetContent();
		}

		private static string GetDisplayName(PKCertificate c) {
			if (!string.IsNullOrEmpty(c.PkiBrazil.Responsavel)) {
				return c.PkiBrazil.Responsavel;
			}
			return c.SubjectName.CommonName;
		}

		private static string GetDescription(PKCertificate c) {
			var text = new StringBuilder();
			text.Append(GetDisplayName(c));
			if (!string.IsNullOrEmpty(c.PkiBrazil.Cpf)) {
				text.AppendFormat(" (CPF {0})", c.PkiBrazil.CpfFormatted);
			}
			if (!string.IsNullOrEmpty(c.PkiBrazil.Cnpj)) {
				text.AppendFormat(", company {0} (CNPJ {1})", c.PkiBrazil.CompanyName, c.PkiBrazil.CnpjFormatted);
			}
			return text.ToString();
		}

		private static string GetSignerDescription(CadesSignerInfo signer) {
			var text = new StringBuilder();
			text.Append(GetDescription(signer.Certificate));
			if (signer.SigningTime != null) {
				var dateStr = TimeZoneInfo.ConvertTime(signer.SigningTime.Value, TimeZone).ToString(DateFormat, CultureInfo);
				text.AppendFormat(" on {0}", dateStr);
			}
			return text.ToString();
		}
	}
}