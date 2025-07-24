const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
// NOTE: REST PKI Core Node.js client library is not yet available in npm
// You will need to implement the REST PKI Core API calls directly or wait for the library to be published
// For reference, the Java version uses: com.lacunasoftware.restpki:restpkicore-client:1.1.4

const { Config } = require('../config');
const { StorageMock } = require('../storage-mock');
const { RestPkiCoreClient, PrepareSignatureRequest} = require('restpki-core-client');
const { Util } = require('../util');


const router = express.Router();
const APP_ROOT = process.cwd();

/**
 * GET /pades-signature-core
 *
 * This route only renders the signature page.
 */
router.get('/', (req, res, next) => {
	// Get parameters from url
	const { fileId } = req.query;

	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}

	res.render('pades-signature-core', { fileId });
});

/**
 * POST /pades-signature-core/start
 *
 * This route starts the signature using REST PKI Core. In this sample, it will be called
 * programmatically after the user press the "Sign File" button (see method
 * readCertificate() on public/javascripts/signature-start-form.js).
 */
router.post('/start', async(req, res, next) => {
	const { fileId } = req.query;

	// Recover variables from the POST arguments to be used on this step.
	const certThumb = req.body.certThumbField;
	const certContent = req.body.certContentField;

	// Read file content and convert to base64
	const fileContent = StorageMock.readSync(fileId);
	const fileContentBase64 = fileContent.toString('base64');

	try {
        const client = Util.getRestPkiCoreClient();
        const request = {
            file: {
                // set file content in base64
                content: fileContentBase64,
                contentType: 'application/pdf',
                name: `${fileId}.pdf`,
            },
            certificate: {
                // set certificate content in base64
                content: certContent,
            },
            // set security context id
            securityContextId: 'd480958c-59b0-4178-bd11-0198188bfd3c',    
        }

        const response = await client.prepareSignature(request);
		// render the start page with the response data
		res.render('pades-signature-core/start', {
			certThumb,
			certContent,
			state: response.data.state,
			toSignHash: response.data.toSignHash.value,
			digestAlgorithm: response.data.toSignHash.algorithm,
			fileId,
		});
	} catch (err) {
		next(err);
	}
});

/**
 * POST /pades-signature-core/complete
 *
 * This route completes the signature using REST PKI Core, it will be called programmatically 
 * after the Web PKI component perform the signature and submit the form (see method
 * sign() on public/javascripts/signature-complete-form.js).
 */
router.post('/complete', async (req, res, next) => {
	const { fileId } = req.query;

	// Recover variables from the POST arguments to be used on this step.
	const state = req.body.state;
	const signature = req.body.signature;

	const client = Util.getRestPkiCoreClient();

	const completeSignatureRequest = {
		state: state,
		signature: signature,
	}

	try {
		const response = await client.completeSignature(completeSignatureRequest);
		
		res.render('pades-signature-core/complete', {
			signedPdf: response.data.signedFile.name,
			downloadUrl: response.data.signedFile.location, 
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router; 