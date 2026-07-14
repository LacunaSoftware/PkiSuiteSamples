const express = require('express');
const uuidv4 = require('uuid/v4');
const path = require('path');

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

/**
 * GET /pades-cloud-pwd-restpki
 *
 * Renders the CPF entry form.
 */
router.get('/', (req, res, next) => {
	const { fileId } = req.query;

	if (!StorageMock.existsSync({ fileId: fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}

	res.render('pades-cloud-pwd-restpki', {
		fileId: fileId,
	});
});

/**
 * POST /pades-cloud-pwd-restpki/discover
 *
 * Discovers PSCs that have a certificate containing the provided CPF.
 */
router.post('/discover', async (req, res, next) => {
	const { fileId } = req.query;
	const cpf = req.body.cpf;
	const plainCpf = cpf.replace(/[.-]/g, '');

	try {
		const manager = new TrustServicesManager();

		const services = await manager.discoverByCpf(plainCpf);

		res.render('pades-cloud-pwd-restpki/discover', {
			fileId: fileId,
			cpf: cpf,
			services: services,
		});
	} catch (err) { next(err); }
});

/**
 * POST /pades-cloud-pwd-restpki/complete
 *
 * Authorizes with the chosen PSC using password and performs the PAdES signature.
 */
router.post('/complete', async (req, res, next) => {
	const { fileId } = req.query;
	const { cpf, service, password } = req.body;
	const plainCpf = cpf.replace(/[.-]/g, '');

	try {
		const manager = new TrustServicesManager();

		const result = await manager.passwordAuthorize(
			service, plainCpf, password, TrustServiceSessionTypes.SIGNATURE_SESSION);

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

		await signer.sign(true);

		Util.setExpiredPage(res);

		res.render('pades-cloud-pwd-restpki/complete', {
			signedPdf: outputFile,
		});
	} catch (err) { next(err); }
});

module.exports = router;
