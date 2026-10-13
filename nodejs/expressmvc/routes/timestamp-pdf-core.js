const express = require("express");

const { StorageMock } = require("../storage-mock");
const { Util } = require("../util");

const router = express.Router();

// The timestamp tier determines which timestamp authority issues the timestamp. Here we use the
// PKI Brazil tier (ICP-Brasil timestamps), by its ID; the API also accepts a tier's name. The
// Node.js client has no tier constants, so to use a different tier, change this value.
const TIMESTAMP_TIER = "a402df41-8559-47b2-a05c-be555bf66310"; // PKI Brazil

/**
 * GET /timestamp-pdf-core
 *
 * This route adds a document timestamp to the uploaded PDF using REST PKI Core and renders a page
 * with a link to download the timestamped PDF. It is a server-only operation: no signature is made
 * and Web PKI is not involved. The user reaches it after uploading a PDF on the upload page, which
 * redirects here passing the file's id on the "fileId" URL argument.
 */
router.get("/", async (req, res, next) => {
	// Get parameters from url
	const { fileId } = req.query;

	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error("The fileId was not found");
		notFound.status = 404;
		next(notFound);
		return;
	}

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
			// Set the timestamp tier (see TIMESTAMP_TIER above).
			timestampTier: TIMESTAMP_TIER,
		};

		const response = await client.stampPdf(request);

		// At this point, you'd typically store the timestamped PDF on your database. The "file"
		// field holds it either inline, Base64-encoded on "content" (small files), or as a
		// temporary link on "url" (large files). For demonstration purposes, we'll store it with
		// our StorageMock class.
		const { file } = response.data;
		const stampedContent = file.content
			? Buffer.from(file.content, "base64")
			: await Util.download(file.url);
		const stampedPdf = StorageMock.storeSync(stampedContent, null, ".pdf");

		res.render("timestamp-pdf-core", {
			stampedPdf,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
