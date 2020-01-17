const express = require('express');

const router = express.Router();

/**
 * Define routes.
 */
router.use('/', require('./home'));
router.use('/authentication-restpki', require('./authentication-restpki'));
router.use('/batch-pades-signature-express', require('./batch-pades-signature-express'));
router.use('/batch-pades-signature-restpki', require('./batch-pades-signature-restpki'));
router.use('/batch-cades-signature-restpki', require('./batch-cades-signature-restpki'));
router.use('/cades-signature-restpki', require('./cades-signature-restpki'));
// router.use('/cades-signature-express', require('./cades-signature-express')); // TODO: Uncomment when PKI Express supports cades signature 
router.use('/download', require('./download'));
// router.use('/merge-cades-express', require('./merge-cades-express')); // TODO: Uncomment when PKI Express supports merge cades file
// router.use('/merge-server-files', require('./merge-server-files')); // TODO: Uncomment when PKI Express supports merge cades file
// router.use('/open-cades-express', require('./open-cades-express')); // TODO: Uncomment when PKI Express supports cades validation
router.use('/open-pades-express', require('./open-pades-express'));
router.use('/open-pades-restpki', require('./open-pades-restpki'));
router.use('/pades-signature-express', require('./pades-signature-express'));
router.use('/pades-signature-restpki', require('./pades-signature-restpki'));
router.use('/upload', require('./upload'));
router.use('/server-files', require('./server-files'));
router.use('/xml-nfe-signature-restpki', require('./xml-nfe-signature-restpki'));
router.use('/xml-signature-restpki', require('./xml-signature-restpki'));
router.use('/printer-version-pades-restpki', require('./printer-version-pades-restpki'));
router.use('/printer-version-pades-express', require('./printer-version-pades-express'));
router.use('/check-pades-restpki', require('./check-pades-restpki'));
router.use('/check-pades-express', require('./check-pades-express'));
router.use('/list-cert-select2', require('./list-cert-select2'));
router.use('/list-cert-jquery', require('./list-cert-jquery'));
router.use('/read-cert-select2', require('./read-cert-select2'));
router.use('/read-cert-jquery', require('./read-cert-jquery'));
router.use('/rsa-web', require('./rsa-web'));
router.use('/pades-server-key-express', require('./pades-server-key-express'));
router.use('/timestamp-pdf-express', require('./timestamp-pdf-express'));

module.exports = router;
