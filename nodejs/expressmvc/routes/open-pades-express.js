const express = require('express');
const { PadesSignatureExplorer } = require('pki-express');
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
	const { fileId } = req.query;

	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}
	const filePath = StorageMock.getDataPath(fileId);

	// Get an instance of PadesSignatureExplorer class, used to open/validate PDF
	// signatures.
	const sigExplorer = new PadesSignatureExplorer();

	// Set PKI default options (see util.js). They also set which certificates
	// PKI Express trusts: ICP-Brasil by default, plus the trustedRoots in the
	// config and, when trustLacunaTestRoot is set, Lacuna's test root.
	Util.setPkiDefaults(sigExplorer);

	// Specify that we want to validate the signatures in the file, not only
	// inspect them.
	sigExplorer.validate = true;

	// Set the PDF file.
	sigExplorer.setSignatureFileFromPathSync(filePath);

	// Call the open() method, which returns the signature file's information.
	sigExplorer.open()
		.then((signature) => res.render('open-pades-express', { signature }))
		.catch((err) => next(err));
});

module.exports = router;
