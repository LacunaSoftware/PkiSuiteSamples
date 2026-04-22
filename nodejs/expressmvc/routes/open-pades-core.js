const express = require('express');
const { StorageMock } = require('../storage-mock');
const { Util } = require('../util');

const router = express.Router();

/**
 * GET /open-pades-core
 *
 * Inspects and validates signatures on a PDF file using REST PKI Core.
 */
router.get('/', async (req, res, next) => {
	const { fileId } = req.query;

	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}

	try {
		const client = Util.getRestPkiCoreClient();
		const fileContent = StorageMock.readSync(fileId);

		const response = await client.inspectSignature({
			file: {
				content: fileContent.toString('base64'),
				contentType: 'application/pdf',
				name: `${fileId}.pdf`,
			},
			validate: true,
			securityContextId: Util.getSecurityContextId(),
		});

		res.render('open-pades-core', { signature: response.data });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
