const express = require('express');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const {
	CadesSignatureExplorer,
	PdfMarker,
	PdfHelper,
	Color,
} = require('pki-express');

const { StorageMock } = require('../storage-mock');
const { Util } = require('../util');

const router = express.Router();
const APP_ROOT = process.cwd();

// #############################################################################
// Configuration of the Printer-Friendly version
// #############################################################################

// Name of your website, with preceding article (article in lowercase).
const verificationSiteNameWithArticle = 'my Verification Center';

// Publicly accessible URL of your website. Preferable HTTPS.
const verificationSite = 'http://localhost:3000';

// Format of the verification link, without the verification code, that is added
// on generatePrinterFriendlyVersion() method.
const verificationLinkFormat = 'http://localhost:3000/check-cades-express?code=';

// "Normal" font size. Sizes of header fonts are defined based on this size.
const normalFontSize = 12;

// - Date format when converting date into a string using moment library
// (see https://momentjs.com/docs/#/displaying/format for other date formats).
const dateFormat = 'DD/MM/YYYY HH:mm';

// Display name of the time zone.
const timeZoneDisplayName = 'Brasilia timezone';

// You may also change texts, positions and more by editing directly the method
// generatePrinterFriendlyVersion() below.
// #############################################################################

/**
 * GET /printer-friendly-version
 *
 * This generates a printer-friendly version from a signature file using
 * PKI Express.
 */
router.get('/', (req, res, next) => {
	// Our demo only works if a "file" is given to work with.
	const { fileId } = req.query;
	if (!fileId) {
		res.status(404).send('Not found');
		return;
	}

	// Locate document and read content.
	const filename = fileId.replace('_', '.');
	const filePath = path.join(APP_ROOT, 'app-data', filename);
	if (!fs.existsSync(filePath)) {
		res.status(404).send('Not found');
		return;
	}

	// Check if doc already has a verification code registered on storage.
	let verificationCode = StorageMock.getVerificationCode(req.session, fileId);
	if (!verificationCode) {
		// If not, generate a code and register it.
		verificationCode = Util.generateVerificationCode();
		StorageMock.setVerificationCode(req.session, fileId, verificationCode);
	}

	// Generate the printer-friendly version.
	generatePrinterFriendlyVersion(filePath, verificationCode)
		.then((pfvContent) => {
			// Return the generate file.
			res.type('pdf');
			res.send(pfvContent);
		})
		.catch((err) => next(err));
});

