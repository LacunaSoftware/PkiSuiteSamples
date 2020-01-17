//- TODO: Uncomment when PKI Express supports cades signature
// const express = require('express');
// const path = require('path');
// const uuidv4 = require('uuid/v4');
// const { CadesSignatureStarter, SignatureFinisher, StandardSignaturePolicies } = require('pki-express');

// const { Util } = require('../util');
// const { StorageMock } = require('../storage-mock');

// const router = express.Router();
// const APP_ROOT = process.cwd();

// /*
//  * GET /cades-signature
//  *
//  * This sample performs a CAdES signature in three steps using PKI Express and
//  * Web PKI.
//  *
//  */
// router.get('/', (req, res, next) => {
// 	const fileId = req.query.cmsfile ? req.query.cmsfile : req.query.fileId;
// 	// Verify if the provided fileId exists.
// 	if (!StorageMock.existsSync({ fileId })) {
// 		const notFound = new Error('The fileId was not found');
// 		notFound.status = 404;
// 		next(notFound);
// 		return;
// 	}
// 	res.render('cades-signature-express', { fileId });
// });

// /**
//  * POST /cades-signature-express/start
//  *
//  * This method starts the signature. In this sample, it will be called
//  * programatically after the user press the "Sign File" button (see method
//  * readCertificate() on static/js/signature-start-form.js).
//  *
//  */
// router.post('/start', (req, res, next) => {
// 	const { fileId } = req.query;

// 	// Recover variables from the POST arguments to be use don this step.
// 	const certThumb = req.body.certThumbField;
// 	const certContent = req.body.certContentField;

// 	// Get an instantiate of the CadesSignatureStarter class, responsible for
// 	// receiving the signature elements and start the signature process.
// 	const signatureStarter = new CadesSignatureStarter();

// 	// Set PKI default options (see util.js).
// 	Util.setPkiDefaults(signatureStarter);

// 	// Set signature policy.
// 	signatureStarter.signaturePolicy = StandardSignaturePolicies.PKI_BRAZIL_CADES_ADR_BASICA;


// 	// Set file to be signed. If the file is a CMS, PKI Express will
// 	// recognize that and will co-sign that file.
// 	signatureStarter.setFileToSignFromPathSync(StorageMock.getDataPath(fileId));

// 	// Set Base64-encoded certificate's content to signature starter.
// 	signatureStarter.setCertificateFromBase64Sync(certContent);

// 	// Set 'encapsulated content' option (default: True).
// 	signatureStarter.setEncapsulatedContent(true);

// 	// Start the signature process.
// 	signatureStarter.start()
// 		.then((response) => {
// 			// Receive as response the following fields:
// 			// - toSignHash: The hash to be signed.
// 			// - digestAlgorithm: The digest algorithm that will inform the Web PKI
// 			//                    component to compute this signature.
// 			// - transferFile: A temporary file to be passed to "complete" step.
// 			const { toSignHash } = response;
// 			const { digestAlgorithm } = response;
// 			const { transferFile } = response;
// 			// Render the field from start() method as hidden field to be used on
// 			// the javascript or on the "complete" step.
// 			res.render('cades-signature-express/start', {
// 				toSignHash,
// 				digestAlgorithm,
// 				transferFile,
// 				certThumb,
// 				fileId,
// 			});
// 		}).catch((err) => next(err));
// });

// /*
//  * POST /cades-signature
//  *
//  * This function completes the signature, it will be called programatically
//  * after the Web PKI component perform the signature and submit the form (see
//  * method sign() on static/js/signature-complete-form.js).
//  *
//  */
// router.post('/complete', (req, res, next) => {
// 	let { fileId } = req.query;
// 	fileId = fileId.replace('_', '.');
// 	// Recover variables from the POST arguments to be used on this step.
// 	const transferFile = req.body.transferFileField;
// 	const signature = req.body.signatureField;

// 	// Get an instance of the SignatureFinisher class, responsible for
// 	// completing the signature process.
// 	const signatureFinisher = new SignatureFinisher();

// 	// Set PKI default options (see util.js).
// 	Util.setPkiDefaults(signatureFinisher);

// 	// Set the file to be signed. It's the same file we used on "start"
// 	// method.
// 	signatureFinisher.setFileToSignFromPathSync(path.join(APP_ROOT, 'app-data', fileId));

// 	// Set the transfer file.
// 	signatureFinisher.setTransferFileFromPathSync(transferFile);

// 	// Set the signature file.
// 	signatureFinisher.signature = signature;

// 	// Generate path for output file and add to the signature finisher.
// 	StorageMock.createAppData(); // Guarantees that "app data" folder exists.
// 	const outputFile = `${uuidv4()}.p7s`;
// 	signatureFinisher.outputFile = path.join(APP_ROOT, 'app-data', outputFile);


// 	// Complete the signature process.
// 	const getCert = true;
// 	signatureFinisher
// 		.complete(getCert)
// 		.then((result) => {
// 			// After complete the signature, render the result page, passing the
// 			// outputFile containing the signed file.
// 			const certificate = result;
// 			res.render('cades-signature-express/complete', {
// 				cmsFile: outputFile,
// 				signerCert: certificate,
// 			});
// 		})
// 		.catch((err) => next(err));
// });

// module.exports = router;
