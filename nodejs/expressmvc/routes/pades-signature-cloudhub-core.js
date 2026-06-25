const express = require('express');
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');

const { CloudHubClient, TrustServiceSessionTypes } = require('cloudhub-client');
const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();

const cloudhubClient = Util.getCloudhubClient();

/**
 * GET /pades-signature-cloudhub-core
 *
 * Renders the CPF entry page for CloudHub-based cloud certificate signing with REST PKI Core.
 */
router.get('/', async (req, res, next) => {
	try {
		res.render('pades-signature-cloudhub-core', { fileId: req.query.fileId });
	} catch (err) {
		next(err);
	}
});

/**
 * POST /pades-signature-cloudhub-core
 *
 * Creates a CloudHub session with the given CPF and renders the service selection page.
 */
router.post('/', async (req, res, next) => {
	try {
		const cpf = req.body.cpf;
		const fileId = req.query.fileId;
		const plainCpf = cpf.replace(/[.-]/g, '');

		const sessionRes = await cloudhubClient.createSessionAsync({
			identifier: plainCpf,
			redirectUri: `http://localhost:3000/pades-signature-cloudhub-core/session-result?fileId=${fileId}`,
			type: TrustServiceSessionTypes.SingleSignature,
		});

		res.render('pades-signature-cloudhub-core/service-select', { sessionRes, fileId });
	} catch (err) {
		next(err);
	}
});

/**
 * GET /pades-signature-cloudhub-core/session-result
 *
 * Retrieves the certificate from CloudHub, prepares the signature with REST PKI Core,
 * signs the hash via CloudHub, and completes the signature with REST PKI Core.
 */
router.get('/session-result', async (req, res, next) => {
	try {
		const session = req.query.session;
		const fileId = req.query.fileId;

		// Get the signer certificate from CloudHub
		const cert = await cloudhubClient.getCertificateAsync(session);

		// Read the PDF to sign
		const fileContent = StorageMock.readSync(fileId);
		const fileContentBase64 = fileContent.toString('base64');

		// Prepare the signature with REST PKI Core
		const client = Util.getRestPkiCoreClient();
		const prepareResponse = await client.prepareSignature({
			file: {
				content: fileContentBase64,
				contentType: 'application/pdf',
				name: `${fileId}.pdf`,
			},
			certificate: {
				content: cert,
			},
			securityContextId: Util.getSecurityContextId(),
			pdfSignatureOptions: {
				visualRepresentation: {
					text: {
						text: 'Signed by {{name}} ({{national_id}})',
						fontSize: 13.0,
						includeSigningTime: true,
						horizontalAlign: 'Left',
						container: { left: 0.2, top: 0.2, right: 0.2, bottom: 0.2 },
					},
					resource: {
						content: StorageMock.getPdfStampContent().toString('base64'),
						mimeType: 'image/png',
					},
					horizontalAlign: 'Right',
					verticalAlign: 'Center',
					position: {
						pageNumber: 0,
						auto: {
							container: { left: 0.2, top: 0.2, right: 0.2, bottom: 0.2 },
							signatureRectangleSize: { height: 20, width: 30 },
						},
					},
				},
			},
		});

		// Sign the hash using CloudHub
		const toSignHash = prepareResponse.data.toSignHash.value;
		const digestAlgorithmOid = prepareResponse.data.toSignHash.algorithm;

		const signedHash = await cloudhubClient.signHashAsync({
			hash: toSignHash,
			digestAlgorithmOid,
			session,
		});

		// Complete the signature with REST PKI Core
		const completeResponse = await client.completeSignature({
			state: prepareResponse.data.state,
			signature: signedHash,
		});

		// Download the signed PDF and save locally
		const signedFileUrl = completeResponse.data.signedFile.location;
		const response = await fetch(signedFileUrl);
		if (!response.ok) {
			throw new Error(`Failed to download signed file: ${response.status} ${response.statusText}`);
		}
		const signedFileBuffer = Buffer.from(await response.arrayBuffer());

		const outputFile = `${uuidv4()}.pdf`;
		StorageMock.createAppDataSync();
		fs.writeFileSync(path.join(APP_ROOT, 'app-data', outputFile), signedFileBuffer);

		res.render('pades-signature-cloudhub-core/complete', {
			signedPdf: outputFile,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
