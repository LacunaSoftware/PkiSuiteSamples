const express = require("express");
const path = require("path");
const uuidv4 = require("uuid/v4");
const {
	PadesSignatureStarter,
	StandardSignaturePolicies,
	PadesSignatureFinisher,
} = require("restpki-client");
const {
	RestPkiCoreClient,
	PrepareSignatureRequest,
	CompleteSignatureRequest,
} = require("restpki-core-client");

const { Util } = require('../util');
const { PadesVisualElementsRestPki } = require('../pades-visual-elements-restpki');
const { StorageMock } = require('../storage-mock');
const fs = require('fs');

const router = express.Router();
const APP_ROOT = process.cwd();

/**
 * GET /batch-pades-signature-core
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

	res.render('batch-pades-signature-core', {
		documentsIds,
	});
});

/**
 * POST /batch-pades-signature-core/start
 *
 * This route is called asynchronously via AJAX by the batch signature page for
 * each document being signed. It receives the ID of the document and the
 * signer's certificate content and initiates a PAdES signature.
 */
router.post('/start', (req, res, next) => {
	// Get the parameters for this signature (received from the POST call via
	// AJAX, see batch-signature-form.js).
	const { id } = req.body;
	const { certContent } = req.body;

	// Get an instantiate of the PadesSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const client = Util.getRestPkiCoreClient();
	const request = new PrepareSignatureRequest();

	// Set signature policy.	
	request.signaturePolicy = StandardSignaturePolicies.PADES_BASIC;
	request.certificate = {
		content: certContent,
	};

	filePath = StorageMock.getBatchDocPath(id);
	fileContent = fs.readFileSync(filePath, 'base64');

	// Set PDF to be signed.
	request.file = {
		content: fileContent,
		contentType: "application/pdf",
		name: `${id}.pdf`,
	};

	// Set security context to determine trust.
	request.securityContextId = "d480958c-59b0-4178-bd11-0198188bfd3c"

	request.certificate = {
		content: req.body.certContent,
	};

	// Set the visual representation to the signature. We have encapsulated this
	// code (on pades-visual-elements.js) to be used on various PAdES examples.
	request.visualRepresentation = PadesVisualElementsRestPki.getVisualRepresentation();

	return client.prepareSignature(request).then((result) => {
		// return the certificate thumbprint, state, toSignHash, digestAlgorithm to the client
		res.json({
			state: result.data.state,
			hash: result.data.toSignHash.value,
			digestAlgorithm: result.data.toSignHash.algorithm,
		});
	})
	.catch((err) => {
		const status = err && err.statusCode ? err.statusCode : 500;
		const details = {
			message: 'REST PKI Core prepareSignature failed',
			statusCode: err && err.statusCode,
			body: err && err.body,
		};
		console.error('REST PKI Core error on /start:', details);
		res.status(status).json(details);
	});
});

/**
 * POST /batch-pades-signature-core/complete
 *
 * This route is called asynchronously via AJAX by the batch signature page for
 * each document being signed. It receives the ID of the document, the computed
 * signature and the state, received on start action. We'll call REST
 * PKI Core to complete this signature and return a JSON with the saved filename so
 * that the page can render a link to it.
 */
router.post('/complete', (req, res, next) => {
	// Get the parameters for this signature (received from the POST call via
	// AJAX, see batch-signature-form.js).
	const { signature } = req.body;
	const { state } = req.body;

	// Get an instance of the PadesSignatureFinisher class, responsible for
	// completing the signature process.
	const client = Util.getRestPkiCoreClient();
	const request = new CompleteSignatureRequest();

	// set the signature and state
	request.signature = signature;
	request.state = state;

	return client.completeSignature(request).then((result) => {
		// get the signed file location and give it a random filename
		const signedFileLocation = result.data.signedFile.location;
		const filename = `${uuidv4()}.pdf`;
		// return the filename and the location to the client
		res.json({
			filename: filename,
			location: signedFileLocation,
		});
	})
	.catch((err) => {
		const status = err && err.statusCode ? err.statusCode : 500;
		const details = {
			message: 'REST PKI Core completeSignature failed',
			statusCode: err && err.statusCode,
			body: err && err.body,
		};
		console.error('REST PKI Core error on /complete:', details);
		res.status(status).json(details);
	});
});
module.exports = router;
