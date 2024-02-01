const express = require('express');
const {PkiBrazilCertificateParameters, CreateOrderRequest, CertificateKinds, CreateKeyRequest} = require('amplia-client');
const uuidv4 = require('uuid/v4');
const {Config} = require('../config');
const {StorageMock} = require('../storage-mock');
const {Util} = require('../util.js');
const {KeyMedia, KeyTypes } = require('amplia-client/lib/enums');

let router = express.Router();

/**
 * GET /issue-cert-hosted-amplia
 *
 * Renders issue certificate page, containing the form to be filled with the
 * information to be used on certificate generation.
 */
router.get('/', (req, res, _next) => {
	res.render('issue-cert-hosted-amplia');
});


/**
 * POST /issue-cert-hosted-amplia
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

		// Get an instance of the Key Generator class, responsible for generate
		// a private key and the corresponding CSR.
		var create = new CreateKeyRequest({
			keyType:KeyTypes.RSA, 
			name : `${uuidv4()}`,
		});
		
        var key = await client.createRSAKey(create);
		
		// Call Amplia in order to issue the certificate referred by the
		// created order's id.
		let cert = await client.issueCertificate(order.getId(),null, null, key.id);

		// Get certificate's id, that will be used to identify the certificate
		// on the "app-data" folder.
		let certId = cert.getId();


		// Store the key encrypted using a local key.
		// WARNING: It is highly RECOMMENDED to ENCRYPT the key before storing
		// in your database.
		StorageMock.storeSync(key.rsaPublicParameters.modulus, certId, '.json');

		// Store certificate.
		StorageMock.storeSync(cert.getContentRaw(), certId, '.cer');

		// Render complete page. We pass the certId responsible for locate the
		// key and certificate files.
		res.render('issue-cert-hosted-amplia/complete', {
			certId: certId
		});

	} catch (err) {
		next(err);
	}
});

module.exports = router;