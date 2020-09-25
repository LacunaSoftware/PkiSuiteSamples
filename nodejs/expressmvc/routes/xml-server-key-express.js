const express = require('express');
const path = require('path');
const uuidv4 = require('uuid/v4');
const {
	XmlSigner,
	StandardSignaturePolicies,
	Pkcs12Generator
} = require('pki-express');
const { Config } = require('../config');
const { Util } = require('../util');
const { SampleDocs, StorageMock } = require('../storage-mock');

const router = express.Router();
const APP_ROOT = process.cwd();

/*
 * GET /xml-server-key-express
 *
 * This route only renders the signature page.
 * 
 */
router.get('/', async (req, res, next) => {
	const { certId } = req.query;

	const signer = new XmlSigner();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(signer);

	// Set signature policy.
	signer.signaturePolicy = StandardSignaturePolicies.XADES_BES;

	try {
		// Set the XML to be signed.
		await signer.setXmlToSignFromPath(StorageMock.getSampleDocPath(SampleDocs.SAMPLE_XML));

		// Set the PKCS #12 certificate path. We have an logic for choosing the generate the PKCS #12
		// from "issue certificate" samples or a sample PKCS #12.
		if (certId) {
			// Verify if the provided certId refers to an existing certificate file and
			// key.
			if (!StorageMock.existsSync({fileId: certId, extension: '.json'}) ||
				!StorageMock.existsSync({fileId: certId, extension: '.cer'})) {
				let notFound = new Error(`The PKI files referred by certId: ${certId} were not found`);
				notFound.status = 404;
				next(notFound);
				return;
			}

			// Get PKCS#12 password from global configuration.
			const pkcs12Password = Config.getInstance().get('pkcs12Password');

			// Generate PKCS #12. We have encapsulated this operation on generatePkcs12() method.
			let pkcs12GenResult = await generatePkcs12(certId, pkcs12Password);

			// Set the generated PKCS #12 and its password on PadesSigner instance.
			await signer.setPkcs12FromRaw(pkcs12GenResult.getPfx().getContentRaw());
			signer.certPassword = pkcs12Password;
		} else {
			// Set sample PKCS #12 path.
			await signer.setPkcs12FromPath(StorageMock.getSamplePkcs12Path());
			signer.certPassword = '1234';
		}

		// Generate path for output file and add the signature finisher.
		const outputFile = `${uuidv4()}.xml`;
		StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
		signer.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

		// Perform the signature.
		let signerCert = await signer.sign(true);
	
		res.render('xml-server-key-express', {
			signedXml: outputFile,
			signerCert: signerCert,
		});
	} catch(err) { next(err); }
});

async function generatePkcs12(certId, password) {
	// Get an instance of the Pkcs12Generator class, responsible for generate
	// a PKCS #12 from a generated key and certificate file. This certificate
	// will be used to sign the uploaded PDF.
	let keyJson = StorageMock.readSync(certId, '.json').toString('utf-8');
	let pkcs12Generator = new Pkcs12Generator({
		key: keyJson
	});

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(pkcs12Generator);

	// Set the certificate file.
	pkcs12Generator.setCertFileFromPathSync(StorageMock.getDataPath(certId, '.cer'));

	// Generate PKCS #12 file using the default password.
	return await pkcs12Generator.generate(password);
}

module.exports = router;
