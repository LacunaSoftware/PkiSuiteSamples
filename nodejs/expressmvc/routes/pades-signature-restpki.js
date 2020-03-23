const express = require('express');
const uuidv4 = require('uuid/v4');
const path = require('path');
const {
	PadesSignatureStarter,
	PadesSignatureFinisher,
	PadesMeasurementUnits,
	StandardSignaturePolicies,
} = require('restpki-client');

const { Util } = require('../util');
const { PadesVisualElementsRestPki } = require('../pades-visual-elements-restpki');
const { StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();

/**
 * GET /pades-signature
 *
 * This route initiates a PAdES signature using REST PKI and renders the
 * signature page.
 *
 * Both PAdES signature examples, with a server file and with a file uploaded by
 * the user, use this route. The difference is that, when the file is uploaded
 * by the user, the route is called with a URL argument named "fileId".
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

	// Get an instance of the PadesSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const signatureStarter = new PadesSignatureStarter(Util.getRestPkiClient());

	// Set PDF to be signed.
	signatureStarter.setPdfToSignFromPath(StorageMock.getDataPath(fileId));

	// Set the signature policy.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.PADES_BASIC;

	// Set the security context to be used to determine trust in the certificate
	// chain. We have encapsulated the security context choice on util.js.
	signatureStarter.securityContext = Util.getSecurityContextId();

	// Set the unit of measurements used to edit the PDF marks and visual
	// representations.
	signatureStarter.measurementUnits = PadesMeasurementUnits.CENTIMETERS;

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
			// The token acquired can only be used for a single signature attempt.
			// In order to retry the signature it is necessary to get a new token.
			// This can be a problem if the user uses the back button of the
			// browser, since the browser might show a cached page that we rendered
			// previously, with a now stale token. To prevent this from happening,
			// we set some response headers specifying that the page should not be
			// cached.
			Util.setExpiredPage(res);

			// Render the signature page.
			res.render('pades-signature-restpki', {
				token: result.token,
				fileId: req.query.fileId,
			});
		})
		.catch((err) => next(err));
});

/**
 * POST /pades-signature
 *
 * This route receives the form submission from the view 'pades-signature'.
 * We'll call REST PKI to complete the signature.
 */
router.post('/', (req, res, next) => {
	// Get an instance of the PadesSignatureFinisher class, responsible for
	// completing the signature process.
	const signatureFinisher = new PadesSignatureFinisher(Util.getRestPkiClient());

	// Set the token.
	signatureFinisher.token = req.body.token;

	// Call the finish() method, which finalizes the signature process and
	// returns the SignatureResult object.
	signatureFinisher.finish()
		.then((result) => {
			// The "certificate" property of the SignatureResult object contains
			// information about the certificate used by the user to sign the file.
			const signerCert = result.certificate;

			// At this point, you'd typically store the signed PDF on you database.
			// For demonstration purposes, we'll store the PDF on a temporary
			// folder publicly accessible and render a link to it.

			StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
			const filename = `${uuidv4()}.pdf`;

			// The SignatureResult object has functions for writing the signature
			// file to a local life (writeToFile()) and to get its raw contents
			// (getContent()). For large files, use writeToFile() in order to avoid
			// memory allocation issues.
			result.writeToFileSync(path.join(APP_ROOT, 'app-data', filename));

			// Render the result page, showing the signed file and the signer
			// certification info.
			res.render('pades-signature-restpki/complete', {
				signedPdf: filename,
				signerCert,
			});
		})
		.catch((err) => next(err));
});

module.exports = router;
