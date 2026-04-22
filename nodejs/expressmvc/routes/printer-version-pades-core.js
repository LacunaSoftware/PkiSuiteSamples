const express = require('express');
const path = require('path');
const moment = require('moment');
const {
	PdfMarker,
	PdfMark,
	PdfMarkPageOptions,
	PdfMarkImageElement,
	PdfMarkImage,
	PdfMarkTextElement,
	PdfTextSection,
	PdfMarkQRCodeElement,
	Color,
} = require('restpki-client');

const { StorageMock } = require('../storage-mock');
const { Util } = require('../util');

const router = express.Router();
const APP_ROOT = process.cwd();

const verificationSiteNameWithArticle = 'my Verification Center';
const verificationSite = 'http://localhost:3000';
const verificationLinkFormat = 'http://localhost:3000/check-pades-restpki?code=';
const normalFontSize = 12;
const dateFormat = 'DD/MM/YYYY HH:mm';
const timeZoneDisplayName = 'Brasilia timezone';

/**
 * GET /printer-version-pades-core
 *
 * Generates a printer-friendly version of a signed PDF using REST PKI Core
 * for signature inspection and REST PKI for PDF marking.
 */
router.get('/', (req, res, next) => {
	const { fileId } = req.query;
	if (!fileId) {
		res.status(404).send('Not found');
		return;
	}

	const filename = fileId.replace('_', '.');
	const filePath = path.join(APP_ROOT, 'app-data', filename);

	let verificationCode = StorageMock.getVerificationCode(req.session, fileId);
	if (!verificationCode) {
		verificationCode = Util.generateVerificationCode();
		StorageMock.setVerificationCode(req.session, fileId, verificationCode);
	}

	generatePrinterFriendlyVersion(filePath, verificationCode)
		.then((pfvContent) => {
			res.type('pdf');
			res.setHeader('Content-Disposition', 'filename=printer-friendly.pdf');
			res.send(pfvContent);
		})
		.catch((err) => next(err));
});

