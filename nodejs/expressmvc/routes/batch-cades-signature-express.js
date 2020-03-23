const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const {
	CadesSignatureStarter,
	StandardSignaturePolicies,
	SignatureFinisher
} = require('pki-express');

const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();


/**
 * GET /batch-cades-signature-express
 *
 * This method renders the batch signature page.
 *
 * Notice that the only thing we'll do on the server-side at this point is
 * determine the IDs of the documents to be signed. The page will handle each
 * document one by one and will call the server asynchronously to start and
 * complete each signature.
 */
router.get('/', (req, res) => {
	// It is up to your application's business logic to determine which documents
	// will compose the batch.
	const documentsIds = Util.range(1, 30);

	// Render the batch signature page.
	res.render('batch-cades-signature-express', {
		documentsIds,
	});
});

/**
 * POST /batch-cades-signature-express/start
 *
 * This method is called asynchronously via AJAX by the batch signature page
 * for each document being signed. It receives the ID of the document and
 * initiates a CAdES signature using PKI Express and returns a JSON with the
 * data needed in the next signature steps (see
 * batch-signature-express-form.js).
 */
router.post('/start', (req, res, next) => {
	// Get the parameters for this signature (received from the POST call via
	// AJAX, see batch-signature-form.js).
	const { id } = req.body;
	const { certContent } = req.body;

	// Get an instantiate of the CadesSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const signatureStarter = new CadesSignatureStarter();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signatureStarter);

	// Set signature policy.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.PKI_BRAZIL_CADES_ADR_BASICA;

	// Set the document to be signed based on its ID.
	signatureStarter.setFileToSignFromPathSync(StorageMock.getBatchDocPath(id));

	// Set Base64-encoded certificate's content to signature starter.
	signatureStarter.setCertificateFromBase64Sync(certContent);

	// Optionally, set whether the content should be encapsulated in the
	// resulting CMS. If this parameter is ommitted, the following rules
	// apply:
	// - If no CmsToCoSign is given, the resulting CMS will include the
	// content.
	// - If a CmsToCoSign is given, the resulting CMS will include the
	// content if and only if the CmsToCoSign also includes the content.
	signatureStarter.setEncapsulatedContent(true);

	// Start the signature process. Receive as response the following fields:
	// - toSignHash: The hash to be signed.
	// - digestAlgorithm: The digest algorithm that will inform the Web PKI
	//                    component to compute this signature.
	// - transferFile: A temporary file to be passed to "complete" step.
	signatureStarter.start()
		// Respond this request with the fields received from start() method to
		// be used on the javascript or on the complete action.
		.then((response) => res.json(response))
		.catch((err) => next(err));
});

/**
 * POST /batch-cades-signature-express/complete
 *
 * This method is called asynchronously via AJAX by the batch signature page
 * for each document being signed. We'll cal PKI Express to complete this
 * signature and return a JSON with the save filename so that the page a link
 * to it.
 */
router.post('/complete', (req, res, next) => {
	// Get the parameters for this signature (received from the POST call via
	// AJAX, see batch-signature-form.js).
	const { id } = req.body;
	const { transferFile } = req.body;
	const { signature } = req.body;

	// Get an instance of the SignatureFinisher class, responsible for
	// completing the signature process.
	const signatureFinisher = new SignatureFinisher();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signatureFinisher);

	// Set the file to be signed. It's the same file we used on "start"
	// method.
	signatureFinisher.setFileToSignFromPathSync(StorageMock.getBatchDocPath(id));

	// Set the transfer file.
	signatureFinisher.setTransferFileFromPathSync(transferFile);

	// Set the signature file.
	signatureFinisher.signature = signature;

	// Generate path for output file and add to the signature finisher.
	StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists (util.js).
	const outputFile = `${uuidv4()}.p7s`;
	signatureFinisher.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

	// Call the finish() method, which finalizes the signature process.
	signatureFinisher.complete()
		// Render a JSON with the saved filename (the page wil use jQuery to
		// decode this value).
		.then(() => res.json(outputFile))
		.catch((err) => next(err));
});

module.exports = router;
