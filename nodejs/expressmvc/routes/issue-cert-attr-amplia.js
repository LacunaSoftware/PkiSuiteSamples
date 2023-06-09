const express = require('express');
const {KeyGenerator} = require('pki-express');
const {CieCertificateParameters, CreateOrderRequest, CertificateKinds, CieInstitution} = require('amplia-client');

const {Config} = require('../config');
const {StorageMock} = require('../storage-mock');
const {Util} = require('../util.js');
const {KeyMedia } = require('amplia-client/lib/enums');

let router = express.Router();

/**
 * GET /issue-cert-attr-amplia
 *
 * Renders issue certificate page, containing the form to be filled with the
 * information to be used on certificate generation.
 */
router.get('/', (req, res, _next) => {
	res.render('issue-cert-attr-amplia');
});


/**
 * POST /issue-cert-attr-amplia
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
			caId: "d41bfd0b-2326-4917-992e-01879a24e719",

			// Set the certificate validity. We encapsulated the validity date
			// definition on the getTwoYearsFromNowDate() method. We used the
			// Util.formatDate() date method to parse to "MM-DD-YYYY" pattern accepted
			// on Amplia.
			validityEnd: Util.getTwoYearsFromNowDate(),

			// Set the kind of the certificate.
			kind: CertificateKinds.ATTRIBUTE,


			// Set the certificate parameters class with the desired parameters to
			// your certificate. In this sample we'll use the PKI-BRAZIL standards.
			parameters: new CieCertificateParameters({
				// Set the subject name.
				name: req.body.name,
				// Set the degree
				degree: req.body.degree,
				// Set the registration number
				registrationNumber: req.body.registrationNumber,
				// Set the course
				course: req.body.course,
				//set the EEA
				eea: req.body.eea,
				// Set the CPF number.
				cpf: req.body.cpfField,
				institution: new CieInstitution({
					// Set the institution name
					name: req.body.institutionName,
					// Set the institution city
					city: req.body.institutionCity,
					// Set the institution state
					state: req.body.institutionState
				})
			})
		});

		// Create an order of issuing certificate on Amplia.
		let order = await client.createOrder(request);

		// Call Amplia in order to issue the certificate referred by the
		// created order's id.
		let cert = await client.issueCertificate(order.getId(), null);
		// console.log(cert.getContentRaw());

		// Get certificate's id, that will be used to identify the certificate
		// on the "app-data" folder.
		let certId = cert.getId();

		// Store certificate.
		let fileId = StorageMock.storeSync(cert.getContentRaw(), certId, '.pem');

		// Render complete page. We pass the certId responsible for locate the
		// key and certificate files.
		res.render('issue-cert-attr-amplia/complete', {
			fileId: fileId,
			certId: certId
		});

	} catch (err) {
		next(err);
	}
});

module.exports = router;