async function generatePrinterFriendlyVersion(pdfPath, verificationCode) {
	const formattedVerificationCode = Util.formatVerificationCode(verificationCode);
	const verificationLink = verificationLinkFormat + formattedVerificationCode;

	// Inspect signature using REST PKI Core
	const client = Util.getRestPkiCoreClient();
	const fs = require('fs');
	const fileContent = fs.readFileSync(pdfPath);

	const inspectResponse = await client.inspectSignature({
		file: {
			content: fileContent.toString('base64'),
			contentType: 'application/pdf',
			name: path.basename(pdfPath),
		},
		validate: true,
		securityContextId: Util.getSecurityContextId(),
	});

	const signature = inspectResponse.data;

	// Apply PDF marks using REST PKI (PdfMarker)
	const pdfMarker = new PdfMarker(Util.getRestPkiClient());
	pdfMarker.setFileFromPath(pdfPath);

	const certDisplayNames = [];
	signature.signers.forEach((signer) => {
		certDisplayNames.push(_getDisplayName(signer.certificate));
	});
	const signerNames = Util.joinStringPt(certDisplayNames);
	const allPagesMessage = `This document was digitally signed by ${signerNames}.\n`
		+ `To check the signatures, visit ${verificationSiteNameWithArticle}`
		+ ` at ${verificationSite} and inform this code ${formattedVerificationCode}.`;

	let pdfMark;
	let manifestMark;
	let element;
	let textSection;

	pdfMark = new PdfMark();
	pdfMark.pageOption = PdfMarkPageOptions.ALL_PAGES;
	pdfMark.container = { width: 1, right: 1, height: 1, bottom: 1 };
	element = new PdfMarkImageElement();
	element.opacity = 75;
	element.image = new PdfMarkImage(Util.getIcpBrasilLogoContent(), 'image/png');
	pdfMark.elements.push(element);
	pdfMark.backgroundColor = new Color(0, 0, 0, 1);
	pdfMarker.marks.push(pdfMark);

	pdfMark = new PdfMark();
	pdfMark.pageOption = PdfMarkPageOptions.ALL_PAGES;
	pdfMark.container = { left: 1.5, right: 3.5, height: 2, bottom: 0 };
	element = new PdfMarkTextElement();
	element.opacity = 75;
	element.textSections.push(new PdfTextSection(allPagesMessage));
	pdfMark.elements.push(element);
	pdfMark.backgroundColor = new Color(0, 0, 0, 1);
	pdfMarker.marks.push(pdfMark);

	pdfMark = new PdfMark();
	pdfMark.pageOption = PdfMarkPageOptions.ALL_PAGES;
	pdfMark.container = { width: 2, right: 0, top: 1.5, bottom: 3.5 };
	element = new PdfMarkTextElement();
	element.rotation = 90;
	element.opacity = 75;
	element.textSections.push(new PdfTextSection(allPagesMessage));
	pdfMark.elements.push(element);
	pdfMark.backgroundColor = new Color(0, 0, 0, 1);
	pdfMarker.marks.push(pdfMark);

	manifestMark = new PdfMark();
	manifestMark.pageOption = PdfMarkPageOptions.NEW_PAGE;
	manifestMark.container = { top: 1.5, bottom: 1.5, left: 1.5, right: 1.5 };

	let verticalOffset = 0;
	let elementHeight;

	elementHeight = 3;
	element = new PdfMarkImageElement();
	element.relativeContainer = { height: elementHeight, top: verticalOffset, width: elementHeight, left: 0 };
	element.image = new PdfMarkImage(Util.getIcpBrasilLogoContent(), 'image/png');
	manifestMark.elements.push(element);

	element = new PdfMarkQRCodeElement();
	element.relativeContainer = { height: elementHeight, top: verticalOffset, width: elementHeight, right: 0 };
	element.qrCodeData = verificationLink;
	manifestMark.elements.push(element);

	element = new PdfMarkTextElement();
	element.relativeContainer = { height: elementHeight, top: verticalOffset + 0.2, left: 0, right: 0 };
	element.align = 'Center';
	textSection = new PdfTextSection();
	textSection.fontSize = normalFontSize * 1.6;
	textSection.text = 'SIGNATURE\nCHECK';
	element.textSections.push(textSection);
	manifestMark.elements.push(element);
	verticalOffset += elementHeight;
	verticalOffset += 1.7;

	elementHeight = 2;
	element = new PdfMarkTextElement();
	element.relativeContainer = { height: elementHeight, top: verticalOffset, left: 0, right: 0 };
	element.align = 'Center';
	textSection = new PdfTextSection();
	textSection.fontSize = normalFontSize * 1.2;
	textSection.text = `Verification code: ${formattedVerificationCode}`;
	element.textSections.push(textSection);
	manifestMark.elements.push(element);
	verticalOffset += elementHeight;

	elementHeight = 2.5;
	element = new PdfMarkTextElement();
	element.relativeContainer = { height: elementHeight, top: verticalOffset, left: 0, right: 0 };
	textSection = new PdfTextSection();
	textSection.fontSize = normalFontSize;
	textSection.text = `This document was digitally signed by the following signers on the indicated dates (${timeZoneDisplayName}):`;
	element.textSections.push(textSection);
	manifestMark.elements.push(element);
	verticalOffset += elementHeight;

	signature.signers.forEach((signer) => {
		elementHeight = 1.5;
		element = new PdfMarkImageElement();
		element.relativeContainer = { height: 0.5, top: verticalOffset + 0.2, width: 0.5, left: 0 };
		element.image = new PdfMarkImage(Util.getValidationResultIcon(signer.validationResults && signer.validationResults.isValid ? signer.validationResults.isValid() : true), 'image/png');
		manifestMark.elements.push(element);

		element = new PdfMarkTextElement();
		element.relativeContainer = { height: elementHeight, top: verticalOffset, left: 0.8, right: 0 };
		textSection = new PdfTextSection();
		textSection.fontSize = normalFontSize;
		textSection.text = _getSignerDescription(signer);
		element.textSections.push(textSection);
		manifestMark.elements.push(element);
		verticalOffset += elementHeight;
	});

	verticalOffset += 1.0;

	elementHeight = 2.5;
	element = new PdfMarkTextElement();
	element.relativeContainer = { height: elementHeight, top: verticalOffset, left: 0, right: 0 };
	textSection = new PdfTextSection();
	textSection.fontSize = normalFontSize;
	textSection.text = `In order to check the signatures, visit ${verificationSiteNameWithArticle} at `;
	element.textSections.push(textSection);
	textSection = new PdfTextSection();
	textSection.fontSize = normalFontSize;
	textSection.color = Color.fromRGBString('#0000FF', 100);
	textSection.text = verificationSite;
	element.textSections.push(textSection);
	textSection = new PdfTextSection();
	textSection.fontSize = normalFontSize;
	textSection.text = ' and inform the code above or access the link below:';
	element.textSections.push(textSection);
	manifestMark.elements.push(element);
	verticalOffset += elementHeight;

	elementHeight = 1.5;
	element = new PdfMarkTextElement();
	element.relativeContainer = { height: elementHeight, top: verticalOffset, left: 0, right: 0 };
	element.align = 'Center';
	textSection = new PdfTextSection();
	textSection.fontSize = normalFontSize;
	textSection.color = Color.fromRGBString('#0000FF', 100);
	textSection.text = verificationLink;
	element.textSections.push(textSection);
	manifestMark.elements.push(element);

	pdfMarker.marks.push(manifestMark);
	const result = await pdfMarker.apply();
	return await result.getContent();
}

function _getDisplayName(cert) {
	if (!cert) return '';
	if (cert.pkiBrazil && cert.pkiBrazil.responsavel) return cert.pkiBrazil.responsavel;
	if (cert.subjectName) return cert.subjectName.commonName || '';
	return '';
}

function _getSignerDescription(signer) {
	let text = _getDisplayName(signer.certificate);
	if (signer.certificate && signer.certificate.pkiBrazil && signer.certificate.pkiBrazil.cpf) {
		text += ` (CPF ${signer.certificate.pkiBrazil.cpfFormatted})`;
	}
	if (signer.signingTime) {
		text += ` on ${moment(signer.signingTime).format(dateFormat)}`;
	}
	return text;
}

module.exports = router;
