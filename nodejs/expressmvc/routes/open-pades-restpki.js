const express = require('express');
const {
    PadesSignatureExplorer,
    StandardSignaturePolicies
} = require('restpki-client');
const { StorageMock } = require('../storage-mock');
const { Util } = require('../util');

const router = express.Router();

/**
 * GET /open-pades
 *
 * This route only submits a PDF file to PKI Express for inspection of its signatures.
 */

router.get('/', (req, res, next) => {
	// Get parameters from url
    const fileId = req.query['fileId'];
    
	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({fileId: fileId})) {
		let notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
    }
    filePath = StorageMock.getDataPath(fileId);

    // Get an instance of PadesSignatureExplorer class, used to open/validate PDF
    // signatures.
    sigExplorer = new PadesSignatureExplorer(Util.getRestPkiClient());

    // Specify that we want to validate the signatures in the file, not only
    // inspect them.
    sigExplorer.validate = true;

    // Specify the parameters for the signature validation:
    // Accept any PAdES signature as long as the signer has an ICP-Brasil
    // certificate.
    sigExplorer.defaultSignaturePolicyId = StandardSignaturePolicies.PADES_BASIC;

    // Specify the security context to be used to determine trust in the
    // certificate chain. We have encapsulated the security context on util.js.
    sigExplorer.securityContextId = Util.getSecurityContextId(res.locals.environment);
    
    // Set the PDF file.
    sigExplorer.setSignatureFileFromPath(filePath);
   
    // Call the open() method, which returns a Promise with the signature file's 
    // information.
    sigExplorer.open().then(r=> res.render('open-pades-restpki', { signature: r }));
});

module.exports = router;