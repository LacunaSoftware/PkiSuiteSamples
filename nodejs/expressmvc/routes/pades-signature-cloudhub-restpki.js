const {
	CloudHubClient,
	TrustServiceSessionTypes,
} = require("cloudhub-client");
const express = require("express");
const { Util } = require("../util");
const {
	PadesSignatureStarter,
	PadesSignatureFinisher,
	PadesMeasurementUnits,
	StandardSignaturePolicies,
	SignatureFinisher,
} = require("restpki-client");
const {
	PadesVisualElementsRestPki,
} = require("../pades-visual-elements-restpki");
const { StorageMock } = require("../storage-mock");
const { randomUUID } = require("crypto");
const path = require('path');

const app = express();

const router = express.Router();
const APP_ROOT = process.cwd();


/*
 * GET /pades-signature-cloudhub-restpki
 *
 * This page will ask for the user identifier, so it is able to perform a request to
 * the next page, where it will ask which cloud signature service the user wants
 */
router.get("/", async (req, res, next) => {
	try {
		// Render the authentication page.
		res.render("pades-signature-cloudhub-restpki", {
			fileId: req.query.fileId,
		});
	} catch (err) {
		next(err);
	}
});


/*
 * POST /pades-signature-cloudhub-restpki
 * This is the POST request from the index page which 
 * sends the cpf and the file to be signed
*/
router.post("/", async (req, res, next) => {
	try {
		const cpf = req.body.cpf;
		const fileId = req.query.fileId;
		const client = Util.getCloudhubClient();

		// remove all dots and hyphens
		const new_cpf = cpf.replace(/[.-]/g, "");

		const sessionRes = await client.createSessionAsync({
			identifier: new_cpf,
			redirectUri: `http://localhost:3000/pades-signature-cloudhub-restpki/session-result?fileId=${fileId}`,
			type: TrustServiceSessionTypes.SingleSignature,
		});

		res.render("pades-signature-cloudhub-restpki/service-select", {
			sessionRes,
			fileId: fileId
		});
	} catch (err) {
		next(err);
	}
});

/*
 * GET /pades-signature-cloudhub-restpki/session-result
 * This page performs the signature process using CloudHub API session
 * and obtains the user certificate, which is used in Pades signature
 * process 
 */
router.get("/session-result", async (req, res, next) => {
	try {
		const session = req.query.session;
		const file = req.query.fileId;
		const client = Util.getCloudhubClient();

		const cert = await client.getCertificateAsync(session);
		const signatureStarter = new PadesSignatureStarter(
			Util.getRestPkiClient()
		);
	
		// Set PDF to be signed.
		signatureStarter.setPdfToSignFromPath(StorageMock.getDataPath(file));
		
		// Set the certificate
		signatureStarter._signerCertificate = cert;
	
		// Set the signature policy.
		signatureStarter.signaturePolicy =
			StandardSignaturePolicies.PADES_BASIC;
	
		// Set the security context to be used to determine trust in the certificate
		// chain. We have encapsulated the security context choice on util.js.
		signatureStarter.securityContext = Util.getSecurityContextId();
	
		// Set the unit of measurements used to edit the PDF marks and visual
		// representations.
		signatureStarter.measurementUnits = PadesMeasurementUnits.CENTIMETERS;
	
		// Set the visual representation to the signature. We have encapsulated this
		// code (on pades-visual-elements.js) to be used on various PAdES examples.
		signatureStarter.visualRepresentation = await PadesVisualElementsRestPki.getVisualRepresentation();

		// Call the start() method, which initiates the signature.
		// This yields the hash of the document, the OID of the digest algorithm
		// used to compute it and the token, a 43-character case-sensitive
		// URL-safe string, which identifies this signature process. We'll use
		// this value to call the finisher.finish() method to complete the
		// signature. The token should not be mistaken with
		// the API access token.
		const result = await signatureStarter.start();

		const hashRes = await client.signHashAsync({
			hash: result.toSignHash,
			digestAlgorithmOid: result.digestAlgorithmOid,
			session: session,
		});
		// Get an instance of the PadesSignatureFinisher class, responsible for
		// completing the signature process.
		const finisher = new PadesSignatureFinisher(
			Util.getRestPkiClient()
		);
		// set the hash received from signature
		finisher._signature = hashRes;
		// set the token
		finisher.token = result.token;
		// finish the signature process
		const finishRes = await finisher.finish();

		// Get the certificate from the response
		const signerCert = finishRes.certificate;

		StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
		const filename = `${randomUUID()}.pdf`;

		// The SignatureResult object has functions for writing the signature
		// file to a local life (writeToFile()) and to get its raw contents
		// (getContent()). For large files, use writeToFile() in order to avoid
		// memory allocation issues.
		await finishRes.writeToFile(path.join(APP_ROOT, "app-data", filename));

		// Render the result page, showing the signed file and the signer
		// certification info.
		res.render("pades-signature-restpki/complete", {
			signedPdf: filename,
			signerCert,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
