const express = require("express");
const fs = require('fs');

const { Util } = require('../util');
const { PadesVisualElementsCore } = require('../pades-visual-elements-core');
const { StorageMock } = require('../storage-mock');

const router = express.Router();

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
 * signer's certificate content and asks REST PKI Core to prepare a PAdES
 * signature.
 */
router.post('/start', (req, res, next) => {
	// Get the parameters for this signature (received from the POST call via
	// AJAX, see batch-signature-core-form.js).
	const { id } = req.body;
	const { certContent } = req.body;

	const client = Util.getRestPkiCoreClient();

	// Build the request to prepare the signature. Its fields follow the
	// PrepareSignatureRequest model of the REST PKI Core API (see
	// https://core.pki.rest/swagger).
	const request = {
		// Set PDF to be signed, Base64-encoded.
		file: {
			content: fs.readFileSync(StorageMock.getBatchDocPath(id), 'base64'),
			contentType: 'application/pdf',
			name: `${id}.pdf`,
		},
		// Set the signer's certificate, as read by Web PKI (already
		// Base64-encoded).
		certificate: {
			content: certContent,
		},
		signatureType: 'Pdf',
		// Set security context to determine trust. We have encapsulated the
		// security context choice on util.js.
		securityContextId: Util.getSecurityContextId(),
		pdfSignatureOptions: {
			// Set the visual representation to the signature. We have
			// encapsulated this code (on pades-visual-elements-core.js) to be
			// used on the REST PKI Core samples.
			visualRepresentation: PadesVisualElementsCore.getVisualRepresentation(),
		},
	};

	return client.prepareSignature(request).then((result) => {
		// REST PKI Core validates the signer's certificate before preparing the
		// signature. If the certificate is not valid or not trusted, "success"
		// is false and "validationResults" says why.
		if (!result.data.success) {
			let details = '';
			const errors = result.data.validationResults && result.data.validationResults.errors;
			if (errors && errors.length > 0) {
				details = `: ${errors.map((item) => item.message).join('; ')}`;
			}
			res.status(422).json({
				message: `The signature could not be prepared (${result.data.failure})${details}`,
			});
			return;
		}

		// Return the state, the hash to be signed and the OID of its digest
		// algorithm (which Web PKI needs to sign the hash) to the page.
		res.json({
			state: result.data.state,
			hash: result.data.toSign.hash,
			digestAlgorithm: result.data.toSign.signatureAlgorithm.digestAlgorithmOid,
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
 * PKI Core to complete this signature and return a JSON with the saved file's
 * ID so that the page can render a link to it.
 */
router.post('/complete', (req, res, next) => {
	// Get the parameters for this signature (received from the POST call via
	// AJAX, see batch-signature-core-form.js).
	const { signature } = req.body;
	const { state } = req.body;

	const client = Util.getRestPkiCoreClient();

	// Set the signature and state.
	const request = {
		signature,
		state,
	};

	return client.completeSignature(request).then((result) => {
		// At this point, you'd typically store the signed PDF on your database.
		// The "signedFile" field holds a temporary link to it. For demonstration
		// purposes, we'll download the signed PDF and store it with our
		// StorageMock class.
		return Util.download(result.data.signedFile.url).then((signedContent) => {
			const fileId = StorageMock.storeSync(signedContent, null, '.pdf');
			// Return the ID of the stored file to the page.
			res.json({
				fileId,
			});
		});
	})
	.catch((err) => {
		const status = err && err.statusCode ? err.statusCode : 500;
		const details = {
			// REST PKI Core errors have a status code. Other errors, such as a
			// failed download of the signed PDF, have their own message.
			message: err && err.statusCode ? 'REST PKI Core completeSignature failed' : String(err && err.message),
			statusCode: err && err.statusCode,
			body: err && err.body,
		};
		console.error('REST PKI Core error on /complete:', details);
		res.status(status).json(details);
	});
});
module.exports = router;
