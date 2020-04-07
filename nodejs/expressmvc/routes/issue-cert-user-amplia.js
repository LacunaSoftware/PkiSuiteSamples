const router = require('express').Router();
const {
	PkiBrazilCertificateParameters,
	CreateOrderRequest,
	CertificateKinds
} = require('amplia-client');

const { Util } = require('../util.js');
const { Config } = require('../config.js');

/**
 * RETURN_URL: This URL is essential to Amplia to know where to come back after
 * issuing the certificate remotely.
 */
const RETURN_URL = 'http://localhost:3000/issue-cert-user-amplia/complete';

/**
 * GET issue-cert-user-amplia
 *
 * Renders issue certificate page, containing the form to be filled with the
 * information to be used on certificate generation.
 */
router.get('/', (req, res, _next) => {
	res.render('issue-cert-user-amplia');
});

/**
 * POST issue-cert-user-amplia
 *
 * Receives issueForm POST request, containing two parameters:
 * - The subject name;
 * - The CPF number;
 * - The phone number, used to validate identity when generating the certificate
 *   remotely.
 */
router.post('/', async (req, res, next) => {
	try {

		// Get Amplia configuration from config/{env}.js file, containing common
		// parameters to generate the certificate.
		const CONFIG = Config.getInstance().get('amplia');

		// Get an instance of the AmpliaClient, responsible to connect with Amplia
		// and perform the requests.
		let client = Util.getAmpliaClient();

		// Create an order request.
		let request = new CreateOrderRequest({

			// Set the certificate authority's id. This authority will generate your
			// certificate. You can have a default CAId per application, in that case,
			// there is no need to set this parameter.
			caId: CONFIG['caId'],

			// Set the certificate validity. We encapsulated the validity date
			// definition on the getTwoYearsFromNowDate() method. We used the
			// Util.formatDate() date method to parse to "MM-DD-YYYY" pattern accepted
			// on Amplia.
			validityEnd: Util.getTwoYearsFromNowDate(),

			// Set the kind of certificate.
			kind: CertificateKinds.PUBLIC_KEY,

			// Set the certificate parameters class with the desired parameters to
			// your certificate.
			parameters: new PkiBrazilCertificateParameters({

				// Set the subject name.
				name: req.body.subjectName,

				// Set the CPF number.
				cpf: req.body.cpf,

				// Set the phone number.
				// WARNING: For this sample it's necessary to pass a phoneNumber to
				// perform identity verification when issue the certificate remotely.
				phoneNumber: req.body.phoneNumber
			})
		});

		// Call Amplia to create an order.
		let order = await client.createOrder(request);

		// After the order is create, it's possible to get a redirect link
		// to a remote page to issue the certificate.
		let link = await client.getOrderIssueLink(order.getId(), RETURN_URL);

		// Render redirect page to show a message to the user, that he will be
		// redirect to Amplia to issue his certificate.
		res.render('issue-cert-user-amplia/redirect', {
			redirectLink: link
		});

	} catch (err) {
		next(err);
	}
});

/**
 * GET issue-cert-user-amplia/complete
 *
 * Renders page, used as a "returnUrl' to Amplia returns to. This page can be
 * a page where you show to user that the certificate was successfully issued.
 */
router.get('/complete', (req, res, _next) => {
	res.render('issue-cert-user-amplia/complete');
});

module.exports = router;