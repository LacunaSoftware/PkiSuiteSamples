const express = require('express');
const { SampleDocs, StorageMock } = require('../storage-mock');

const router = express.Router();

class MergeServerFileModel {
	constructor(optionId, id1, id2, description) {
		this.optionId = optionId;
		this.id1 = id1;
		this.id2 = id2;
		this.description = description;
	}
}

router.get('/', (req, res) => {
	const availableFiles = [
		new MergeServerFileModel(0, SampleDocs.CMS_DETACHED_1, SampleDocs.CMS_DETACHED_2, 'A sample where both CMS don\'t have encapsulated content.'),
		new MergeServerFileModel(1, SampleDocs.CMS_ATTACHED_1, SampleDocs.CMS_DETACHED_2, 'A sample where a CMS has encapsulated content and another doesn\'t.'),
		new MergeServerFileModel(2, SampleDocs.CMS_ATTACHED_1, SampleDocs.CMS_ATTACHED_2, 'A sample where both CMS have encapsulated content.')];

	const sampleFileId = SampleDocs.CMS_DATA_FILE;

	res.render('merge-server-files', {
		availableFiles,
		sampleFileId
	});
});

router.post('/', (req, res) => {
	const sampleId = Number(req.body.selectedSample);

	let file1 = null;
	let file2 = null;
	const dataFile = StorageMock.readSampleDocSync(SampleDocs.CMS_DATA_FILE.valueOf());
	
	// Redirect the user to the signature route, passing the name of the file as
	// a URL argument.
	let redirectUrl = req.query.rc;
	
	switch (sampleId) {
	case 0:
		redirectUrl += `/detached?dataFileId=${StorageMock.storeSync(dataFile, null, '.pdf')}&`;
		file1 = StorageMock.readSampleDocSync(SampleDocs.CMS_DETACHED_1.valueOf());
		file2 = StorageMock.readSampleDocSync(SampleDocs.CMS_DETACHED_2.valueOf());
		break;
	case 1:
		redirectUrl += `/mixed?dataFileId=${StorageMock.storeSync(dataFile, null, '.pdf')}&`;
		file1 = StorageMock.readSampleDocSync(SampleDocs.CMS_ATTACHED_1.valueOf());
		file2 = StorageMock.readSampleDocSync(SampleDocs.CMS_DETACHED_2.valueOf());
		break;
	case 2:
		redirectUrl += '/attached?';
		file1 = StorageMock.readSampleDocSync(SampleDocs.CMS_ATTACHED_1.valueOf());
		file2 = StorageMock.readSampleDocSync(SampleDocs.CMS_ATTACHED_2.valueOf());
		break;
	default:
		break;
	}

	// Copy file to the App_Data folder, where the upload files is stored.
	const fileId1 = StorageMock.storeSync(file1, null, '.ps7');
	const fileId2 = StorageMock.storeSync(file2, null, '.ps7');

	redirectUrl += `fileId1=${fileId1}&fileId2=${fileId2}`;
	res.redirect(redirectUrl);
});

module.exports = router;
