//- TODO: Uncomment when PKI Express supports cades signature
// const express = require('express');
// const path = require('path');
// const uuidv4 = require('uuid/v4');
// const { CadesSignatureStarter, StandardSignaturePolicies, SignatureFinisher } = require('pki-express');

// const { Util } = require('../util');
// const { StorageMock } = require('../storage-mock');

// const router = express.Router();
// const APP_ROOT = process.cwd();

// router.get('/', (req, res) => {
// 	// It is up to your application's business logic to determine which documents
// 	// will compose the batch.
// 	const documentsIds = Util.range(1, 30);

// 	// Render the batch signature signature page.
// 	res.render('batch-cades-signature-express', {
// 		documentsIds,
// 	});
// });

// router.post('/start', (req, res, next) => {
// 	// Get the parameters for this signature (received from the POST call via
// 	// AJAX, see batch-signature-form.js).
// 	const { id } = req.body;
// 	const { certContent } = req.body;

// 	// Get an instantiate of the CadesSignatureStarter class, responsible for
// 	// receiving the signature elements and start the signature process.
// 	const signatureStarter = new CadesSignatureStarter();

// 	// Set PKI default options (see util.js).
// 	Util.setPkiDefaults(signatureStarter);

// 	// Set signature policy.
// 	signatureStarter.signaturePolicy = StandardSignaturePolicies.PKI_BRAZIL_CADES_ADR_BASICA;

// 	// Set the document to be signed based on its ID.
// 	signatureStarter.setFileToSignFromPathSync(StorageMock.getBatchDocPath(id));

// 	// Set Base64-encoded certificate's content to signature starter.
// 	signatureStarter.setCertificateFromBase64Sync(certContent);

// 	// Set a security context. We have encapsulated the security context
// 	// choice on util.py.
// 	signatureStarter.securityContext = Util.getSecurityContextId(res.locals.environment);

// 	// Optionally, set whether the content should be encapsulated in the
// 	// resulting CMS. If this parameter is ommitted, the following rules
// 	// apply:
// 	// - If no CmsToCoSign is given, the resulting CMS will include the
// 	// content.
// 	// - If a CmsToCoSign is given, the resulting CMS will include the
// 	// content if and only if the CmsToCoSign also includes the content.
// 	signatureStarter.setEncapsulatedContent(true);

// 	signatureStarter.start()
// 		.then((response) => {
// 			// Respond this request with the fields received from start() method to
// 			// be used on the javascript or on the complete action.
// 			res.json(response);
// 		})
// 		.catch((err) => next(err));
// });

// router.post('/complete', (req, res, next) => {
// 	// Get the parameters for this signature (received from the POST call via
// 	// AJAX, see batch-signature-form.js).
// 	const { id } = req.body;
// 	const { transferFile } = req.body;
// 	const { signature } = req.body;

// 	// Get an instance of the SignatureFinisher class, responsible for
// 	// completing the signature process.
// 	const signatureFinisher = new SignatureFinisher();

// 	// Set PKI default options (see util.js).
// 	Util.setPkiDefaults(signatureFinisher);

// 	// Set the file to be signed. It's the same file we used on "start"
// 	// method.
// 	signatureFinisher.setFileToSignFromPathSync(StorageMock.getBatchDocPath(id));

// 	// Set the transfer file.
// 	signatureFinisher.setTransferFileFromPathSync(transferFile);

// 	// Set the signature file.
// 	signatureFinisher.signature = signature;

// 	// Generate path for output file and add to the signature finisher.
// 	StorageMock.createAppData(); // Make sure the "app-data" folder exists (util.js).
// 	const outputFile = `${uuidv4()}.p7s`;
// 	signatureFinisher.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

// 	// Call the finish() method, which finalizes the signature process.
// 	signatureFinisher.complete()
// 		.then(() => {
// 			// Render a JSON with the saved filename (the page wil use jQuery to
// 			// decode this value).
// 			res.json(outputFile);
// 		})
// 		.catch((err) => next(err));
// });

// module.exports = router;
