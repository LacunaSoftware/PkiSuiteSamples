const express = require('express');
const path = require('path');
const { randomUUID } = require('crypto');
const { 
	CadesSignatureExplorer,
	StandardSignaturePolicies
} = require('restpki-client');
const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();

router.get('/', (req, res, next) => {
	const { fileId } = req.query;

	// Verify if the provided userfile exists
	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}
	const filePath = StorageMock.getDataPath(fileId);

	// Get an instance of the CadesSignatureExplorer class, used to open/validate
	// CAdES signatures.
	const sigExplorer = new CadesSignatureExplorer(Util.getRestPkiClient());

	// Specify that we want to validate the signatures in the file, not only
	// inspect them.
	sigExplorer.validate = true;

	// Specify the parameters for the signature validation:
	// Accept any CAdES signature as long as the signer has an ICP-Brasil
	// certificate.
	sigExplorer.defaultSignaturePolicyId = StandardSignaturePolicies.CADES_BES;

	// Specify the security context to be used to determine trust in the
	// certificate chain. We have encapsulated the security context choice on
	// util.js.
	sigExplorer.securityContextId = Util.getSecurityContextId(res.locals.environment);
	
	// Set the CMS file to be opened.
	sigExplorer.setSignatureFileFromPath(filePath);

	// Generate a path for the encapsulated content, which is written below.
	StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists (see storage-mock.js).
	const outputFile = `${randomUUID()}.pdf`;
	
	// Call the open() method, which returns the signature file's information.
	sigExplorer.open(true)
		.then((signature) => {
			signature.writeEncapsulatedContentToFile(Util.getRestPkiClient(), path.join(APP_ROOT, 'app-data', outputFile))
				.then(() => {
					// Render the signature opening page.
					res.render('open-cades-restpki', { signature, outputFile });
				})
				.catch((err) => next(err));
		})
		.catch((err) => next(err));
});

module.exports = router;
