const path = require("path");

const express = require("express");
const uuidv4 = require("uuid/v4");

const {
	StandardSignaturePolicies,
	PadesSigner,
	TrustServicesManager,
	TrustServiceSessionTypes,
} = require("pki-express");

const { Util } = require("../util");
const { StorageMock } = require("../storage-mock");
const {
	PadesVisualElementsExpress,
} = require("../pades-visual-elements-express");

/**
 * This sample is responsible to perform a OAuth flow to communicate with PSCs to perform a
 * PAdES signature. To perform this sample it's necessary to configure PKI Express with the
 * credentials of the services by executing the following command:
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
 * GET /pades-cloud-oauth-restpki
 *
 * This action will render a page for the user to choose one of the available
 * providers, which were configured by the command above.
 */
router.get("/", async (req, res, next) => {
	const { fileId } = req.query;
	if (!StorageMock.existsSync({ fileId: fileId })) {
		const notFound = new Error("The fileId was not found");
		notFound.status = 404;
		next(notFound);
		return;
	}

	try {
		// Get an instance of the TrustServiceManager class, responsible for
		// communicating with PSCs and handling the OAuth flow. And set common
		// configuration with setPkiDefaults (see util.js).
		const manager = new TrustServicesManager();
		Util.setPkiDefaults(manager);

		const sessionType = TrustServiceSessionTypes.SIGNATURE_SESSION;

		// We will use a sessionId to identify the code and state in the front-end
		// to be used in the callback page (see tsp-callback.js file)
		const sessionId = uuidv4();

		// Start authentication with all available configured providers
		const result = await manager.startAuth(
			REDIRECT_URL,
			sessionType,
			null,
			sessionId
		);
		const authParameters = result.authParameters;

		res.render("pades-cloud-oauth-restpki", {
			fileId,
			authParameters,
			sessionId,
		});
	} catch (err) {
		next(err);
	}
});

/**
 * POST /pades-cloud-oauth-restpki
 *
 * This action will complete the OAuth authentication process and perform the
 * PAdES signature using the session token obtained from the cloud provider.
 */
router.post("/", async (req, res, next) => {
	const code = req.body.codeField;
	const state = req.body.stateField;
	const fileId = req.body.fileIdField;

	if (!StorageMock.existsSync({ fileId: fileId })) {
		const notFound = new Error("The fileId was not found");
		notFound.status = 404;
		next(notFound);
		return;
	}

	try {
		// Get an instance of the TrustServiceManager class, responsible for
		// communicating with PSCs and handling the OAuth flow.
		const manager = new TrustServicesManager();
		Util.setPkiDefaults(manager);

		// Complete the authentication process, recovering the session info to
		// be used on the signature.
		const result = await manager.completeAuth(code, state);

		// Get an instance of the PadesSigner class, responsible for receiving
		// the signature elements and performing the local signature. And set
		// common configuration with setPkiDefaults (see util.js).
		const signer = new PadesSigner();
		Util.setPkiDefaults(signer);

		// Set signature policy.
		signer.signaturePolicy = StandardSignaturePolicies.PADES_BASIC_WITH_LTV;

		// Set PDF to be signed.
		await signer.setPdfToSignFromPath(StorageMock.getDataPath(fileId));

		// Set trust session acquired on the previous OAuth step.
		signer.trustServiceSession = result.session;

		// Set a file reference for the stamp file. Note that this file can be
		// referenced later by "fref://{alias}" at the "url" field on the visual
		// representation (see public/vr.json or getVisualRepresentation() method).
		await signer.addFileReference("stamp", StorageMock.getPdfStampPath());

		// Set visual reference.
		await signer.setVisualRepresentation(
			PadesVisualElementsExpress.getVisualRepresentation()
		);

		// Generate path for output file.
		const outputFile = `${uuidv4()}.pdf`;
		StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
		signer.outputFile = path.join(APP_ROOT, "app-data", outputFile);

		// Perform the signature.
		const signerCert = await signer.sign(true);

		Util.setExpiredPage(res);

		res.render("pades-cloud-oauth-restpki/complete", {
			signedPdf: outputFile,
			signerCert,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
