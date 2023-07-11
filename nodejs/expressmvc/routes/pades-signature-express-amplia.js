const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const { Pkcs12Generator } = require("pki-express");
const {
	StandardSignaturePolicies,
	PadesSigner,
} = require('pki-express');
const { PadesVisualElementsExpress } = require('../pades-visual-elements-express');
const {PaginatedSearchParams} = require('../node_modules/amplia-client')
const { Config } = require('../config');
const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

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
	const signer = new PadesSigner();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signer);

	// Set signature policy.
	signer.signaturePolicy = StandardSignaturePolicies.PADES_BASIC_WITH_LTV;

    const client = Util.getAmpliaClient();
    
    let params = new PaginatedSearchParams()
    params.q = "70380599473";

    let listCert = await client.listCertificates(params);

    let filterByKey = listCert._items.filter(element => element._keyId != null);
    
    console.log("Filter = ", filterByKey)

    const date = new Date();
    const latestDate = filterByKey.reduce((latest, element) => {
    const elementDate = Date.parse(element._dateIssued);
    console.log("elementDate = " , elementDate);
    let elementTime = new Date(elementDate);
    return elementTime > latest ? elementTime : latest;
}, new Date(0));

    console.log("LatestDate = " , latestDate);
    // Filter the elements based on the latest date
    
    console.log("HEHE ",
        filterByKey.forEach(element => {

            let generic = new Date(Date.parse(element._dateIssued))
            console.log("Hopeless " , generic)
            return generic == latestDate
            
        })
        )

    const elementsWithLatestDate = filterByKey.find(element => new Date(Date.parse(element._dateIssued)) == latestDate);

    console.log("elementsWithLatestDate = " , elementsWithLatestDate)
    

    signature = client.signHashWithKey();
    

	// Set PDF to be signed.
	await signer.setPdfToSignFromPath(StorageMock.getDataPath(fileId));

	// Set the PKCS #12 certificate path. We have an logic for choosing the generate the PKCS #12
	// from "issue certificate" samples or a sample PKCS #12.
	//await signer.setCertFileBase64Sync();

	// Set a file reference for the stamp file. Note that file can be
	// referenced later by "fref://{alias}" at the "url" field on the visual
	// representation (see public/vr.json or getVisualRepresentation()
	// method).
	await signer.addFileReference('stamp', StorageMock.getPdfStampPath());

	// Set visual reference. We provide a dictionary that represents the
	// visual representation JSON model.
	await signer.setVisualRepresentation(PadesVisualElementsExpress.getVisualRepresentation());

	// Generate path for output file and add the signature finisher.
	const outputFile = `${uuidv4()}.pdf`;
	StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
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
