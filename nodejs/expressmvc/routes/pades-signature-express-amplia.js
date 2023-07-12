const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4')
const { PadesSignatureStarter, StandardSignaturePolicies} = require("pki-express");
const { PadesVisualElementsExpress, } = require('../pades-visual-elements-express');
const {PaginatedSearchParams, SignHashRequest} = require('../node_modules/amplia-client')
const { Config } = require('../config');
const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');
const { result } = require('lodash');

const router = express.Router();
const APP_ROOT = process.cwd();

/**
 * GET /pades-server-key-express
 *
 * This route only renders the signature page.
 */
router.get('/', async (req, res, next) => {
	// Get parameters from url
	const { fileId, cpf } = req.query;

	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({ fileId: fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}

	// Get an instantiate of the PadesSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const signer = new PadesSignatureStarter();

    // Set PKI default options (see util.js).
	Util.setPkiDefaults(signer);
	
	// Get an instance of the AmpliaClient, responsible to connect with Amplia
	// and perform the requests.
    const client = Util.getAmpliaClient();
    
    let params = new PaginatedSearchParams()

    params.q = "70380599473";


    //Using the list certificate we colect the certificates 
    let listCert = await client.listCertificates(params);

    let filterByKey = listCert._items.filter(element => element._keyId != null);

	//Here we call the getCertificate function in order to get the certificate content
	cert = await client.getCertificate(filterByKey[1]._id, true)
	
	// Set signature policy.
	signer.signaturePolicy = StandardSignaturePolicies.PADES_BASIC_WITH_LTV;
	
    // Set PDF to be signed.
	signer.setPdfToSignFromPathSync(StorageMock.getDataPath(fileId));

	// Set a file reference for the stamp file. Note that this file can be
	// referenced later by "fref://{alias}" at the "url" field on the
	// visual representation (see public/vr.json or
	// getVisualRepresentation() method).	
	signer.addFileReferenceSync('stamp', StorageMock.getPdfStampPath());

	// Set the visual representation. We provided a dictionary that
	// represents the visual representation JSON model.
	signer.setVisualRepresentationSync(PadesVisualElementsExpress.getVisualRepresentation());
	
    // Set Base64-encoded certificate's content to signature starter.
	signer.setCertificateFromBase64Sync(cert._contentBase64);
	
	// Start the signature process.
	let startResult = await signer.start()

	//Set the request using the response from the signer.start wich which has the
	// hash to be signed and the digestAlgorithm.
	let request = new SignHashRequest({
		hash: startResult.toSignHash,
		digestAlgorithm: startResult.digestAlgorithm,
	});
	
	//Now select the certificate to sign by passing his key and the request. 
    const signature = await client.signHashWithKey(filterByKey[1]._keyId, request);
    console.log(signature);

	// Get an instance of the PadesSignatureFinisher class, responsible for
	// completing the signature process.
	const signatureFinisher = new SignatureFinisher();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signatureFinisher);

	// Set PDF to be signed. It's the same file we used on "start" step.
	signatureFinisher.setFileToSignFromPathSync(StorageMock.getDataPath(fileId));

	// Set transfer file.
	signatureFinisher.setTransferFileFromPathSync(transferFile);

	// Set signature.
	signatureFinisher.signature = signature;



	// Render the result page.
	res.render('pades-signature-express-amplia', {
		signedPdf: outputFile,
		signer: signerCert,
	});
});

module.exports = router;
