const { CloudHubClient, TrustServiceSessionTypes } = require("cloudhub-client");
const express = require("express");
const { Util } = require("../util");
const { Authentication } = require("restpki-client");

const uuidv4 = require("uuid/v4");
const path = require("path");
const { result } = require("lodash");
const { time } = require("console");

const app = express();

const router = express.Router();
const APP_ROOT = process.cwd();

this.client = Util.getCloudhubClient();
this.restPkiClient = Util.getRestPkiClient();

/*
 * GET /authentication-cloudhub
 *
 * This page will ask for the user identifier, so it is able to perform a request to
 * the next page, where it will ask which cloud signature service the user wants
 */
router.get("/", async (req, res, next) => {
	// Get an instance of the Authentication class.
	const auth = new Authentication(this.restPkiClient);

	// Render the authentication page.
	res.render("authentication-cloudhub", {});
});

/*
 * POST /pades-signature-cloudhub-restpki
 * This is the POST request from the index page which
 * sends the cpf and the file to be signed
 */
router.post("/", async (req, res, next) => {
	try {
		const cpf = req.body.cpf;

		// remove all dots and hyphens
		const new_cpf = cpf.replace(/[.-]/g, "");

		const sessionRes = await this.client.createSessionAsync({
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
 * This page performs the signature process using CloudHub API session
 * and obtains the user certificate, which is used in Pades signature
 * process
 */
router.get("/session-result", async (req, res, next) => {
	const auth = new Authentication(this.restPkiClient);
	const session = req.query.session;
	const cert = await this.client.getCertificateAsync(session);

	// Call the startWithWebPki() method, which initiates the authentication.
	// This yields the "token", a 22-character case-sensitive URL-safe string,
	// which represents this authentication process. We'll use this value to call
	// the signWithRestPki() method on the Web PKI component
	// (see public/javascripts/signature-form.js) and also call the
	// completeWithWebPki() method on "complete" step. This should not be
	// mistaken with the API access token. We have encapsulated the security
	// context choice on util.js.
	auth.start(Util.getSecurityContextId(res.locals.environment))
		.then((result) => {
			const hash = result.toSignHash;
			const token = result.token;
			this.client
				.signHashAsync({
					hash: hash,
					session: session.toString(),
					digestAlgorithmOid: result.digestAlgorithmOid,
				})
				.then((result) => {
					const payload = {
						signature: result.toString(),
						certificate: cert.toString(),
					};
					auth.complete(token, JSON.stringify(payload))
						.then((result) => {
							
							// TODO: analyse this object
							// console.log(result.validationResults);

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
								const userCert = cert;

								// Redirect to the initial page with the user logged in.
								res.render("authentication-cloudhub/success", {
									userCert,
								});
							}
						})
						.catch((err) => next(err));
				})
				.catch((err) => {
					next(err);
				});
		})
		.catch((err) => {
			next(err);
		});
});

module.exports = router;
