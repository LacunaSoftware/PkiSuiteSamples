const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const { PadesSignatureStarter, StandardSignaturePolicies, PadesSignatureFinisher } = require('restpki-client');

const { Util } = require('../util');
const { PadesVisualElementsRestPki } = require('../pades-visual-elements-restpki');
const { StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();

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
router.get('/', (req, res) => {
	// It is up to your application's business logic to determine which documents
	// will compose the batch.
	const documentsIds = Util.range(1, 30);

	res.render('batch-pades-signature-restpki', {
		documentsIds,
	});
});

/**
 * POST /batch-signature/start
 *
 * This route is called asynchronously via AJAX by the batch signature page for
 * each document being signed. It receives the ID of the document and the
 * signer's certificate content and initiates a PAdES signature using
 * REST PKI and returns a JSON with the parameters for the client-side
 * signature using Web PKI (see batch-signature-form.js).
 */
router.post('/start', (req, res, next) => {
	// Get the parameters for this signature (received from the POST call via
	// AJAX, see batch-signature-form.js).
	const { id } = req.body;

	// Get an instantiate of the PadesSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const signatureStarter = new PadesSignatureStarter(Util.getRestPkiClient());

	// Set signature policy.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.PADES_BASIC;

	// Set PDF to be signed.
	signatureStarter.setPdfToSignFromPath(StorageMock.getBatchDocPath(id));

	// Set Base64-encoded certificate's content to signature starter.
	signatureStarter.securityContext = Util.getSecurityContextId();

	// Set the visual representation to the signature. We have encapsulated this
	// code (on pades-visual-elements.js) to be used on various PAdES examples.
	PadesVisualElementsRestPki.getVisualRepresentation()
		.then((visualRepresentation) => {
			// Set the visual representation to signatureStarter.
			signatureStarter.visualRepresentation = visualRepresentation;

			// Call the startWithWebPki() method, which initiates the signature.
			// This yields the token, a 43-character case-sensitive URL-safe
			// string, which identifies this signature process. We'll use this
			// value to call the signWithRestPki() method on the WebPKI component
			// (see public/js/signature-form.js) and also to complete the signature
			// after the form is submitted (see post method). This should not be
			// mistaken with the API access token.
			return signatureStarter.startWithWebPki();
		})
		.then((result) => {
			// Respond this request with the fields received from start() method to
			// be used on the javascript or on the complete action.
			res.json(result.token);
		})
		.catch((err) => next(err));
});

/**
 * POST batch-signature/complete
 *
 * This route is called asynchronously via AJAX by the batch signature page for
 * each document being signed. It receives the ID of the document, the computed
 * signature and the transfer file, received on start action. We'll call REST
 * PKI to complete this signature and return a JSON with the saved filename so
 * that the page can render a link to it.
 */
router.post('/complete', (req, res, next) => {
	// Get an instance of the PadesSignatureFinisher class, responsible for
	// completing the signature process.
	const signatureFinisher = new PadesSignatureFinisher(Util.getRestPkiClient());

	// Set the token.
	signatureFinisher.token = req.body.token;

	// Call the finish() method, which finalizes the signature process and
	// returns the SignatureResult object.
	signatureFinisher.finish()
		.then((result) => {
			// At this point, you'd typically store the signed PDF on you database.
			// For demonstration purposes, we'll store the PDF on a temporary
			// folder publicly accessible and render a link to it.

			StorageMock.createAppData(); // Make sure the "app-data" folder exists.
			const filename = `${uuidv4()}.pdf`;

			// The SignatureResult object has functions for writing the signature
			// file to a local life (writeToFile()) and to get its raw contents
			// (getContent()). For large files, use writeToFile() in order to avoid
			// memory allocation issues.
			result.writeToFileSync(path.join(APP_ROOT, 'app-data', filename));

			// Render the result page, showing the signed file and the signer
			// certification info.
			res.json(filename);
		})
		.catch((err) => next(err));
});

module.exports = router;
