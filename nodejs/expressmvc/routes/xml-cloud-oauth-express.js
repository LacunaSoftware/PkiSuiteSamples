const path = require("path");

const express = require("express");
const { randomUUID } = require("crypto");

const {
	StandardSignaturePolicies,
	XmlSigner,
	TrustServicesManager,
	TrustServiceSessionTypes,
} = require("pki-express");

const { Util } = require("../util");
const { StorageMock, SampleDocs } = require("../storage-mock");

/**
 * This sample performs an OAuth flow to communicate with PSCs to perform a signature. To run this
 * sample it's necessary to configure PKI Express with the credentials of the services by executing
 * the following command:
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

// Redirect URL used by service provider to return the "code" and "state" values
const REDIRECT_URL = "http://localhost:3000/tsp-callback";

/**
 * GET /xml-cloud-oauth-express
 *
 * This action will render a page for the user to choose one of the available
 * providers, which were configured by the command above.
 *
 */
router.get("/", async (req, res, next) => {
	// Get an instance of the TrustServicesManager class, responsible for
	// communicating with PSCs and handling the OAuth flow. And set common
	// configuration with setPkiDefaults (see util.js).
	const manager = new TrustServicesManager();
	Util.setPkiDefaults(manager);

	// Available Session Configuration:
	const sessionType = TrustServiceSessionTypes.SIGNATURE_SESSION; // see TrustServiceSessionTypes for more options
	//const sessionLifetime = (30 * 60).toString(); // The time the session token will be valid after authorization

	// We will use a sessionId to identify the code and state in the front-end
	// to be used in the callback page (see tsp-callback.js file)
	const sessionId = randomUUID();

	// Start the authentication with the available providers.
	const result = await manager.startAuth(
		REDIRECT_URL,
		sessionType,
		null,
		sessionId // Persist sessionId in custom state parameter
	);
	const authParameters = result.authParameters;

	// Render the page with the available providers.
	res.render("xml-cloud-oauth-express", {
		sampleId: SampleDocs.SAMPLE_XML,
		authParameters,
		sessionId,
	});
});

/**
 * POST /xml-cloud-oauth-express
 *
 * This action will complete the authentication process and
 * sign the sample XML using the session returned by the
 * provider.
 *
 */
router.post("/", async (req, res, next) => {
	// Get parameters from the POST arguments.
	const code = req.body.codeField;
	const state = req.body.stateField;

	try {
		// Get an instance of the TrustServicesManager class, responsible for
		// communicating with PSCs and handling the OAuth flow. And setting
		// common configuration with setPkiDefaults (see util.js)
		const manager = new TrustServicesManager();
		Util.setPkiDefaults(manager);

		// Complete the authentication process, recovering the
		// session info to be used on the signature.
		const result = await manager.completeAuth(code, state);

		// Get an instance of the XmlSigner class, responsible for receiving
		// the signature elements and performing the local signature. And
		// setting common configuration with setPkiDefaults (see util.js)
		const signer = new XmlSigner();
		Util.setPkiDefaults(signer);

		// Set signature policy
		signer.signaturePolicy = StandardSignaturePolicies.XADES_BES;

		// Set the XML to be signed.
		await signer.setXmlToSignFromPath(
			StorageMock.getSampleDocPath(SampleDocs.SAMPLE_XML)
		);

		// Set trust session acquired on the previous steps of this sample.
		signer.trustServiceSession = result.session;

		// Generate path for output file and add it to the signer.
		const outputFile = `${randomUUID()}.xml`;
		StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
		signer.outputFile = path.join(APP_ROOT, "app-data", outputFile);

		// Perform the signature.
		const signerCert = await signer.sign(true);

		// Render the result page.
		res.render("xml-cloud-oauth-express/complete", {
			signedXml: outputFile,
			signerCert,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
