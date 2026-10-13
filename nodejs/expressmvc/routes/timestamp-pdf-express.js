const express = require('express');
const { v4: uuidv4 } = require('uuid');
const {
	PadesTimestamper,
} = require('pki-express');

const { StorageMock } = require('../storage-mock');
const { Util } = require('../util');

const router = express.Router();

/**
 * GET /timestamp-pdf-express
 *
 * This route adds a document timestamp to the given PDF and returns the
 * timestamped PDF.
 */
router.get('/', (req, res, next) => {
	// Our demo only works if a "file" is given to work with.
	const { fileId } = req.query;
	if (!fileId || !StorageMock.existsSync({ fileId })) {
		res.status(404).send('Not found');
		return;
	}

	generateTimestampVersion(StorageMock.getDataPath(fileId))
		.then((stampedContent) => {
			// Return the timestamped PDF.
			res.type('pdf');
			res.send(stampedContent);
		})
		.catch((err) => next(err));
});

function generateTimestampVersion(pdfPath) {
	return new Promise((resolve, reject) => {
		// Get an instance of the PadesTimestamper class, used to timestamp a PDF
		// file.
		const stamper = new PadesTimestamper();

		// Set PKI default (see util.js).
		Util.setPkiDefaults(stamper);

		// Set the PDF to be timestamped.
		stamper.setPdfFromPath(pdfPath).then(() => {
			// Generate path for output file and add to the stamper.
			StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
			const outputFileId = uuidv4();
			stamper.setOutputFilePath(StorageMock.getDataPath(outputFileId, '.pdf'));

			// Add a timestamp to the PDF file.
			stamper.stamp().then(() => {
				// Read the timestamped PDF.
				resolve(StorageMock.readSync(outputFileId, '.pdf'));
			}).catch((err) => { reject(err); });
		}).catch((err) => { reject(err); });
	});
}

module.exports = router;
