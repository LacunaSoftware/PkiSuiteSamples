const client = require("restpkicore-client-typescript");
const express = require('express');
const axios = require("axios");
const { Util } = require('../util');
const { restPKIcore } = require("../config/default");

const { Authentication } = require('restpki-client');
const router = express.Router();



var config = new client.Configuration();
config.apiKey = axios.create({
	headers: {
		'x-api-key': restPKIcore.apiKey
	}
});
config.basePath = restPKIcore.endpoint;


// Authentication:
// var authApi = new client.AuthenticationApi(config, undefined, config.apiKey);
// authApi.apiV2AuthenticationPost({
//     ignoreRevocationStatusUnknown: true,
//     securityContextId: "201856ce-273c-4058-a872-8937bd547d36"
// }).then((response) => {
//     console.log(response.data);
// });

router.get('/', (req, res, next) => {
	// Get an instance of the Authentication class.
	const auth = new Authentication(Util.getRestPkiClient());


	var authApi = new client.AuthenticationApi(config, config.basePath, config.apiKey);
	authApi.apiV2AuthenticationPost({
		ignoreRevocationStatusUnknown: true,
		securityContextId: Util.getSecurityContextId()
	}).then((response) => {
		console.log(response.data);
		var data = response.data;

		var state = data.state;
        var toSignHashAlgorithm = data.toSignHash.algorithm;
		var toSignHashValue = data.toSignHash.value;
        
		// The token acquired can only be used for a single authentication.
		// In order to retry authenticating it is necessary to get a new token.
		// This can be a problem if the user uses the back button of the
		// browser, since the browser might show a cached page that we rendered
		// previously, with a now stale token. To prevent this from happening,
		// we call the function setExpiredPage(), located in util.js, which sets
		// HTTP headers to prevent caching of the page.
		Util.setExpiredPage(res);

		// Render the authentication page.
		res.render('authentication-restpkicore', {
			state, toSignHashAlgorithm,  toSignHashValue
		});
	})
		.catch((err) => next(err));
});

/*
 * POST /authentication
 *
 * This route receives the form submission from the view 'authentication'. We'll
 * call REST PKI to complete the authentication.
 */
router.post('/', (req, res, next) => {
	// Get an instance of the Authentication class (util.js).
	authApiCore = new client.AuthenticationApi(config, config.basePath, config.apiKey);
	console.log(req.body.state);
	console.log(req.body.toSignHashAlgorithm);
	console.log(req.body.toSignHashValue);
	console.log(req.body.certificate);
	console.log(req.body.signature);

	authApiCore.apiV2AuthenticationCompletionPost({
		state: req.body.state,
		certificate: req.body.certificate,
		signature: req.body.signature

	}).then((result) => {
		console.log(result);
		// Check the authentication result.
		if (result.status != 200) {
			// The toString() method of the ValidationResults object can be used to
			// obtain the checks performed, but the string contains tabs and new
			// line characters for formatting, which we'll convert to <br>'s and
			// &nbsp;'s.
			// const vrHtml = result.validationResults
			// 	.toString()
			// 	.replace(/\n/g, '<br>')
			// 	.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

			// If the authentication was not successful, we render a page showing
			// what went wrong.
			res.render('authentication-restpkicore/failed'
			, { vrHtml }
			);
		} else {
			// At this point, you have assurance tha the certificate is valid
			// according to the TrustArbitrator you selected when starting the
			// authentication and that the user is indeed the certificate's subject.
			// Now, you'd typically query your database for a user that matches one of
			// the certificate's fields, such as userCert.emailAddress or
			// userCert.pkiBrazil.cpf (the actual field to be used as key depends on
			// your application's business logic) and set the user ID on the cookie
			// as if it were the user ID.
			const userCert = result.data.certificate;

			// Redirect to the initial page with the user logged in.
			res.render('authentication-restpkicore/success', {
				userCert
			});
		}
	})
		.catch((err) => next(err));
});
// Signature sessions:

module.exports = router;