const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const { PadesSignatureStarter, StandardSignaturePolicies, SignatureFinisher } = require('pki-express');

const { Util } = require('../util');
const { PadesVisualElementsExpress } = require('../pades-visual-elements-express');
const { StorageMock } = require('../storage-mock');

let router = express.Router();
let appRoot = process.cwd();

/**
 * GET /batch-signature
 *
 * This action renders the batch signature page.
 *
 * Notice that the only thing we'll do on the server-side at this point is
 * determine the IDs of the documents to be signed. The page will handle each
 * document one by one and will call the server asynchronously to start and
 * complete each signature.
 */
router.get('/', (req, res, next) => {

	// It is up to your application's business logic to determine which documents
	// will compose the batch.
	let documentsIds = Util.range(1, 30);

	res.render('batch-pades-signature-express', {
		documentsIds: documentsIds
	});
});

/**
 * POST /batch-signature/start
 *
 * This route is called asynchronously via AJAX by the batch signature page for
 * each document being signed. It receives the ID of the document and the
 * signer's certificate content and initiates a PAdES signature using
 * PKI Express and returns a JSON with the parameters for the client-side
 * signature using Web PKI (see batch-signature-form.js).
 */
router.post('/start', (req, res, next) => {

	// Get the parameters for this signature (received from the POST call via
	// AJAX, see batch-signature-form.js).
	let id = req.body['id'];
	let certContent = req.body['certContent'];

	// Get an instantiate of the PadesSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	let signatureStarter = new PadesSignatureStarter();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signatureStarter);

	// Set signature policy.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.PADES_BASIC_WITH_LTV;

	// Set PDF to be signed.
	signatureStarter.setPdfToSignFromPathSync(StorageMock.getBatchDocPath(id));

	// Set Base64-encoded certificate's content to signature starter.
	signatureStarter.setCertificateFromBase64Sync(certContent);

	// Set a file reference for the stamp file. Note that this file can be
	// referenced later by "fref://{alias}" at the "url" field on the visual
	// representation (see public/vr.json or getVisualRepresentation()
	// method).
	signatureStarter.addFileReferenceSync('stamp', StorageMock.getPdfStampPath());

	// Set the visual representation. We provided a dictionary that represents
	// the visual representation JSON model.
	signatureStarter.setVisualRepresentationSync(PadesVisualElementsExpress.getVisualRepresentation());

	// Start the signature process. Receive as response the following fields:
	// - toSignHash: The hash to be signed.
	// - digestAlgorithm: The digest algorithm that will inform the Web PKI
	//                    component to compute this signature.
	// - transferFile: A temporary file to be passed to "complete" step.
	signatureStarter.start()
		.then(response => {

			// Respond this request with the fields received from start() method to
			// be used on the javascript or on the complete action.
			res.json(response);
		})
		.catch(err => next(err));

});

/**
 * POST batch-signature/complete
 *
 * This route is called asynchronously via AJAX by the batch signature page for
 * each document being signed. It receives the ID of the document, the computed
 * signature and the transfer file, received on start action. We'll call PKI
 * Express to complete this signature and return a JSON with the saved filename
 * so that the page can render a link to it.
 */
router.post('/complete', (req, res, next) => {

	let outputFile = null;

	// Get the parameters for this signature (received from the POST call via
	// AJAX, see batch-signature-form.js).
	let id = req.body['id'];
	let transferFile = req.body['transferFile'];
	let signature = req.body['signature'];

	// Get an instance of the PadesSignatureFinisher class, responsible for
	// completing the signature process.
	let signatureFinisher = new SignatureFinisher();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signatureFinisher);

	// Set PDF to be signed. It's the same file we used on "start" method.
	signatureFinisher.setFileToSignFromPathSync(StorageMock.getBatchDocPath(id));

	// Set transfer file.
	signatureFinisher.setTransferFileFromPathSync(transferFile);

	// Set signature.
	signatureFinisher.signature = signature;

	// Generate path for output file and add the signature finisher.
	StorageMock.createAppData(); // Make sure the "app-data" folder exists (util.js).
	outputFile = uuidv4() + '.pdf';
	signatureFinisher.outputFile = path.join(appRoot, 'app-data', outputFile);

	// Complete the signature process.
	signatureFinisher.complete()
		.then(() => {
			// Render a JSON with the saved filename (the page wil use jQuery to
			// decode this value).
			res.json(outputFile);
		})
		.catch(err => next(err));

});

module.exports = router;
