const express = require('express');
const { randomUUID } = require('crypto');
const {
	XmlElementSignatureStarter,
	FullXmlSignatureStarter,
	XmlSignatureFinisher,
	XmlInsertionOptions,
	StandardSignaturePolicies,
} = require('restpki-client');
const { Util } = require('../util');
const { SampleDocs, StorageMock } = require('../storage-mock');

const router = express.Router();

// IDs of the elements signed on the first two steps. They are the "id"
// attributes of the DadosDiploma and DadosRegistro elements of the sample
// diploma (public/SampleDiploma.xml). On your application, read them from the
// diploma being signed.
const DADOS_DIPLOMA_ID = 'Dip35141214314050000662550010001084271182362300';
const DADOS_REGISTRO_ID = 'Reg35141214314050000662550010001084271182362300';

/**
 * A Brazilian digital diploma XML is signed three times, one step after the
 * other, each step on the file produced by the previous one:
 *
 *   1. The DadosDiploma element, by the issuing institution (e-CNPJ), with the
 *      ICP-Brasil XAdES AD-RT policy (routes '/').
 *   2. The DadosRegistro element, by the registering institution's officer
 *      (e-CPF), with the ICP-Brasil XAdES AD-RT policy
 *      (routes '/dados-registro').
 *   3. The whole document, by the registering institution (e-CNPJ), with the
 *      ICP-Brasil XAdES AD-RA policy (routes '/diploma').
 */

// Finishes a signature started by one of the GET routes below and stores the
// signed XML, returning the fileId used to download it and to sign it again
// on the next step.
function finishAndStore(token) {
	// Get an instance of the XmlSignatureFinisher class, responsible for
	// completing the signature process.
	const signatureFinisher = new XmlSignatureFinisher(Util.getRestPkiClient());

	// Set the token for this signature (rendered in a hidden input field, see
	// the signature views).
	signatureFinisher.token = token;

	// Call the finish() method, which finalizes the signature process and
	// returns the SignatureResult object.
	return signatureFinisher.finish()
		.then((result) => {
			// At this point, you'd typically store the signed XML on your
			// database. For demonstration purposes, we'll store the XML on a
			// temporary folder and return an identifier that can be used to
			// download it.
			StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
			const filename = `${randomUUID()}.xml`;

			// The SignatureResult object has functions for writing the signature
			// file to a local file (writeToFile()) and to get its raw contents
			// (getContent()). For large files, use writeToFile() in order to
			// avoid memory allocation issues.
			return result.writeToFile(StorageMock.getDataPath(filename))
				// Replace the extension's '.' with '_', which is URL safe. The
				// StorageMock class reverts it when reading the file.
				.then(() => filename.replace('.', '_'));
		});
}

// Returns an error with status 404 when the file to be signed was not found.
function fileNotFound() {
	const notFound = new Error('The fileId was not found');
	notFound.status = 404;
	return notFound;
}

/**
 * GET /xml-diploma-signature-restpki
 *
 * This route initiates the signature of the DadosDiploma element of the sample
 * diploma using REST PKI and renders the signature page. It is usually signed
 * with an e-CNPJ certificate.
 */
router.get('/', (req, res, next) => {
	// Get an instance of the XmlElementSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const signatureStarter = new XmlElementSignatureStarter(Util.getRestPkiClient());

	// Set the XML to be signed, a sample Brazilian digital diploma pre-generated.
	signatureStarter.setXmlToSignFromPath(StorageMock.getSampleDocPath(SampleDocs.SAMPLE_DIPLOMA));

	// Set the ID of the element to be signed.
	signatureStarter.toSignElementId = DADOS_DIPLOMA_ID;

	// Insert the signature as the last child of the signed element.
	signatureStarter.setSignatureElementLocation('.', XmlInsertionOptions.APPEND_CHILD);

	// Set the signature policy.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.PKI_BRAZIL_XADES_ADR_TEMPO;

	// Set the security context to be used to determine trust in the certificate
	// chain. We have encapsulated the security context choice on util.js.
	signatureStarter.securityContext = Util.getSecurityContextId();

	// Call the startWithWebPki() method, which initiates the signature. This
	// yields the token, a 43-character case-sensitive URL-safe string, which
	// identifies this signature process. We'll use this value to call the
	// signWithRestPki() method on the Web PKI component
	// (see public/javascripts/signature-form.js) and also to complete the
	// signature after the form is submitted (see post method). This should not
	// be mistaken with the API access token.
	signatureStarter.startWithWebPki()
		.then((result) => {
			// The token acquired can only be used for a single signature attempt.
			// In order to retry the signature it is necessary to get a new token.
			// This can be a problem if the user uses the back button of the
			// browser, since the browser might show a cached page that we rendered
			// previously, with a now stale token. To prevent this from happening,
			// we set some response headers specifying that the page should not be
			// cached.
			Util.setExpiredPage(res);

			// Render the signature page.
			res.render('xml-diploma-signature-restpki/index', {
				token: result.token,
				sampleId: SampleDocs.SAMPLE_DIPLOMA,
			});
		})
		.catch((err) => next(err));
});

/**
 * POST /xml-diploma-signature-restpki
 *
 * This route receives the form submission from the view
 * 'xml-diploma-signature-restpki/index'. We'll call REST PKI to complete the
 * signature of the DadosDiploma element.
 */