function generatePrinterFriendlyVersion(pdfPath, verificationCode) {
	let outputFile = null;

	// The verification code is generated without hyphens to save storage space
	// and avoid copy-and-paste problems. On the PDF generation, we use the
	// "formatted" version, with hyphens (which will later be discarded on the
	// verification page).
	const formattedVerificationCode = Util.formatVerificationCode(verificationCode);

	// Build the verification link from teh constant verificationLinkFormat (see
	// above) and the formatted verification code.
	const verificationLink = verificationLinkFormat + formattedVerificationCode;

	return new Promise((resolve, reject) => {
		// 1. Inspect signatures on the updated PDF.

		// Get an instance of the CadesSignatureExplorer class, used to
		// open/validate PDF signatures.
		const sigExplorer = new CadesSignatureExplorer();
		// Set PKI defaults options (see util.js).
		Util.setPkiDefaults(sigExplorer);
		// Specify that we want to validate the signatures in the file, not only
		// inspect them.
		sigExplorer.validate = true;
		// Set the PDF file to be inspected.
		sigExplorer.setSignatureFileFromPathSync(pdfPath);
		// Call the open() method, which returns the signature file's information.
		sigExplorer.open().then((signature) => {
			// 2. Create PDF with the verification information from uploaded PDF.

			// Get an instance of the PDF Marker class, used to apply marks on the
			// PDF.
			const pdfMarker = new PdfMarker();
			// Set PKI default options (see util.js).
			Util.setPkiDefaults(pdfMarker);
			// Specify the file to be marked.
			pdfMarker.setFileFromPathSync(path.join(APP_ROOT, 'public', 'empty.pdf'));

			// Build string with joined names of signers (see method
			// getDisplayName() below).
			const signerNamesList = [];
			signature.signers.forEach((signer) => {
				signerNamesList.push(Util.getDisplayName(signer.certificate));
			});

			// PdfHelper is a class from the PKI Express's "fluent API" that
			// helps creating elements and parameters for the PdfMarker.
			const pdf = new PdfHelper();

			// Create a "manifest" mark on a new page added on the end of the
			// document. We'll add several elements to this mark.
			const manifestMark = pdf.mark()
				.onContainer(pdf.container().varWidthAndHeight().margins(2.54, 2.54));

			// We'll keep track of our "vertical offset" as we add elements to
			// the mark.
			let verticalOffset = 0.0;
			let elementHeight;

			elementHeight = 3;
			manifestMark
				// ICP-Brasil logo on the upper-left corner.
				.addElement(
					pdf.imageElement()
						.onContainer(pdf.container().height(elementHeight).anchorTop(verticalOffset)
							.width(elementHeight /* using elementHeight as width because the image is a square */)
							.anchorLeft())
						.withImageContent(Util.getIcpBrasilLogoContent(), 'image/png'),
				)
				// QR Code with the verification link on the upper-right corner.
				.addElement(
					pdf.qrCodeElement()
						.onContainer(pdf.container().height(elementHeight).anchorTop(verticalOffset)
							.width(elementHeight /* using elementHeight as width because the image is a square */)
							.anchorRight())
						.withQRCodeData(verificationLink),
				)
				// Header "SIGNATURE VERIFICATION" centered between ICP-Brazil
				// logo and QR Code.
				.addElement(
					pdf.textElement()
						.onContainer(pdf.container()
							.height(elementHeight).anchorTop(verticalOffset + 0.2).fullWidth())
						.alignTextCenter()
						.addSection(pdf.textSection().withFontSize(normalFontSize * 1.6).withText('SIGNATURE\n VERIFICATION')),
				);

			verticalOffset += elementHeight;

			// Vertical padding.
			verticalOffset += 1.7;

			// Header with verification code.
			elementHeight = 2;
			manifestMark.addElement(
				pdf.textElement()
					.onContainer(pdf.container().height(elementHeight).anchorTop(verticalOffset).fullWidth())
					.alignTextCenter()
					.addSection(pdf.textSection().withFontSize(normalFontSize * 1.2).withText(`Verification code: ${formattedVerificationCode}`)),
			);

			verticalOffset += elementHeight;

			// Paragraph saying "this document was signed by the following
			// signers etc" and mentioning the time zone of the date/times
			// below.
			elementHeight = 2.5;
			manifestMark.addElement(
				pdf.textElement()
					.onContainer(pdf.container().height(elementHeight).anchorTop(verticalOffset).fullWidth())
					.addSection(pdf.textSection().withFontSize(normalFontSize).withText(`This document was signed by the following signers on the indicated dates (${timeZoneDisplayName}):`)),
			);

			verticalOffset += elementHeight;

			// Iterate signers.
			signature.signers.forEach((signer) => {
				elementHeight = 1.5;
				manifestMark
				// Green "check" or red "X" icon depending on result of
				// validation for this signer.
					.addElement(
						pdf.imageElement()
							.onContainer(pdf.container().height(0.5).anchorTop(verticalOffset + 0.2).width(0.5)
								.anchorLeft())
							.withImageContent(Util.getValidationResultIcon(signer.validationResults.isValid())), 'image/png',
					)
					// Description of signer (see method getSignerDescription()
					// below).
					.addElement(
						pdf.textElement()
							.onContainer(pdf.container()
								.height(elementHeight).anchorTop(verticalOffset).varWidth()
								.margins(0.8, 0.0))
							.addSection(pdf.textSection().withFontSize(normalFontSize)
								.withText(getSignerDescription(signer))),
					);

				verticalOffset += elementHeight;
			});

			// Some vertical padding from last signer.
			verticalOffset += 1;

			// Paragraph with link to verification site and citing both the
			// verification code above and the verification link below.
			elementHeight = 2.5;
			manifestMark.addElement(
				pdf.textElement()
					.onContainer(pdf.container().height(elementHeight).anchorTop(verticalOffset).fullWidth())
					.addSection(pdf.textSection()
						.withFontSize(normalFontSize).withText(`To verify the signatures, access ${verificationSiteNameWithArticle} on `))
					.addSection(pdf.textSection()
						.withFontSize(normalFontSize).withColor(Color.BLUE).withText(verificationSite))
					.addSection(pdf.textSection()
						.withFontSize(normalFontSize).withText(' and inform the code above or access the link below:')),
			);

			verticalOffset += elementHeight;

			// Verification link.
			elementHeight = 1.5;
			manifestMark.addElement(
				pdf.textElement()
					.onContainer(pdf.container().height(elementHeight).anchorTop(verticalOffset).fullWidth())
					.addSection(pdf.textSection()
						.withFontSize(normalFontSize).withColor(Color.BLUE).withText(verificationLink))
					.alignTextCenter(),
			);

			// Add marks.
			pdfMarker.marks.push(manifestMark);

			// Generate path for output file and add the marker.
			StorageMock.createAppData(); // Make sure the "app-data" folder exists.
			outputFile = `${uuidv4()}.pdf`;
			pdfMarker.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

			// Apply marks.
			return pdfMarker.apply();
		}).then(() => {
			// Read printer-friendly version.
			fs.readFile(path.join(APP_ROOT, 'app-data', outputFile), (err, pfvContent) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(pfvContent);
			});
		}).catch((err) => reject(err));
	});
}

function getSignerDescription(signer) {
	let text = '';
	text += Util.getDescription(signer.certificate);
	if (signer.signingTime) {
		text += ` on ${moment(signer.signingTime).format(dateFormat)}`;
	}
	return text;
}

module.exports = router;
