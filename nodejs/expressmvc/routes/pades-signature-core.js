const express = require("express");

const { StorageMock } = require("../storage-mock");
const { PadesVisualElementsCore } = require("../pades-visual-elements-core");
const { Util } = require("../util");

const router = express.Router();

/**
 * GET /pades-signature-core
 *
 * This route only renders the signature page.
 */
router.get("/", (req, res, next) => {
	// Get parameters from url
	const { fileId } = req.query;

	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error("The fileId was not found");
		notFound.status = 404;
		next(notFound);
		return;
	}

	res.render("pades-signature-core", { fileId });
});

/**
 * POST /pades-signature-core/start
 *
 * This route starts the signature using REST PKI Core. In this sample, it will be called
 * programmatically after the user press the "Sign File" button (see method
 * readCertificate() on public/javascripts/signature-start-form.js).
 */
router.post("/start", async (req, res, next) => {
	const { fileId } = req.query;

	// Recover variables from the POST arguments to be used on this step.
	const certThumb = req.body.certThumbField;
	const certContent = req.body.certContentField;

	// Read file content and convert to base64
	const fileContent = StorageMock.readSync(fileId);
	const fileContentBase64 = fileContent.toString("base64");

	try {
		const client = Util.getRestPkiCoreClient();
		const request = {
			file: {
				// set file content in base64
				content: fileContentBase64,
				contentType: "application/pdf",
				name: `${fileId}.pdf`,
			},
			certificate: {
				// set certificate content in base64
				content: certContent,
			},
			signatureType: "Pdf",
			// The security context determines which root certification authorities are trusted
			// when REST PKI Core validates the signer's certificate. We have encapsulated the
			// security context choice on util.js.
			securityContextId: Util.getSecurityContextId(),
			pdfSignatureOptions: {
				// Set the visual representation of the signature. We have encapsulated this code
				// (on pades-visual-elements-core.js) to be used on the REST PKI Core samples.
				visualRepresentation: PadesVisualElementsCore.getVisualRepresentation(),
			},
		};

		const response = await client.prepareSignature(request);

		// REST PKI Core validates the signer's certificate before preparing the signature. If
		// the certificate is not valid or not trusted, "success" is false and
		// "validationResults" says why.
		if (!response.data.success) {
			let details = "";
			const errors = response.data.validationResults && response.data.validationResults.errors;
			if (errors && errors.length > 0) {
				details = `: ${errors.map((item) => item.message).join("; ")}`;
			}
			throw new Error(`The signature could not be prepared (${response.data.failure})${details}`);
		}

		// Render the start page with the fields below, to be used on the javascript or on the
		// "complete" step:
		// - toSignHash: the hash to be signed by Web PKI, Base64-encoded.
		// - digestAlgorithm: the OID of the digest algorithm, which Web PKI needs to sign the
		//   hash.
		// - state: data that REST PKI Core needs to complete the signature, which we pass back to
		//   it on the "complete" step.
		res.render("pades-signature-core/start", {
			certThumb,
			certContent,
			state: response.data.state,
			toSignHash: response.data.toSign.hash,
			digestAlgorithm: response.data.toSign.signatureAlgorithm.digestAlgorithmOid,
			fileId,
		});
	} catch (err) {
		next(err);
	}
});

/**
 * POST /pades-signature-core/complete
 *
 * This route completes the signature using REST PKI Core, it will be called programmatically
 * after the Web PKI component perform the signature and submit the form (see method
 * sign() on public/javascripts/signature-complete-form.js).
 */
router.post("/complete", async (req, res, next) => {
	// Recover variables from the POST arguments to be used on this step.
	const state = req.body.state;
	const signature = req.body.signature;

	const completeSignatureRequest = {
		state: state,
		signature: signature,
	};

	try {
		const client = Util.getRestPkiCoreClient();
		const response = await client.completeSignature(
			completeSignatureRequest
		);

		// At this point, you'd typically store the signed PDF on your database. The "signedFile"
		// field holds a temporary link to it. For demonstration purposes, we'll download the
		// signed PDF and store it with our StorageMock class.
		const signedContent = await Util.download(response.data.signedFile.url);
		const signedPdf = StorageMock.storeSync(signedContent, null, ".pdf");

		res.render("pades-signature-core/complete", {
			signedPdf,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
