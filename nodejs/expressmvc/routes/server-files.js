const express = require('express');
const path = require('path');
const { SampleDocs, StorageMock } = require('../storage-mock');

const router = express.Router();

class ServerFileModel {
	constructor(id, description) {
		this.id = id;
		this.description = description;
		this.downloadUrl = `/download/sample?fileId=${id}`;
	}
}

router.get('/', (req, res, next) => {
	let availableFiles = [];
	let err = '';
	switch (req.query.op) {
	case 'cosignCms':
		availableFiles = [new ServerFileModel(SampleDocs.CMS_SIGNED_ONCE, 'A sample CMS file that was signed once.'), new ServerFileModel(SampleDocs.CMS_SIGNED_TWICE, 'A sample CMS file that was signed twice.')];
		break;
	case 'cosignPdf':
	case 'printerFriendlyPdf':
		availableFiles = [new ServerFileModel(SampleDocs.PDF_SIGNED_ONCE, 'A sample PDF that was signed once.'), new ServerFileModel(SampleDocs.PDF_SIGNED_TWICE, 'A sample PDF that was signed twice.')];
		break;
	case 'signCms':
	case 'signPdf':
		availableFiles = [new ServerFileModel(SampleDocs.SAMPLE_PDF, 'A sample PDF file to be signed.')];
		break;
	default:
		err = new Error('Invalid Operation.');
		err.status = 500;
		next(err);
		return;
	}

	res.render('server-files', {
		rc: req.query.rc,
		availableFiles,
	});
});

router.post('/', (req, res) => {
	const sampleId = Number(req.body.selectedFile);
	const fileName = StorageMock.getSampleDocName(sampleId);
	const fileExtension = path.extname(fileName);

	// Copy file to the App_Data folder, where the upload files is stored.
	const file = StorageMock.readSampleDocSync(sampleId);
	const fileId = StorageMock.storeSync(file, null, fileExtension);

	// Redirect the user to the signature route, passing the name of the file as
	// a URL argument.
	let redirectUrl = req.query.rc;
	if (req.query.op === 'cosignCms') {
		redirectUrl += `?cmsfile=${fileId}`;
	} else {
		redirectUrl += `?fileId=${fileId}`;
	}
	res.redirect(redirectUrl);
});

module.exports = router;
