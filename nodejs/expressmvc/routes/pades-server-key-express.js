const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const { Pkcs12Generator } = require("pki-express");
const {
	StandardSignaturePolicies,
	PadesSigner,
} = require('pki-express');
const { PadesVisualElementsExpress } = require('../pades-visual-elements-express');

const { Config } = require('../config');
const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();

/**
 * GET /pades-server-key-express
 *
 * This route only renders the signature page.
 */
router.get('/', async (req, res, next) => {
	// Get parameters from url
	const { fileId, certId } = req.query;

	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({ fileId: fileId })) {
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

	// Set PDF to be signed.
	await signer.setPdfToSignFromPath(StorageMock.getDataPath(fileId));

	// Set the PKCS #12 certificate path. We have an logic for choosing the generate the PKCS #12
	// from "issue certificate" samples or a sample PKCS #12.
	if (certId) {
		// Verify if the provided certId refers to an existing certificate file and
		// key.
		if (!StorageMock.existsSync({fileId: certId, extension: '.json'}) ||
			 !StorageMock.existsSync({fileId: certId, extension: '.cer'})) {
			let notFound = new Error(`The PKI files referred by certId: ${certId} were not found`);
			notFound.status = 404;
			next(notFound);
			return;
		}

		// Get PKCS#12 password from global configuration.
		const pkcs12Password = Config.getInstance().get('pkcs12Password');

		// Generate PKCS #12. We have encapsulated this operation on generatePkcs12() method.
		let pkcs12GenResult = await generatePkcs12(certId, pkcs12Password);

		// Set the generated PKCS #12 and its password on PadesSigner instance.
		await signer.setPkcs12FromRaw(pkcs12GenResult.getPfx().getContentRaw());
		signer.certPassword = pkcs12Password;
	} else {
		// Set sample PKCS #12 path.
		await signer.setPkcs12FromPath(StorageMock.getSamplePkcs12Path());
		signer.certPassword = '1234';
	}

	// Set a file reference for the stamp file. Note that file can be
	// referenced later by "fref://{alias}" at the "url" field on the visual
	// representation (see public/vr.json or getVisualRepresentation()
	// method).
	await signer.addFileReference('stamp', StorageMock.getPdfStampPath());

	// Set visual reference. We provide a dictionary that represents the
	// visual representation JSON model.
	await signer.setVisualRepresentation(PadesVisualElementsExpress.getVisualRepresentation());

	// Generate path for output file and add the signature finisher.
	const outputFile = `${uuidv4()}.pdf`;
	StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
	signer.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

	// Perform the signature.
	let signerCert = await signer.sign(true);

	// Render the result page.
	res.render('pades-server-key-express', {
		signedPdf: outputFile,
		signer: signerCert,
	});
});

async function generatePkcs12(certId, password) {
	// Get an instance of the Pkcs12Generator class, responsible for generate
	// a PKCS #12 from a generated key and certificate file. This certificate
	// will be used to sign the uploaded PDF.
	let keyJson = StorageMock.readSync(certId, '.json').toString('utf-8');
	let pkcs12Generator = new Pkcs12Generator({
		key: keyJson
	});

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(pkcs12Generator);

	// Set the certificate file.
	pkcs12Generator.setCertFileFromPathSync(StorageMock.getDataPath(certId, '.cer'));

	// Generate PKCS #12 file using the default password.
	return await pkcs12Generator.generate(password);
}

module.exports = router;