router.post('/', (req, res, next) => {
	finishAndStore(req.body.token)
		.then((fileId) => {
			// Render the result page, with links to download the signed file and
			// to sign its DadosRegistro element.
			res.render('xml-diploma-signature-restpki/dados-diploma', { fileId });
		})
		.catch((err) => next(err));
});

/**
 * GET /xml-diploma-signature-restpki/dados-registro?fileId=<fileId>
 *
 * This route initiates the signature of the DadosRegistro element of the
 * diploma signed on the first step, using REST PKI, and renders the signature
 * page. It is usually signed with an e-CPF certificate.
 */
router.get('/dados-registro', (req, res, next) => {
	const { fileId } = req.query;

	// Verify if the provided fileId exists. This step can only run on the file
	// produced by the first step.
	if (!fileId || !StorageMock.existsSync({ fileId })) {
		next(fileNotFound());
		return;
	}

	// Get an instance of the XmlElementSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const signatureStarter = new XmlElementSignatureStarter(Util.getRestPkiClient());

	// Set the XML to be signed, the diploma with the DadosDiploma element
	// already signed.
	signatureStarter.setXmlToSignFromPath(StorageMock.getDataPath(fileId));

	// Set the ID of the element to be signed.
	signatureStarter.toSignElementId = DADOS_REGISTRO_ID;

	// Insert the signature as the last child of the signed element.
	signatureStarter.setSignatureElementLocation('.', XmlInsertionOptions.APPEND_CHILD);

	// Set the signature policy.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.PKI_BRAZIL_XADES_ADR_TEMPO;

	// Set the security context to be used to determine trust in the certificate
	// chain. We have encapsulated the security context choice on util.js.
	signatureStarter.securityContext = Util.getSecurityContextId();

	// Call the startWithWebPki() method, which initiates the signature and
	// yields the token (see the first GET route above).
	signatureStarter.startWithWebPki()
		.then((result) => {
			// Prevent the page, and its single-use token, from being cached (see
			// the first GET route above).
			Util.setExpiredPage(res);

			// Render the signature page.
			res.render('xml-diploma-signature-restpki/sign-dados-registro', {
				token: result.token,
				fileId,
			});
		})
		.catch((err) => next(err));
});

/**
 * POST /xml-diploma-signature-restpki/dados-registro
 *
 * This route receives the form submission from the view
 * 'xml-diploma-signature-restpki/sign-dados-registro'. We'll call REST PKI to
 * complete the signature of the DadosRegistro element.
 */
router.post('/dados-registro', (req, res, next) => {
	finishAndStore(req.body.token)
		.then((fileId) => {
			// Render the result page, with links to download the signed file and
			// to sign the whole diploma.
			res.render('xml-diploma-signature-restpki/dados-registro', { fileId });
		})
		.catch((err) => next(err));
});

/**
 * GET /xml-diploma-signature-restpki/diploma?fileId=<fileId>
 *
 * This route initiates the signature of the whole diploma signed on the second
 * step, using REST PKI, and renders the signature page. It is usually signed
 * with an e-CNPJ certificate.
 */
router.get('/diploma', (req, res, next) => {
	const { fileId } = req.query;

	// Verify if the provided fileId exists. This step can only run on the file
	// produced by the second step.
	if (!fileId || !StorageMock.existsSync({ fileId })) {
		next(fileNotFound());
		return;
	}

	// Get an instance of the FullXmlSignatureStarter class, responsible for
	// receiving the signature elements and start the signature process.
	const signatureStarter = new FullXmlSignatureStarter(Util.getRestPkiClient());

	// Set the XML to be signed, the diploma with the DadosDiploma and
	// DadosRegistro elements already signed.
	signatureStarter.setXmlToSignFromPath(StorageMock.getDataPath(fileId));

	// Set the signature policy. With no signature location set, the signature
	// is appended to the root element.
	signatureStarter.signaturePolicy = StandardSignaturePolicies.PKI_BRAZIL_XADES_ADR_ARQUIVAMENTO;

	// Set the security context to be used to determine trust in the certificate
	// chain. We have encapsulated the security context choice on util.js.
	signatureStarter.securityContext = Util.getSecurityContextId();

	// Call the startWithWebPki() method, which initiates the signature and
	// yields the token (see the first GET route above).
	signatureStarter.startWithWebPki()
		.then((result) => {
			// Prevent the page, and its single-use token, from being cached (see
			// the first GET route above).
			Util.setExpiredPage(res);

			// Render the signature page.
			res.render('xml-diploma-signature-restpki/sign-full-diploma', {
				token: result.token,
				fileId,
			});
		})
		.catch((err) => next(err));
});

/**
 * POST /xml-diploma-signature-restpki/diploma
 *
 * This route receives the form submission from the view
 * 'xml-diploma-signature-restpki/sign-full-diploma'. We'll call REST PKI to
 * complete the signature of the whole diploma.
 */
router.post('/diploma', (req, res, next) => {
	finishAndStore(req.body.token)
		.then((fileId) => {
			// Render the result page, with a link to download the signed diploma.
			res.render('xml-diploma-signature-restpki/diploma', { fileId });
		})
		.catch((err) => next(err));
});

module.exports = router;
