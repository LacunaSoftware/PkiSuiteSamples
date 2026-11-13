const express = require('express');
const path = require('path');
const { randomUUID } = require('crypto');
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
 * This sample performs an XML signature in three steps using PKI Express and
 * Web PKI.
 * 
 */
router.get('/', (_req, res, _next) => {
	res.render('xml-signature-express', { sampleId: SampleDocs.SAMPLE_XML });
});

/*
 * POST /xml-signature-express/start
 *
 * This route starts the signature. In this sample, it will be called
 * programmatically after the user presses the "Sign File" button (see method
 * startSignature() on public/javascripts/signature-start-form.js).
 * 
 */
router.post('/start', (req, res, next) => {
	// Recover variables from the POST arguments to be used on this step.
	const certThumb = req.body.certThumbField;
	const certContent = req.body.certContentField;

	// Get an instance of the XmlSignatureStarter class, responsible for
	// receiving the signature elements and starting the signature process.
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

			// Render the fields from start() method as hidden fields to be used on
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
 * This route completes the signature. In this sample, it will be called
 * programmatically after the Web PKI component performs the signature and the
 * page submits the form (see method sign() on
 * public/javascripts/signature-complete-form.js).
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

	// Generate path for output file and add it to the signature finisher.
	StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
	const outputFile = `${randomUUID()}.xml`;
	signatureFinisher.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

	// Complete the signature process.
	const getCert = true;
	signatureFinisher
		.complete(getCert)
		.then((result) => {
			// After completing the signature, render the result page, passing the
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
