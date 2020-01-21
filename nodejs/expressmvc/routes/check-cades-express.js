// TODO: Uncomment when PKI Express supports cades validation
// const express = require('express');
// const uuidv4 = require('uuid/v4');
// const path = require('path');

// const { CadesSignatureExplorer } = require('pki-express');
// const { Util } = require('../util');
// const { StorageMock } = require('../storage-mock');

// const router = express.Router();
// const APP_ROOT = process.cwd();

// /*
// * GET /check
// *
// * This route submits a PDF file to PKI Express for inspection of its signatures
// * and renders the results.
// */
// router.get('/', (req, res, next) => {
// 	// On printer-friendly-version, we stored the unformatted version of
// 	// the verification code (without hyphens) but used the formatted version
// 	// (with hyphens) on the printer-friendly PDF. Now, we remove the hyphen
// 	// before looking it up.
// 	const verificationCode = Util.parseVerificationCode(req.query.code);

// 	// Our demo only works if a userfile is given to work with
// 	const fileId = StorageMock.lookupVerificationCode(req.session, verificationCode);

// 	if (!fileId) {
// 		// Invalid code given!
// 		res.status(404).send('Not found');
// 		return;
// 	}

// 	// Get an instance of CadesSignatureExplorer class, used to open/validate PDF
// 	// signatures.
// 	const sigExplorer = new CadesSignatureExplorer();
// 	Util.setPkiDefaults(sigExplorer);

// 	// Locate document from storage.
// 	const filePath = StorageMock.getDataPath(fileId);

// 	// Se the PDF file to be inspected.
// 	sigExplorer.setSignatureFileFromPathSync(filePath);

// 	// Specify that we want to validate the signatures in the file, not only
// 	// inspect them.
// 	sigExplorer.validate = true;

// 	// Specify the security context to be used to determine trust in the
// 	// certificate chain. We have encapsulated the security context choice on
// 	// util.js.
// 	sigExplorer.securityContextId = Util.getSecurityContextId(res.locals.environment);

// 	// Generate path for output file and add the signature finisher.
// 	StorageMock.createAppData(); // Make sure the "app-data" folder exists (util.js).
// 	const extractedContent = `${uuidv4()}.pdf`;
// 	sigExplorer.setExtractContentPath(path.join(APP_ROOT, 'app-data', extractedContent));

// 	// Call the open() method, which returns the signature file's information.
// 	sigExplorer.open().then((signature) => {
// 		// Render the check page.
// 		res.render('check-cades-express', {
// 			signature,
// 			fileId,
// 			extractedContent,
// 		});
// 	}).catch((err) => next(err));
// });

// module.exports = router;
