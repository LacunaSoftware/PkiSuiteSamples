const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {
	PadesTimestamper,
} = require('pki-express');

const { StorageMock } = require('../storage-mock');
const { Util } = require('../util');

const router = express.Router();
const APP_ROOT = process.cwd();

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
		.then((pfvContent) => {
			// Return the generate file.
			res.type('pdf');
			res.send(pfvContent);
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
			const outputFile = `${uuidv4()}.pdf`;
			const outputFilePath = path.join(APP_ROOT, 'app-data', outputFile);
			stamper.setOutputFilePath(outputFilePath);

			// Add a timestamp to the PDF file.
			stamper.stamp().then(() => {
				// Read printer-friendly version.
				fs.readFile(outputFilePath, (err, pfvContent) => {
					if (err) {
						reject(err);
						return;
					}
					resolve(pfvContent);
				});
			}).catch((err) => { reject(err); });
		}).catch((err) => { reject(err); });
	});
}

module.exports = router;
