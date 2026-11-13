const express = require('express');
const path = require('path');
const { randomUUID } = require('crypto');
const { CadesSignatureExplorer } = require('pki-express');

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
	const sigExplorer = new CadesSignatureExplorer();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(sigExplorer);

	// Specify that we want to validate the signatures in the file, not only
	// inspect them.
	sigExplorer.validate = true;

	// Set the CMS file to be opened.
	sigExplorer.setSignatureFileFromPathSync(filePath);

	// Generate a path for the encapsulated content and set it on the signature
	// explorer.
	StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists (see storage-mock.js).
	const outputFile = `${randomUUID()}.pdf`;
	sigExplorer.setExtractContentPath(path.join(APP_ROOT, 'app-data', outputFile));

	// Call the open() method, which returns the signature file's information.
	sigExplorer.open()
		.then((signature) => {
			// Render the signature opening page.
			res.render('open-cades-express', { signature, outputFile });
		})
		.catch((err) => next(err));
});

module.exports = router;
