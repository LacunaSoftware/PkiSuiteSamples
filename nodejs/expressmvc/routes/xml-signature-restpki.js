const express = require('express');
const uuidv4 = require('uuid/v4');
const {
	FullXmlSignatureStarter, StandardSignaturePolicies, XmlSignatureFinisher, XmlInsertionOptions,
} = require('restpki-client');
const { Util } = require('../util');
const { SampleDocs, StorageMock } = require('../storage-mock');

const router = express.Router();

/**
 * GET /xml-signature
 */
router.get('/', (req, res, next) => {
	// Get an instance of the FullXmlSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const signatureStarter = new FullXmlSignatureStarter(Util.getRestPkiClient());

	// Set the XML to be signed, a sample XML Document.
	signatureStarter.setXmlToSignFromPath(StorageMock.getSampleDocPath(SampleDocs.SAMPLE_XML));

	// Set the location on which to insert the signature code. If the location is
	// not specified, the signature will appended to the root element (which is
	// most usual with enveloped signatures).
	signatureStarter.setSignatureElementLocation(
		'//ls:signaturePlaceholder',
		XmlInsertionOptions.APPEND_CHILD,
		[
			{
				prefix: 'ls',
				uri: 'http://www.lacunasoftware.com/sample',
			},
		],
	);

	// Set the signature policy.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.XADES_BES;

	// Set the security context to be used to determine trust in the certificate
	// chain. We have encapsulated the security context choice on util.js.
	signatureStarter.securityContext = Util.getSecurityContextId();

	// Call the startWithWebPki() method, which initiates the signature. This
	// yields the token, a 43-character case-sensitive URL-safe string, which
	// identifies this signature process. We'll use this value to call the
	// signWithRestPki() method on the WebPKI component
	// (see public/js/signature-form.js) and also to complete the signature after
	// the form is submitted (see post method). This should not be mistaken with
	// with the API access token.
	signatureStarter.startWithWebPki()
		.then((result) => {
			// The token acquired can only be used for a single signature attempt.
			// In order to retry the signature it is necessary to get a new token.
			// This can be a problem if the user uses the back button of the
			// browser, since the browser might show a cached page that we rendered
			// previously, with a now stale token. To prevent this from happening,
			// we set some response headers specifying that the page should not be
			// cached.
			Util.setExpiredPage(res);

			// Render the signature page
			res.render('xml-signature-restpki/index', {
				token: result.token,
				sampleId: SampleDocs.SAMPLE_XML,
			});
		})
		.catch((err) => next(err));
});

/**
 * POST /xml-signature
 */
router.post('/', (req, res, next) => {
	// Get an instance of XmlSignatureFinisher class, responsible for complete
	// the signature process.
	const signatureFinisher = new XmlSignatureFinisher(Util.getRestPkiClient());

	// Retrieve and set the token.
	signatureFinisher.token = req.body.token;

	// Call the finish() method, which finalizes the signature process and
	// returns the signed XML.
	signatureFinisher.finish()
		.then((result) => {
			// The "certificate" property of the SignatureResult object contains
			// information about the certificate used by the user to sign the file.
			const signerCert = result.certificate;

			// At this point, you'd typically store the signed XML on you database.
			// For demonstration purposes, we'll store the XML on a temporary folder
			// publicly accessible and render a link to it.

			StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
			const filename = `${uuidv4()}.xml`;
			// The SignatureResult object has functions for writing the signature file
			// to a local file (writeToFile()) and to get its raw contents
			// (getContent()). For large files, use writeToFile() in order to avoid
			// memory allocation issues.
			result.writeToFileSync(StorageMock.getDataPath(filename));

			res.render('xml-signature-restpki/complete', {
				signedFile: filename,
				signerCert,
			});
		})
		.catch((err) => next(err));
});

module.exports = router;
