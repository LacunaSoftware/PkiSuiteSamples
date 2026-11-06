const { CloudHubClient, TrustServiceSessionTypes } = require("cloudhub-client");
const express = require("express");
const { Util } = require("../util");
const { Authentication, CompleteAuth } = require("restpki-client");
const restpki = require("restpki-client");

const { randomUUID } = require("crypto");
const path = require("path");

const app = express();

const router = express.Router();
const APP_ROOT = process.cwd();


/*
 * GET /authentication-cloudhub
 *
 * This page will ask for the user identifier, so it is able to perform a request to
 * the next page, where it will ask which cloud signature service the user wants
 */
router.get("/", async (req, res, next) => {
	// Render the authentication page.
	res.render("authentication-cloudhub", {});
});

/*
 * POST /authentication-cloudhub
 * This is the POST request from the index page, which sends the user's CPF.
 * It creates a CloudHub session and renders the cloud service selection page.
 */
router.post("/", async (req, res, next) => {
	try {
		const client = Util.getCloudhubClient();
		const cpf = req.body.cpf;
		// remove all dots and hyphens
		const new_cpf = cpf.replace(/[.-]/g, "");

		const sessionRes = await client.createSessionAsync({
			identifier: new_cpf,
			redirectUri: `http://localhost:3000/authentication-cloudhub/session-result`,
			type: TrustServiceSessionTypes.SingleSignature,
		});

		res.render("authentication-cloudhub/service-select", {
			sessionRes,
		});
	} catch (err) {
		next(err);
	}
});

/*
 * GET /authentication-cloudhub/session-result
 * This page obtains the user's certificate from the CloudHub session, signs
 * the authentication's hash with it through CloudHub and completes the
 * authentication with REST PKI.
 */
router.get("/session-result", async (req, res, next) => {
	try {
		const auth = new Authentication(Util.getRestPkiClient());
		const session = req.query.session;
		const client = Util.getCloudhubClient();
		const cert = await client.getCertificateAsync(session);

		// Call the start() method, which initiates the authentication.
		// This yields the "token", a 22-character case-sensitive URL-safe string,
		// which represents this authentication process, along with the hash to
		// be signed and its digest algorithm. CloudHub signs that hash below, and
		// we pass the token to the complete() method. This should not be
		// mistaken with the API access token. We have encapsulated the security
		// context choice on util.js.
		var startResult = await auth.start(
			Util.getSecurityContextId(res.locals.environment)
		);
		const token = startResult.token;

		var signature = await client.signHashAsync({
			hash: startResult.toSignHash,
			digestAlgorithmOid: startResult.digestAlgorithmOid,
			session: session,
		});

		const payload = new CompleteAuth({
			signature: signature,
			certificate: cert,
		});

		const result = await auth.complete(token, payload);

		// Check the authentication result.
		if (!result.validationResults.isValid()) {
			// The toString() method of the ValidationResults object can be used to
			// obtain the checks performed, but the string contains tabs and new
			// line characters for formatting, which we'll convert to <br>'s and
			// &nbsp;'s.
			const vrHtml = result.validationResults
				.toString()
				.replace(/\n/g, "<br>")
				.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

			// If the authentication was not successful, we render a page showing
			// what went wrong.
			res.render("authentication-cloudhub/failed", {
				vrHtml,
			});
		} else {
			// At this point, you have assurance that the certificate is valid
			// according to the security context you selected when starting the
			// authentication and that the user is indeed the certificate's subject.
			// Now, you'd typically query your database for a user that matches one of
			// the certificate's fields, such as userCert.emailAddress or
			// userCert.pkiBrazil.cpf (the actual field to be used as key depends on
			// your application's business logic) and set the user ID on the cookie
			// as if it were the user ID.
			const userCert = result.certificate;

			// Render the success page, showing the user's certificate.
			res.render("authentication-cloudhub/success", {
				userCert,
			});
		}

	} catch (err) {
		next(err);
	}
});

module.exports = router;
