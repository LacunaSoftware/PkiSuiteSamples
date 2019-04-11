/*
 * This file allows the user to upload a file to be signed. Once the file is
 * uploaded, we save it to the * "public/app-data" folder and redirect the user
 * to the /pades-signature route passing the filename on the "fileId" URL
 * argument.
 */
const express = require('express');
const path = require('path');
const multer = require('multer');

const { StorageMock } = require('../storage-mock');

let upload = multer();
let router = express.Router();

router.get('/', (req, res) => {
	res.render('upload', {
		rc: req.query['rc']
	});
});

router.post('/', upload.single('userfile'), (req, res) => {

	// Generate a unique filename with the original extension.
	let extension = path.extname(req.file.originalname);

	// Store file generating a UUID to identify the document.
	let fileId = StorageMock.storeSync(req.file.buffer, null, extension);

	// Redirect the user to the signature route, passing the name of the file as
	// a URL argument.
	let redirectUrl = req.query['rc'];
	if (fileId) {
		redirectUrl += `?fileId=${fileId}`;
	}
	res.redirect(redirectUrl);
});

module.exports = router;
