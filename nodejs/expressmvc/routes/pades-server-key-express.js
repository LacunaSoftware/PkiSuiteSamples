const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const {
	StandardSignaturePolicies,
	PadesSigner,
} = require('pki-express');
const { PadesVisualElementsExpress } = require('../pades-visual-elements-express');

const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();

/**
 * GET /pades-server-key-express
 *
 * This route only renders the signature page.
 */
router.get('/', (req, res, next) => {
	// Get parameters from url
	const { fileId } = req.query;

	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}

	// Get an instance of the PadesSigner class, responsible for receiving
	// the signature elements and performing the local signature.
	const signer = new PadesSigner();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signer);

	// Set signature policy.
	signer.signaturePolicy = StandardSignaturePolicies.PADES_BASIC_WITH_LTV;

	const outputFile = `${uuidv4()}.pdf`;
	// Process all independent IO operations in parallel. This should happen
	// before the method "sign" to be called.
	Promise.all([

		// Set PDF to be signed.
		signer.setPdfToSignFromPath(StorageMock.getDataPath(fileId)),

		// Set a file reference for the stamp file. Note that file can be
		// referenced later by "fref://{alias}" at the "url" field on the visual
		// representation (see public/vr.json or getVisualRepresentation()
		// method).
		signer.addFileReferenceSync('stamp', StorageMock.getPdfStampPath()),

		// Set visual reference. We provide a dictionary that represents the
		// visual representation JSON model.
		signer.setVisualRepresentation(PadesVisualElementsExpress.getVisualRepresentation()),

		// The PKCS #12 certificate path.
		signer.setPkcs12FromPath(path.join(APP_ROOT, 'public', 'Pierre de Fermat.pfx')),

	]).then(() => {
		// Set the certificate's PIN.
		signer.certPassword = '1234';

		// Generate path for output file and add the signature finisher.
		StorageMock.createAppData(); // Make sure the "app-data" folder exists.
		signer.outputFile = path.join(APP_ROOT, 'app-data', outputFile);
		// Perform the signature.
		const getCert = true;
		return signer.sign(getCert).then((result) => result);
	}).then((result) => {
		// Render the result page.
		res.render('pades-server-key-express', {
			signedPdf: outputFile,
			signer: result,
		});
	}).catch((err) => next(err));
});

module.exports = router;
