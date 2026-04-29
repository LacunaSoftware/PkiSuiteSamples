const express = require('express');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { StorageMock } = require('../storage-mock');
const { Util } = require('../util');

const router = express.Router();
const APP_ROOT = process.cwd();

const verificationSiteNameWithArticle = 'my Verification Center';
const verificationSite = 'http://localhost:3000';
const verificationLinkFormat = 'http://localhost:3000/check-pades-core?code=';
const normalFontSize = 12;
const dateFormat = 'DD/MM/YYYY HH:mm';
const timeZoneDisplayName = 'Brasilia timezone';

/*
 * GET /printer-version-pades-core
 *
 * Generates a printer-friendly version of a signed PDF using REST PKI Core
 * for both signature inspection and PDF mark application.
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
		.then((pdfBuffer) => {
			res.type('pdf');
			res.setHeader('Content-Disposition', 'filename=printer-friendly.pdf');
			res.send(pdfBuffer);
		})
		.catch((err) => next(err));
});

async function generatePrinterFriendlyVersion(pdfPath, verificationCode) {
	const formattedVerificationCode = Util.formatVerificationCode(verificationCode);
	const verificationLink = verificationLinkFormat + formattedVerificationCode;

	const client = Util.getRestPkiCoreClient();
	const fileContent = fs.readFileSync(pdfPath);
	const fileContentBase64 = fileContent.toString('base64');
	const fileName = path.basename(pdfPath);

	// 1. Inspect the signatures using REST PKI Core.
	const inspectResponse = await client.inspectSignature({
		file: {
			content: fileContentBase64,
			contentType: 'application/pdf',
			name: fileName,
		},
		validate: true,
		securityContextId: Util.getSecurityContextId(),
	});
	const signature = inspectResponse.data;

	// Build the "all pages" message with signer names.
	const signerNames = Util.joinStringPt(signature.signers.map(s => _getDisplayName(s.certificate)));
	const allPagesMessage = `This document was digitally signed by ${signerNames}.\n`
		+ `To check the signatures, visit ${verificationSiteNameWithArticle}`
		+ ` at ${verificationSite} and inform this code ${formattedVerificationCode}.`;

	const icpBrasilBase64 = Util.getIcpBrasilLogoContent().toString('base64');

	const marks = [];

	// Mark on every page: ICP-Brasil logo on the bottom-right corner.
	marks.push({
		pageOption: 'AllPages',
		container: { width: 1, right: 1, height: 1, bottom: 1 },
		backgroundColor: { red: 0, green: 0, blue: 0, alpha: 1 },
		elements: [{
			elementType: 'Image',
			opacity: 75,
			image: { resource: { content: icpBrasilBase64, mimeType: 'image/png' } },
		}],
	});

	// Mark on every page: summary text on the bottom margin.
	marks.push({
		pageOption: 'AllPages',
		container: { left: 1.5, right: 3.5, height: 2, bottom: 0 },
		backgroundColor: { red: 0, green: 0, blue: 0, alpha: 1 },
		elements: [{
			elementType: 'Text',
			opacity: 75,
			textSections: [{ text: allPagesMessage }],
		}],
	});

	// Mark on every page: summary text on the right margin, rotated 90°.
	marks.push({
		pageOption: 'AllPages',
		container: { width: 2, right: 0, top: 1.5, bottom: 3.5 },
		backgroundColor: { red: 0, green: 0, blue: 0, alpha: 1 },
		elements: [{
			elementType: 'Text',
			rotation: 90,
			opacity: 75,
			textSections: [{ text: allPagesMessage }],
		}],
	});

	// 2. Build the manifest mark on a new page.
	let verticalOffset = 0;
	const manifestElements = [];

	// ICP-Brasil logo top-left.
	manifestElements.push({
		elementType: 'Image',
		relativeContainer: { height: 3, top: verticalOffset, width: 3, left: 0 },
		image: { resource: { content: icpBrasilBase64, mimeType: 'image/png' } },
	});

	// QR code with verification link top-right.
	manifestElements.push({
		elementType: 'QRCode',
		relativeContainer: { height: 3, top: verticalOffset, width: 3, right: 0 },
		qrCodeData: verificationLink,
	});

	// "SIGNATURE CHECK" header centered between logo and QR code.
	manifestElements.push({
		elementType: 'Text',
		relativeContainer: { height: 3, top: verticalOffset + 0.2, left: 0, right: 0 },
		align: 'Center',
		textSections: [{ text: 'SIGNATURE\nCHECK', fontSize: normalFontSize * 1.6 }],
	});
	verticalOffset += 3 + 1.7;

	// Verification code.
	manifestElements.push({
		elementType: 'Text',
		relativeContainer: { height: 2, top: verticalOffset, left: 0, right: 0 },
		align: 'Center',
		textSections: [{ text: `Verification code: ${formattedVerificationCode}`, fontSize: normalFontSize * 1.2 }],
	});
	verticalOffset += 2;

	// Introductory paragraph.
	manifestElements.push({
		elementType: 'Text',
		relativeContainer: { height: 2.5, top: verticalOffset, left: 0, right: 0 },
		textSections: [{
			text: `This document was digitally signed by the following signers on the indicated dates (${timeZoneDisplayName}):`,
			fontSize: normalFontSize,
		}],
	});
	verticalOffset += 2.5;

	// One row per signer with validity icon and description.
	for (const signer of signature.signers) {
		const isValid = !signer.validationResults
			|| !(signer.validationResults.errors && signer.validationResults.errors.length > 0);
		const iconBase64 = Util.getValidationResultIcon(isValid).toString('base64');

		manifestElements.push({
			elementType: 'Image',
			relativeContainer: { height: 0.5, top: verticalOffset + 0.2, width: 0.5, left: 0 },
			image: { resource: { content: iconBase64, mimeType: 'image/png' } },
		});
		manifestElements.push({
			elementType: 'Text',
			relativeContainer: { height: 1.5, top: verticalOffset, left: 0.8, right: 0 },
			textSections: [{ text: _getSignerDescription(signer), fontSize: normalFontSize }],
		});
		verticalOffset += 1.5;
	}

	verticalOffset += 1.0;

	// Paragraph with link to verification site.
	const blue = { red: 0, green: 0, blue: 255, alpha: 100 };
	manifestElements.push({
		elementType: 'Text',
		relativeContainer: { height: 2.5, top: verticalOffset, left: 0, right: 0 },
		textSections: [
			{ text: `In order to check the signatures, visit ${verificationSiteNameWithArticle} at `, fontSize: normalFontSize },
			{ text: verificationSite, fontSize: normalFontSize, color: blue },
			{ text: ' and inform the code above or access the link below:', fontSize: normalFontSize },
		],
	});
	verticalOffset += 2.5;

	// Verification link.
	manifestElements.push({
		elementType: 'Text',
		relativeContainer: { height: 1.5, top: verticalOffset, left: 0, right: 0 },
		align: 'Center',
		textSections: [{ text: verificationLink, fontSize: normalFontSize, color: blue }],
	});

	marks.push({
		pageOption: 'NewPage',
		container: { top: 1.5, bottom: 1.5, left: 1.5, right: 1.5 },
		elements: manifestElements,
	});

	// 3. Apply all marks using REST PKI Core.
	const addMarksResponse = await client.addPdfMarks({
		file: {
			content: fileContentBase64,
			contentType: 'application/pdf',
			name: fileName,
		},
		marks,
		measurementUnits: 'Centimeters',
	});

	// The response file can be returned as inline base64 content or as a URL to download.
	const fileModel = addMarksResponse.data.file;
	if (fileModel.content) {
		return Buffer.from(fileModel.content, 'base64');
	}
	const download = await fetch(fileModel.url);
	return Buffer.from(await download.arrayBuffer());
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
