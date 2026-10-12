const express = require('express');
const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

const router = express.Router();

/*
 * GET /check-pades-core
 *
 * This route submits a PDF file to REST PKI Core for inspection of its signatures
 * and renders the results.
 */
router.get('/', async (req, res, next) => {
	// On printer-friendly-version, we stored the unformatted version of
	// the verification code (without hyphens) but used the formatted version
	// (with hyphens) on the printer-friendly PDF. Now, we remove the hyphen
	// before looking it up.
	const verificationCode = Util.parseVerificationCode(req.query.code);

	// Our demo only works if a userfile is given to work with.
	const fileId = StorageMock.lookupVerificationCode(req.session, verificationCode);

	if (!fileId) {
		res.status(404).send('Not found');
		return;
	}

	const client = Util.getRestPkiCoreClient();
	const fileContent = StorageMock.readSync(fileId);

	client.inspectSignature({
		file: {
			content: fileContent.toString('base64'),
			contentType: 'application/pdf',
			name: `${fileId}.pdf`,
		},
		validate: true,
		securityContextId: Util.getSecurityContextId(),
	}).then((response) => {
		res.render('check-pades-core', {
			signature: response.data,
			fileId,
		});
	}).catch((err) => next(err));
});

module.exports = router;
