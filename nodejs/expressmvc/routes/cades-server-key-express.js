const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const {
	StandardSignaturePolicies,
	CadesSigner,
} = require('pki-express');

const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();

/**
 * GET /cades-server-key-express
 *
 * This route performs a CAdES signature with a key stored on server and
 * renders the signature result page.
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

	// Get an instance of the CadesSigner class, responsible for receiving
	// the signature elements and performing the local signature.
	const signer = new CadesSigner();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signer);

	// Set signature policy.
	signer.signaturePolicy = StandardSignaturePolicies.PKI_BRAZIL_CADES_ADR_BASICA_WITH_REVOCATION_VALUE;

	const outputFile = `${uuidv4()}.p7s`;

	// Process all independent IO operations in parallel. This should happen
	// before the method "sign" to be called.
	Promise.all([

		// Set PDF to be signed.
		signer.setFileToSignFromPathSync(StorageMock.getDataPath(fileId)),

		// The PKCS #12 certificate path.
		signer.setPkcs12FromPath(path.join(APP_ROOT, 'public', 'Pierre de Fermat.pfx')),

	]).then(() => {
		// Set the certificate's PIN.
		signer.certPassword = '1234';

		// Set 'encapsulate content' option (default: True).
		signer._encapsulatedContent = true;

		// Generate path for output file and add the signature finisher.
		StorageMock.createAppData(); // Make sure the "app-data" folder exists.
		signer.outputFile = path.join(APP_ROOT, 'app-data', outputFile);
		// Perform the signature.
		const getCert = true;
		return signer.sign(getCert).then((result) => result);
	}).then((certificate) => {
		// Render the result page.
		res.render('cades-server-key-express', {
			cmsFile: outputFile,
			signerCert: certificate,
		});
	}).catch((err) => next(err));
});

module.exports = router;
