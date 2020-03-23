const express = require('express');
const { PadesSignatureExplorer, StandardSignaturePolicies } = require('pki-express');
const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

const router = express.Router();

/*
* GET /check
*
* This route submits a PDF file to PKI Express for inspection of its signatures
* and renders the results.
*/
router.get('/', (req, res, next) => {
	// On printer-friendly-version, we stored the unformatted version of
	// the verification code (without hyphens) but used the formatted version
	// (with hyphens) on the printer-friendly PDF. Now, we remove the hyphen
	// before looking it up.
	const verificationCode = Util.parseVerificationCode(req.query.code);

	// Our demo only works if a userfile is given to work with
	const fileId = StorageMock.lookupVerificationCode(req.session, verificationCode);

	if (!fileId) {
		// Invalid code given!
		res.status(404).send('Not found');
		return;
	}

	// Get an instance of PadesSignatureExplorer class, used to open/validate PDF
	// signatures.
	const sigExplorer = new PadesSignatureExplorer();
	Util.setPkiDefaults(sigExplorer);

	// Locate document from storage.
	const filePath = StorageMock.getDataPath(fileId);

	// Se the PDF file to be inspected.
	sigExplorer.setSignatureFileFromPathSync(filePath);

	// Specify that we want to validate the signatures in the file, not only
	// inspect them.
	sigExplorer.validate = true;

	// Specify the signature policy for signature validation. On this sample, we
	// will accept any valid PAdES signature as long as the signer is trusted by
	// the security context.
	sigExplorer.defaultSignaturePolicyId = StandardSignaturePolicies.PADES_BASIC;

	// Specify the security context to be used to determine trust in the
	// certificate chain. We have encapsulated the security context choice on
	// util.js.
	sigExplorer.securityContextId = Util.getSecurityContextId(res.locals.environment);

	// Call the open() method, which returns the signature file's information.
	sigExplorer.open().then((signature) => {
		// Render the check page.
		res.render('check-pades-express', {
			signature,
			fileId,
		});
	}).catch((err) => next(err));
});

module.exports = router;
