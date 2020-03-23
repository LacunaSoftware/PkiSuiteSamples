const express = require('express');

const { StorageMock } = require('../storage-mock');

const router = express.Router();

/**
 * GET /download
 *
 * Route to return a file identified by the "fileId" query parameter.
 */
router.get('/', (req, res, next) => {
	const { fileId } = req.query;

	// Verify if the provided file exists. And output the filename to be used
	// to download the file.
	const { exists, filename } = StorageMock.existsSync({ fileId, outputFilename: true });
	if (!exists) {
		const err = new Error('The fileId was not found');
		err.status = 404;
		next(err);
		return;
	}
	const content = StorageMock.readSync(fileId);

	res.setHeader('Content-Length', content.length);
	res.setHeader('Content-Disposition', `attachment;filename=${filename}`);
	res.write(content, 'binary');
	res.end();
});

/**
 * GET /download/cert
 *
 * Route to return the certificate file identified by the "fileId" query
 * parameter.
 */
router.get('/cert', (req, res, next) => {
	const { fileId } = req.query;
	const extension = '.cer';

	// Verify if the provided file exists. And output the filename to be used
	// to download the file.
	const { exists, filename } = StorageMock.existsSync({ fileId, extension, outputFilename: true });
	if (!exists) {
		const err = new Error('The fileId was not found');
		err.status = 404;
		next(err);
		return;
	}
	const content = StorageMock.readSync(fileId, extension);

	res.setHeader('Content-Length', content.length);
	res.setHeader('Content-Disposition', `attachment;filename=${filename}`);
	res.write(content, 'binary');
	res.end();
});

/**
 * GET /download/doc
 *
 */
router.get('/doc', (req, res) => {
	const { fileId } = req.query;
	const path = StorageMock.getBatchDocPath(fileId);
	res.download(path);
});

router.get('/sample', (req, res) => {
	const fileId = Number(req.query.fileId);
	const path = StorageMock.getSampleDocPath(fileId);
	res.download(path);
});

module.exports = router;
