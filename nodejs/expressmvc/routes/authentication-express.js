const express = require('express');
const { Authentication } = require('pki-express');

const { Util } = require('../util');

const router = express.Router();

/*
 * GET /authentication-express
 *
 * This route initiates an authentication with the PKI Express's
 * "start-auth" command and renders the authentication page.
 */
router.get('/', async (_req, res, next) => {
	// Get an instance of the Authentication class, responsible for 
	// contacting PKI Express to start and compute the authentication.
	const auth = new Authentication();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(auth);

	try{
		// Start the authentication. Receive as response an AuthStartResult
		// instance containing the following fields:
		// - nonce:           The nonce to be signed. This value is also used
		//                    on "complete" action;
		// - digestAlgorithm: The digest algorithm that will inform the Web PKI
		//                    component to compute the signature.
		const result = await auth.start();
	
		// Render the authentication page.
		res.render('authentication-express', {
			result,
		});
	} catch (err) { next(err); }
});

/*
 * POST /authentication-express
 *
 * This route completes the authentication.
 * 
 */
router.post('/', async (req, res, next) => {
	// Recover variables from the POST arguments to be used on this step.
	const { nonce, certContent, signature } = req.body;

	// Get an instance of the Authentication class.
	const auth = new Authentication();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(auth);
	
	try {
		// Set the nonce. This value is generated on "start" 
		// action and passed by a hidden field.
		auth.setNonce(nonce);
		
		// Set the Base64-encoded certificate content.
		await auth.setCertificateFromBase64(certContent);
	
		// Set the signature.
		auth.setSignature(signature); 
		
		// Complete the authentication. Receive as response
		// an AuthCompleteResult instance containing the following fields:
		// - The certificate information;
		// - The validation results.
		const result = await auth.complete();

		// Check the authentication result.
		if (!result.validationResults.isValid()) {
			// The toString() method of the ValidationResults object can be used to
				// obtain the checks performed, but the string contains tabs and new
				// line characters for formatting, which we'll convert to <br>'s and
				// &nbsp;'s.
				const vrHtml = result.validationResults
					.toString()
					.replace(/\n/g, '<br>')
					.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');

				// If the authentication was not successful, we render a page showing
				// what went wrong.
				res.render('authentication-express/failed', {
					vrHtml,
				});
		} else {
			// At this point, you have assurance that the certificate is valid
			// according to the trusted roots set by setPkiDefaults() (see util.js)
			// and that the user is indeed the certificate's subject.
			// Now, you'd typically query your database for a user that matches one of
			// the certificate's fields, such as userCert.emailAddress or
			// userCert.pkiBrazil.cpf (the actual field to be used as key depends on
			// your application's business logic) and set the user ID on the cookie
			// as if it were the user ID.
			const userCert = result.certificate;

			// Render the success page, showing the user's certificate.
			res.render('authentication-express/success', {
				userCert,
			});
		}
	} catch (err) { next(err); }
});

module.exports = router;
