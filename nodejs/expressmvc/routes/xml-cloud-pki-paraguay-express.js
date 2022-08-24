const express = require('express');
const uuidv4 = require('uuid/v4');
const path = require('path');

const {
	StandardSignaturePolicies,
	XmlSigner,
	TrustServicesManager,
	TrustServiceSessionTypes,
} = require('pki-express');

const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

/**
 * This sample is responsible to perform a OAuth flow to communicate with PSCs to perform a
 * signature. To perform this sample it's necessary to configure PKI Express with the credentials of
 * the services by executing the following sample:
 *
 *    pkie config --set trustServices:<provider>:<configuration>
 *
 * All standard providers:
 *    - BirdId
 *    - ViDaaS
 *    - NeoId
 *    - RemoteId
 *    - SafeId
 * It's possible to create a custom provider if necessary.
 *
 * All configuration available:
 *    - clientId
 *    - clientSecret
 *    - endpoint
 *    - provider
 *    - badgeUrl
 *    - protocolVariant (error handling, normally it depends on the used provider)
 *
 * This sample will only show the PSCs that are configured.
 **/

const router = express.Router();
const APP_ROOT = process.cwd();


/**
 * GET /xml-pades-pki-paraguay-express/complete
 *
 * This action will complete the authentication process and
 * create a signature using a session token returned by user.
 *  Also, we recover the parameter "customState" containing
 * the id of the file that will be signed.
 * 
 */
router.get('/complete', async (req, res, next) => {
	// Get parameters from urls
	const { code, state } = req.query;

	try {
		// Get an instance of the TrustServiceManager class, 
		// responsible for communicating with PSCs and handling
		// the OAuth flow.
		const manager = new TrustServicesManager();

		// Complete the authentication process, recovering the
		// session info to be used on the signature and the 
		// custom state (fileId).
		const result = await manager.completeAuth(code, state);

		// Recover file id on custom state parameter.
		const fileId = result.customState;

		const signer = new XmlSigner();

		// Set PKI default options (see util.js).
		Util.setPkiDefaults(signer);

		// Set signature policy.
		signer.signaturePolicy = StandardSignaturePolicies.XADES_BES;

		// Set the XML to be signed.
		await signer.setXmlToSignFromPath(StorageMock.getSampleDocPath(SampleDocs.SAMPLE_XML));

		// Set trust session acquired on the following steps of this sample.
		signer.trustServiceSession = result.session;

		// Generate path for output file and add the signature finisher.
		const outputFile = `${uuidv4()}.xml`;
		StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
		signer.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

		// Perform the signature.
		let signerCert = await signer.sign(true);

		// Render the result page.
		res.render('xml-pades-pki-paraguay-express/complete', {
			signedPdf: outputFile,
		});

	} catch (err) { next(err); }
});

/**
 * GET /xml-cloud-pki-paraguay-express
 *
 * This action will render a page that request a CPF to the
 * user. This CPF is used to discover which PSCs have a 
 * certificate containing that CPF.
 * 
 */
router.get('/', (req, res, next) => {
	// Get parameters from url
	const { fileId } = req.query;

	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({ fileId: fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}
	// Render the result page.
	res.render('xml-cloud-pki-paraguay-express', {
		fileId: fileId,
	});
});

/**
 * POST /xml-cloud-pki-paraguay-express/discover
 *
 * This action will be called after the user press the button "Search" on index page. It will
 * search for all PSCs that have a certificate with the provided CPF. Thus, it will start the
 * authentication process and return a URL to redirect the user to perform the authentication.
 *
 * After this action the user will be redirected, and to store the local data (fileId) to be user
 * after the user returns to your application. We use the parameter "customState", the last
 * parameter of the method discoverByCpfAndStartAuth(). This parameter will be recovered in the
 * next action.
 * 
 */
router.post('/discover', async (req, res, next) => {
	// Get parameters from url
	const { fileId } = req.query;
	// Recover CPF from the POST argument.
	const cpf = req.body.cpf;
	// Process cpf, removing all formatting.
	const plainCpf = cpf.replace(/[.-]/g, '');

	try {
		// Get an instance of the TrustServiceManager class, 
		// responsible for communicating with PSCs and handling
		// the OAuth flow.
		const manager = new TrustServicesManager();

		// Discover PSCs and receive a URL to redirect the user
		// to perform the OAuth authentication page. As 
		// mentioned before, we pass the id of the file to be
		// signed as the last parameter of the following method.
		// The next action will recover this information.
		let services = await manager.discoverByCpfAndStartAuth(
			plainCpf,
			"http://localhost:3000/xml-cloud-pki-paraguay-express/complete",
			TrustServiceSessionTypes.SIGNATURE_SESSION,
			fileId);

		// Render the result page.
		res.render('xml-cloud-pki-paraguay-express/discover', {
			cpf: cpf,
			services: services,
		});
	} catch (err) { next(err); }
});

module.exports = router;