const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const { CadesSignatureStarter, StandardSignaturePolicies, CadesSignatureFinisher } = require('restpki-client');

const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();

router.get('/', (req, res) => {
	// It is up to your application's business logic to determine which documents
	// will compose the batch.
	const documentsIds = Util.range(1, 30);

	// Render the batch signature signature page.
	res.render('batch-cades-signature-restpki', {
		documentsIds,
	});
});

router.post('/start', (req, res, next) => {
	// Get the parameters for this signature (received from the POST call via
	// AJAX, see batch-signature-form.js).
	const { id } = req.body;

	// Get an instantiate of the CadesSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const signatureStarter = new CadesSignatureStarter(Util.getRestPkiClient());

	// Set the document to be signed based on its ID.
	signatureStarter.setFileToSignFromPath(StorageMock.getBatchDocPath(id));

	// Set the signature policy.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.PKI_BRAZIL_CADES_ADR_BASICA;

	// Set a security context. We have encapsulated the security context
	// choice on util.py.
	signatureStarter.securityContext = Util.getSecurityContextId(res.locals.environment);

	// Optionally, set whether the content should be encapsulated in the
	// resulting CMS. If this parameter is ommitted, the following rules
	// apply:
	// - If no CmsToCoSign is given, the resulting CMS will include the
	// content.
	// - If a CmsToCoSign is given, the resulting CMS will include the
	// content if and only if the CmsToCoSign also includes the content.
	signatureStarter.encapsulateContent = true;

	// Call the start_with_webpki() method, which initiates the signature.
	// This yields the token, a 43-character case-sensitive URL-safe string,
	// which identifies this signature process. We'll use this value to call
	// the signWithRestPki() method on the Web PKI component (see
	// signature-form.js) and also to complete the signature after
	// the form is submitted (see method action()). This should not be
	// mistaken with the API access token.
	return signatureStarter.startWithWebPki()
		// Return a JSON with the token obtained from REST PKI (the page will use
		// jQuery to decode this value).
		.then((result) => res.json(result.token))
		.catch((err) => next(err));
});

router.post('/complete', (req, res, next) => {
	// Get an instance of the CadesSignatureFinisher class, responsible for
	// completing the signature process.
	const signatureFinisher = new CadesSignatureFinisher(Util.getRestPkiClient());

	// Set the token.
	signatureFinisher.token = req.body.token;

	// Call the finish() method, which finalizes the signature process.The
	// return value is the CMS content.
	return signatureFinisher.finish()
		.then((result) => {
			// At this point, you'd typically store the signed PDF on your database.
			// For demonstration purposes, we'll store the CMS on a temporary folder
			// publicly accessible and render a link to it.
			StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists (util.js).
			const filename = `${uuidv4()}.p7s`;

			// The SignatureResult object has functions for writing the signature file
			// to a local life (writeToFile()) and to get its raw contents
			// (getContent()). For large files, use writeToFile() in order to avoid
			// memory allocation issues.
			result.writeToFileSync(path.join(APP_ROOT, 'app-data', filename));

			// Render the result page.
			return res.json(filename);
		})
		.catch((err) => next(err));
});

module.exports = router;
