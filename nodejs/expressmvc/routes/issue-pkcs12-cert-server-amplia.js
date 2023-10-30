const express = require('express');
const {KeyGenerator} = require('pki-express');
const {PkiBrazilCertificateParameters, CreateOrderRequest, CertificateKinds} = require('amplia-client');

const {Config} = require('../config');
const {StorageMock} = require('../storage-mock');
const {Util} = require('../util.js');
const {KeyMedia } = require('amplia-client/lib/enums');

let router = express.Router();

/**
 * GET /issue-pkcs12-cert-server-amplia
 *
 * Renders issue certificate page, containing the form to be filled with the
 * information to be used on certificate generation.
 */
router.get('/', (req, res, _next) => {
	res.render('issue-pkcs12-cert-server-amplia');
});


/**
 * POST /issue-pkcs12-cert-server-amplia
 *
 * Receives issueForm POST request, containing two parameters:
 * - The subject name;
 * - The CPF number.
 */
router.post('/', async (req, res, next) => {
	try {

		// Get Amplia configuration from config/{env}.js file, containing common
		// parameters to generate the certificate.
		const CONFIG = Config.getInstance().get('amplia');

		// Get an instance of the AmpliaClient, responsible to connect with Amplia
		// and perform the requests.
		const client = Util.getAmpliaClient();

		// Create an order request.
		const request = new CreateOrderRequest({

			// Set the certificate authority's id. This authority will generate your
			// certificate. You can have a default CAId per application, in that case,
			// there is no need to set this parameter.
			caId: CONFIG['caId'],

			// Set the certificate validity. We encapsulated the validity date
			// definition on the getTwoYearsFromNowDate() method. We used the
			// Util.formatDate() date method to parse to "MM-DD-YYYY" pattern accepted
			// on Amplia.
			validityEnd: Util.getTwoYearsFromNowDate(),

			// Set the kind of the certificate.
			kind: CertificateKinds.PUBLIC_KEY,

			// Set the certificate parameters class with the desired parameters to
			// your certificate. In this sample we'll use the PKI-BRAZIL standards.
			parameters: new PkiBrazilCertificateParameters({

				// Set the subject name.
				name: req.body.subjectName,

				// Set the CPF number.
				cpf: req.body.cpf
			})
		});

		// Create an order of issuing certificate on Amplia.
		let order = await client.createOrder(request);

		// Call Amplia in order to issue the certificate referred by the
		// created order's id.
		let cert = await client.issuePkcs12Certificate(order.getId(), "1234", 2048);

		// console.log(cert);
		
		// Get certificate's id, that will be used to identify the certificate
		// on the "app-data" folder.
		let certId = cert.getModel().id;
		// console.log(certId);
		// console.log(cert.getPfxContent()); 
		
		// Store certificate.
		StorageMock.storeSync(cert.getPfxContent(), certId, '.pfx');

		// Render complete page. We pass the certId responsible for locate the
		// key and certificate files.
		res.render('issue-pkcs12-cert-server-amplia/complete', {
			certId: certId
		});

	} catch (err) {
		next(err);
	}
});

module.exports = router;