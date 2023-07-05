const { CloudHubClient, TrustServiceSessionTypes } = require("cloudhub-client");
const express = require("express");
const { Util } = require("../util");
const {
	Authentication
} = require("restpki-client");

const uuidv4 = require("uuid/v4");
const path = require("path");

const app = express();

const router = express.Router();
const APP_ROOT = process.cwd();

this.client = Util.getCloudhubClient();

/*
 * GET /authentication-cloudhub
 *
 * This page will ask for the user identifier, so it is able to perform a request to
 * the next page, where it will ask which cloud signature service the user wants
 */
router.get("/", async (req, res, next) => {
	// Get an instance of the Authentication class.
	const auth = new Authentication(Util.getRestPkiClient());

	// Call the startWithWebPki() method, which initiates the authentication.
	// This yields the "token", a 22-character case-sensitive URL-safe string,
	// which represents this authentication process. We'll use this value to call
	// the signWithRestPki() method on the Web PKI component
	// (see public/javascripts/signature-form.js) and also call the
	// completeWithWebPki() method on "complete" step. This should not be
	// mistaken with the API access token. We have encapsulated the security
	// context choice on util.js.
	auth.startWithWebPki(Util.getSecurityContextId(res.locals.environment))
		.then((token) => {
			// The token acquired can only be used for a single authentication.
			// In order to retry authenticating it is necessary to get a new token.
			// This can be a problem if the user uses the back button of the
			// browser, since the browser might show a cached page that we rendered
			// previously, with a now stale token. To prevent this from happening,
			// we call the function setExpiredPage(), located in util.js, which sets
			// HTTP headers to prevent caching of the page.
			Util.setExpiredPage(res);

			// Render the authentication page.

			// Render the authentication page.
			res.render("authentication-cloudhub", {
				token,
			});
		})
		.catch((err) => next(err));
});

/*
 * POST /pades-signature-cloudhub-restpki
 * This is the POST request from the index page which
 * sends the cpf and the file to be signed
 */
router.post("/", async (req, res, next) => {
	try {
		const cpf = req.body.cpf;
        const token = req.body.token

		// remove all dots and hyphens
		const new_cpf = cpf.replace(/[.-]/g, "");

		const sessionRes = await this.client.createSessionAsync({
			identifier: new_cpf,
			redirectUri: `http://localhost:3000/authentication-cloudhub/session-result?token=${token}`,
			type: TrustServiceSessionTypes.SingleSignature,
		});

		res.render("authentication-cloudhub/service-select", {
			sessionRes
		});
	} catch (err) {
		next(err);
	}
});

/*
 * GET /authentication-cloudhub/session-result
 * This page performs the signature process using CloudHub API session
 * and obtains the user certificate, which is used in Pades signature
 * process
 */
router.get("/session-result", async (req, res, next) => {
	const session = req.query.session;
    const token = req.query.token;

	const cert = await this.client.getCertificateAsync(session);

	this.client.signHashAsync({
		hash: token,
		session: session
	}).then(result => {
		const auth = new Authentication(Util.getRestPkiClient());

		
		
		// Call the completeWithWebPki() method with the token, which finalizes the
		// authentication process. The call yields a ValidationResults which denotes
		// whether the authentication was success or not.
		auth.completeWithWebPki(token)
		.then((result) => {
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
				// At this point, you have assurance tha the certificate is valid
				// according to the TrustArbitrator you selected when starting the
				// authentication and that the user is indeed the certificate's subject.
				// Now, you'd typically query your database for a user that matches one of
				// the certificate's fields, such as userCert.emailAddress or
				// userCert.pkiBrazil.cpf (the actual field to be used as key depends on
				// your application's business logic) and set the user ID on the cookie
				// as if it were the user ID.
				const userCert = cert
				
				// Redirect to the initial page with the user logged in.
				res.render("authentication-cloudhub/success", {
					userCert,
				});
			}
		})
		.catch((err) => next(err));
	});
	
	router.get("/complete", async (req, res, next) => {});
});
	
module.exports = router;
