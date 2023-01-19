const { CloudHubClient, TrustServiceSessionTypes } = require('cloudhubnodeclient');
const express = require('express');
const { Util } = require('../util');
const {
	PadesSignatureStarter,
	PadesSignatureFinisher,
	PadesMeasurementUnits,
	StandardSignaturePolicies,
} = require('restpki-client');
const { PadesVisualElementsRestPki } = require('../pades-visual-elements-restpki');

const app = express();

const router = express.Router();
const client = null;

/*
* GET /authentication-cloudhub-sdk
*
* This page will ask for the user identifier, so it is able to perform a request to
* the next page, where it will ask which cloud signature service the user wants
*/
router.get('/', async (req, res, next) => {
    this.client = new CloudHubClient("https://cloudhub.lacunasoftware.com", "mR1j0v7L12lBHnxpgxVkIdikCN9Gm89rn8I9qet3UHo=");
    try{
		// Render the authentication page.
		res.render('authentication-cloudhub-sdk');
	} catch (err) { next(err); }
});

router.post('/', async(req, res, next) => {
    try {
        const cpf = req.body.cpf;
        // remove all dots and hyphens
        const new_cpf = cpf.replace(/[.-]/g, "");
        // console.log("cpf sent: ", new_cpf);
        
        const sessionRes = await this.client.createSessionAsync({
            identifier: new_cpf,
            redirectUri: "http://localhost:3000/authentication-cloudhub-sdk/session-result",
            type: TrustServiceSessionTypes.SingleSignature
        });

        console.log(sessionRes);

        res.render('authentication-cloudhub-sdk/service-select', {
			sessionRes: sessionRes
		});
    } catch (err) {next(err);}
});


router.get("/session-result", async (req, res, next) => {
	try {
		const session = req.query.session;

		const res = await this.client.getCertificateAsync(session);
		console.log("cert:", res);

		const signatureStarter = new PadesSignatureStarter(Util.getRestPkiClient());

		// Set PDF to be signed.
		signatureStarter.setPdfToSignFromPath("C://Users//danil//Downloads//sample.pdf");

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
				return signatureStarter.start();
			}).then((result) => {
				console.log("result:", result);
			})
			

	} catch (err) {
		next(err);
	}
});

module.exports = router;