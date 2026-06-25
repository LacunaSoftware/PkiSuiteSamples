const path = require('path');
const express = require('express');
const uuidv4 = require('uuid/v4');

const {
	StandardSignaturePolicies,
	PadesSigner,
	TrustServicesManager,
	TrustServiceSessionTypes,
} = require('pki-express');

const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');
const { PadesVisualElementsExpress } = require('../pades-visual-elements-express');

const router = express.Router();
const APP_ROOT = process.cwd();

const REDIRECT_URL = 'http://localhost:3000/tsp-callback';

/**
 * GET /pades-cloud-oauth-core
 *
 * Renders the provider selection page for OAuth-based cloud certificate signing.
 */
router.get('/', async (req, res, next) => {
	const { fileId } = req.query;

	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}

	try {
		const manager = new TrustServicesManager();
		Util.setPkiDefaults(manager);

		const sessionType = TrustServiceSessionTypes.SIGNATURE_SESSION;
		const sessionId = uuidv4();

		const result = await manager.startAuth(REDIRECT_URL, sessionType, null, sessionId);
		const authParameters = result.authParameters;

		res.render('pades-cloud-oauth-core', { fileId, authParameters, sessionId });
	} catch (err) {
		next(err);
	}
});

/**
 * POST /pades-cloud-oauth-core
 *
 * Completes the OAuth flow and performs the PAdES signature.
 */
router.post('/', async (req, res, next) => {
	const code = req.body.codeField;
	const state = req.body.stateField;
	const fileId = req.body.fileIdField;

	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}

	try {
		const manager = new TrustServicesManager();
		Util.setPkiDefaults(manager);

		const result = await manager.completeAuth(code, state);

		const signer = new PadesSigner();
		Util.setPkiDefaults(signer);

		signer.signaturePolicy = StandardSignaturePolicies.PADES_BASIC_WITH_LTV;
		await signer.setPdfToSignFromPath(StorageMock.getDataPath(fileId));
		signer.trustServiceSession = result.session;

		await signer.addFileReference('stamp', StorageMock.getPdfStampPath());
		await signer.setVisualRepresentation(PadesVisualElementsExpress.getVisualRepresentation());

		const outputFile = `${uuidv4()}.pdf`;
		StorageMock.createAppDataSync();
		signer.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

		const signerCert = await signer.sign(true);

		Util.setExpiredPage(res);

		res.render('pades-cloud-oauth-core/complete', { signedPdf: outputFile, signerCert });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
