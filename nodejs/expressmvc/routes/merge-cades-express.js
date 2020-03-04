const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const { CadesSignatureEditor } = require('pki-express');

const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();


/*
 * GET /merge-cades-express/
 *
 * This sample performs a merge of CAdES signature using PKI Express
 *
 */
router.get('/', (req, res) => {
	const { fileId1 } = req.query;
	const { fileId2 } = req.query;
	const { dataFileId } = req.query;
	const signatureEditor = new CadesSignatureEditor();
	Util.setPkiDefaults(signatureEditor);

	const outputFile = `${uuidv4()}.ps7`;

	if(dataFileId){
		signatureEditor.setDataFileFromPathSync(StorageMock.getDataPath(dataFileId));
	}
	signatureEditor.addCmsFileFromPathSync(StorageMock.getDataPath(fileId1));
	signatureEditor.addCmsFileFromPathSync(StorageMock.getDataPath(fileId2));
	signatureEditor.setOutputFilePath(path.join(APP_ROOT, 'app-data', outputFile));

	signatureEditor.merge()
		.then(() => {
			res.render('merge-cades-express', { outputFile: outputFile.replace('.', '_') });
		});
});

module.exports = router;
