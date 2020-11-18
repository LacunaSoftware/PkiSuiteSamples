const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const {
	XmlSignatureStarter,
	StandardSignaturePolicies,
	SignatureFinisher,
} = require('pki-express');
const { Util } = require('../util');
const { SampleDocs, StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();

/*
 * GET /xml-signature-express
 *
 * This file perform a XML signature of a Brazillian 
 * invoice in three steps using PKI Express and Web PKI.
 * 
 */
router.get('/', (_req, res, _next) => {
	res.render('xml-signature-express', { sampleId: SampleDocs.SAMPLE_XML });
});

/*
 * POST /xml-signature-express/start
 *
 * This block will be executed only when it's on the "start" 
 * step. In this sample, the state is set as "start" 
 * programmatically after the user press the "Sign File" 
 * button (see method sign() on content/js/signature-form.js).
 * 
 */
router.post('/start', (req, res, next) => {
	// Recover variables from the POST arguments to be use don this step.
	const certThumb = req.body.certThumbField;
	const certContent = req.body.certContentField;

	// Get an instance of the XmlElementSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const signatureStarter = new XmlSignatureStarter();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signatureStarter);
	
	// Set the signature policy.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.XADES_BES;

	// Set the XML to be signed.
	signatureStarter.setXmlToSignFromPathSync(StorageMock.getSampleDocPath(SampleDocs.SAMPLE_XML));

	// Set Base64-encoded certificate's content to signature starter.
	signatureStarter.setCertificateFromBase64Sync(certContent);

	// Start the signature process.
	signatureStarter.start()
		.then((response) => {
			// Receive as response the following fields:
			// - toSignHash: The hash to be signed.
			// - digestAlgorithm: The digest algorithm that will inform the Web PKI
			//                    component to compute this signature.
			// - transferFile: A temporary file to be passed to "complete" step.
			const { toSignHash } = response;
			const { digestAlgorithm } = response;
			const { transferFile } = response;

			// Render the field from start() method as hidden field to be used on
			// the javascript or on the "complete" step.
			res.render('xml-signature-express/start', {
				toSignHash,
				digestAlgorithm,
				transferFile,
				certThumb,
			});
		}).catch((err) => next(err));
});

/*
 * POST /xml-signature-express/complete
 *
 * This block will be executed only when it's on the "complete"
 * step. In this sample, the state is set as "complete" 
 * programmatically after the Web PKI component perform the 
 * signature and submit the form (see method sign() on 
 * content/js/signature-form.js).
 * 
 */
router.post('/complete', (req, res, next) => {
	// Recover variables from the POST arguments to be used on this step.
	const transferFile = req.body.transferFileField;
	const signature = req.body.signatureField;

	// Get an instance of the SignatureFinisher class, responsible for
	// completing the signature process.
	const signatureFinisher = new SignatureFinisher();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signatureFinisher);

	// Set XML to be signed. It's the same file we used on "start" step.
	signatureFinisher.setFileToSignFromPathSync(StorageMock.getSampleDocPath(SampleDocs.SAMPLE_XML));

	// Set transfer file.
	signatureFinisher.setTransferFileFromPathSync(transferFile);

	// Set signature.
	signatureFinisher.signature = signature;

	// Generate path for output file and add the signature finisher.
	StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
	const outputFile = `${uuidv4()}.xml`;
	signatureFinisher.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

	// Complete the signature process.
	const getCert = true;
	signatureFinisher
		.complete(getCert)
		.then((result) => {
			// After complete the signature, render the result page, passing the
			// outputFile containing the signed file.
			const certificate = result;
			res.render('xml-signature-express/complete', {
				signedXml: outputFile,
				signerCert: certificate,
			});
		})
		.catch((err) => next(err));
});

module.exports = router;
