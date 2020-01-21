// - TODO: Uncomment when PKI Express supports cades validation
// const express = require('express');
// const path = require('path');
// const uuidv4 = require('uuid/v4');
// const { CadesSignatureExplorer } = require('pki-express');

// const { Util } = require('../util');
// const { StorageMock } = require('../storage-mock');

// const router = express.Router();
// const APP_ROOT = process.cwd();

// router.get('/', (req, res, next) => {
// 	const { fileId } = req.query;

// 	// Verify if the provided userfile exists
// 	if (!StorageMock.existsSync({ fileId })) {
// 		const notFound = new Error('The fileId was not found');
// 		notFound.status = 404;
// 		next(notFound);
// 		return;
// 	}
// 	const filePath = StorageMock.getDataPath(fileId);

// 	// Get an instance of the CadesSignatureExplorer class, used tod open/validate
// 	// PKCS #12 signatures.
// 	const sigExplorer = new CadesSignatureExplorer();

// 	// Set PKI default options (see utils.js)
// 	Util.setPkiDefaults(sigExplorer);

// 	// Specify that we want to validate the signatures in the file, not only
// 	// inspect them.
// 	sigExplorer.validate = true;

// 	// Specify that we want to validate the signatures in the file, not only
// 	// inspect them.
// 	sigExplorer.setSignatureFileFromPathSync(filePath);

// 	// Generate path for output file and add the signature finisher.
// 	StorageMock.createAppData(); // Make sure the "app-data" folder exists (util.js).
// 	const outputFile = `${uuidv4()}.pdf`;
// 	sigExplorer.setExtractContentPath(path.join(APP_ROOT, 'app-data', outputFile));

// 	// Call the open() method, which returns the signature file's information.
// 	sigExplorer.open()
// 		.then((signature) => {
// 			// Render the signature opening page.
// 			res.render('open-cades-express', { signature, outputFile });
// 		})
// 		.catch((err) => next(err));
// });

// module.exports = router;
