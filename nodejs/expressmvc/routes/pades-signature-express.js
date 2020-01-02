const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const {
	PadesSignatureStarter,
	StandardSignaturePolicies,
	SignatureFinisher
} = require('pki-express');

const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');
const { PadesVisualElementsExpress } = require('../pades-visual-elements-express');

const router = express.Router();
const APP_ROOT = process.cwd();

/**
 * GET /pades-signature-express
 *
 * This route only renders the signature page.
 */
router.get('/', (req, res, next) => {

	// Get parameters from url
	const fileId = req.query['fileId'];

	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({fileId: fileId})) {
		let notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}

	res.render('pades-signature-express', { fileId });
});

/**
 * POST /pades-signature-express/start
 *
 * This route starts the signature. In this sample, it will be called
 * programatically after the user press the "Sign File" button (see method
 * readCertificate() on public/javascripts/signature-start-form.js).
 */
router.post('/start', (req, res, next) => {

	let fileId = req.query['fileId'];

	// Recover variables from the POST arguments to be use don this step.
	let certThumb = req.body['certThumbField'];
	let certContent = req.body['certContentField'];

	// Get an instantiate of the PadesSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	let signatureStarter = new PadesSignatureStarter();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signatureStarter);

	// Set signature policy.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.PADES_BASIC_WITH_LTV;

	// Set PDF to be signed.
	signatureStarter.setPdfToSignFromPathSync(StorageMock.getDataPath(fileId));

	// Set Base64-encoded certificate's content to signature starter.
	signatureStarter.setCertificateFromBase64Sync(certContent);

	// Set a file reference for the stamp file. Note that this file can be
	// referenced later by "fref://{alias}" at the "url" field on the
	// visual representation (see public/vr.json or
	// getVisualRepresentation() method).
	signatureStarter.addFileReferenceSync('stamp', StorageMock.getPdfStampPath());

	// Set the visual representation. We provided a dictionary that
	// represents the visual representation JSON model.
	signatureStarter.setVisualRepresentationSync(PadesVisualElementsExpress.getVisualRepresentation());

	// Start the signature process.
	signatureStarter.start()
		.then(response => {

		// Receive as response the following fields:
		// - toSignHash: The hash to be signed.
		// - digestAlgorithm: The digest algorithm that will inform the Web PKI
		//                    component to compute this signature.
		// - transferFile: A temporary file to be passed to "complete" step.
		let toSignHash = response.toSignHash;
		let digestAlgorithm = response.digestAlgorithm;
		let transferFile = response.transferFile;

		// Render the field from start() method as hidden field to be used on
		// the javascript or on the "complete" step.
		res.render('pades-signature-express/start', {
			toSignHash: toSignHash,
			digestAlgorithm: digestAlgorithm,
			transferFile: transferFile,
			certThumb: certThumb,
			fileId: fileId
		});

	}).catch(err => next(err));
});

/**
 * POST pades-signature-express/complete
 *
 * This route completes the signature, it will be called programatically after
 * the Web PKI component perform the signature and submit the form (see method
 * sign() on public/javascripts/signature-complete-form.js).
 */
router.post('/complete', (req, res, next) => {

	let fileId = req.query['fileId'];

	// Recover variables from the POST arguments to be used on this step.
	let transferFile = req.body['transferFileField'];
	let signature = req.body['signatureField'];

	// Get an instance of the PadesSignatureFinisher class, responsible for
	// completing the signature process.
	let signatureFinisher = new SignatureFinisher();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signatureFinisher);

	// Set PDF to be signed. It's the same file we used on "start" step.
	signatureFinisher.setFileToSignFromPathSync(StorageMock.getDataPath(fileId));

	// Set transfer file.
	signatureFinisher.setTransferFileFromPathSync(transferFile);

	// Set signature.
	signatureFinisher.signature = signature;

	// Generate path for output file and add the signature finisher.
	StorageMock.createAppData(); // Make sure the "app-data" folder exists.
	let outputFile = uuidv4() + '.pdf';
	signatureFinisher.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

	// Complete the signature process.
	signatureFinisher
		.complete(getCert=true)
		.then((result) => {

			// After complete the signature, render the result page, passing the
			// outputFile containing the signed file.
			let certificate = result
			res.render('pades-signature-express/complete', {
				signedPdf: outputFile,
				signerCert: certificate
			});

		})
		.catch(err => next(err));

});

module.exports = router;
