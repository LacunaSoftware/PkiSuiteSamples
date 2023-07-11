const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const { PadesSignatureStarter} = require("pki-express");
const {
	StandardSignaturePolicies,
	PadesSigner,
} = require('pki-express');
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

	// Get an instance of the PadesSigner class, responsible for receiving
	// the signature elements and performing the local signature.
	const signer = new PadesSignatureStarter();



	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signer);

	// Set signature policy.
	

    const client = Util.getAmpliaClient();
    
    let params = new PaginatedSearchParams()

    params.q = "70380599473";

    let listCert = await client.listCertificates(params);

    let filterByKey = listCert._items.filter(element => element._keyId != null);

//     const date = new Date();
//     const latestDate = filterByKey.reduce((latest, element) => {
//     const elementDate = Date.parse(element._dateIssued);
//     console.log("elementDate = " , elementDate);
//     let elementTime = new Date(elementDate);
//     return elementTime > latest ? elementTime : latest;
// }, new Date(0));

    // console.log("LatestDate = " , latestDate);
    // // Filter the elements based on the latest date
    
    // console.log("HEHE ",
    //     filterByKey.forEach(element => {

    //         let generic = new Date(Date.parse(element._dateIssued))
    //         console.log("Hopeless " , generic)
    //         return generic == latestDate
            
    //     })
    //     )

    // const elementsWithLatestDate = filterByKey.find(element => new Date(Date.parse(element._dateIssued)) == latestDate);

    // console.log("elementsWithLatestDate = " , elementsWithLatestDate)
    
	
	cert = await client.getCertificate(filterByKey[1]._id, true)
	

	signer.signaturePolicy = StandardSignaturePolicies.PADES_BASIC_WITH_LTV;
	
	signer.setPdfToSignFromPathSync(StorageMock.getDataPath(fileId));
	
	signer.setVisualRepresentationSync(PadesVisualElementsExpress.getVisualRepresentation());
	
	signer.addFileReferenceSync('stamp', StorageMock.getPdfStampPath());

	signer.setCertificateFromBase64Sync(cert._contentBase64);
	
	let startResult = await signer.start()

	
	let request = new SignHashRequest({
		hash: startResult.toSignHash,
		digestAlgorithm: startResult.digestAlgorithm,
	});
	
	console.log(filterByKey[1]._keyId);
	console.log(request);
	
    let signature = await client.signHashWithKey(filterByKey[1]._keyId, request);

	const outputFile = `${uuidv4()}.pdf`;

	StorageMock.createAppDataSync(); 

	signer.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

	// Perform the signature.
	let signerCert = await signer.sign(true);

	// Render the result page.
	res.render('pades-server-key-express', {
		signedPdf: outputFile,
		signer: signerCert,
	});
});

module.exports = router;
