const express = require("express");
const crypto = require("crypto");
const forge = require("node-forge");
const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid/v4");
const { StorageMock } = require("../storage-mock");
const { Util } = require("../util");
const router = express.Router();

/**
 * GET /pades-server-key-core
 *
 * This route performs a PAdES signature using a server-side certificate and key. Unlike the
 * standard PAdES signature sample (which relies on Web PKI to sign on the client), this sample
 * performs the entire signature process on the server in a single request:
 *
 *   1. Reads the server certificate and private key from a PFX/PKCS#12 file.
 *   2. Uploads the certificate and PDF to REST PKI Core to prepare the signature.
 *   3. Signs the hash locally using the server's private key.
 *   4. Sends the signed hash back to REST PKI Core to complete the signature.
 *   5. Downloads the signed PDF and saves it locally for the download route.
 */

router.get("/", async (req, res, next) => {
	const { fileId } = req.query;
	// Verify if the provided fileId exists.
	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error("The fileId was not found");
		notFound.status = 404;
		next(notFound);
		return;
	}
	try {
		const client = Util.getRestPkiCoreClient();
		// Read the server certificate (PFX/PKCS#12) containing the certificate and private key.

		const certPath = StorageMock.getSamplePkcs12Path();
		const certPassword = "1234";
		const pfxBuffer = fs.readFileSync(certPath);

		// Parse the PFX file using node-forge to extract the certificate and private key.
		const pfxAsn1 = forge.asn1.fromDer(pfxBuffer.toString("binary"));
		const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, certPassword);

		// Extract the certificate in base64-encoded DER format for REST PKI Core.
		const certBags = pfx.getBags({ bagType: forge.pki.oids.certBag });
		const cert = certBags[forge.pki.oids.certBag][0].cert;
		const certDer = forge.asn1
			.toDer(forge.pki.certificateToAsn1(cert))
			.getBytes();
		const certBase64 = Buffer.from(certDer, "binary").toString("base64");

		// Extract the private key and convert to PEM for use with Node.js crypto.
		const keyBags = pfx.getBags({
			bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
		});
		const forgePrivateKey =
			keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;
		const privateKeyPem = forge.pki.privateKeyToPem(forgePrivateKey);
		const privateKey = crypto.createPrivateKey(privateKeyPem);

		// Read the PDF file content and convert to base64.
		const fileContent = StorageMock.readSync(fileId);
		const fileContentBase64 = fileContent.toString("base64");

		// Step 1: Prepare the signature with REST PKI Core.
		const prepareRequest = {
			file: {
				content: fileContentBase64,
				contentType: "application/pdf",
				name: `${fileId}.pdf`,
			},
			certificate: {
				content: certBase64,
			},
			securityContextId: Util.getSecurityContextId(),
		};
		const prepareResponse = await client.prepareSignature(prepareRequest);

		// DigestInfo ASN.1 headers per algorithm
		const digestInfoHeaders = {
			"SHA-256": Buffer.from(
				"3031300d060960864801650304020105000420",
				"hex"
			),
			"SHA-384": Buffer.from(
				"3041300d060960864801650304020205000430",
				"hex"
			),
			"SHA-512": Buffer.from(
				"3051300d060960864801650304020305000440",
				"hex"
			),
			"SHA-1": Buffer.from("3021300906052b0e03021a05000414", "hex"),
		};

		// Normalize algorithm name to match our dictionary keys.
		// The API may return "SHA256", "sha256", "sha-256", etc.
		function normalizeAlgorithm(alg) {
			const upper = alg.toUpperCase().replace(/[^A-Z0-9]/g, "");
			const map = {
				SHA1: "SHA-1",
				SHA256: "SHA-256",
				SHA384: "SHA-384",
				SHA512: "SHA-512",
			};
			const normalized = map[upper];
			if (!normalized) {
				throw new Error(`Unsupported digest algorithm: "${alg}"`);
			}
			return normalized;
		}

		// Step 2: Sign the hash WITHOUT re-hashing
		const toSignHash = Buffer.from(
			prepareResponse.data.toSignHash.value,
			"base64"
		);
		const digestAlgorithm = normalizeAlgorithm(
			prepareResponse.data.toSignHash.algorithm
		);

		const header = digestInfoHeaders[digestAlgorithm];
		const digestInfo = Buffer.concat([header, toSignHash]);

		const signature = crypto.privateEncrypt(
			{ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
			digestInfo
		);
		const signatureBase64 = signature.toString("base64");

		// Step 3: Complete the signature with REST PKI Core.
		const completeRequest = {
			state: prepareResponse.data.state,
			signature: signatureBase64,
		};
		const completeResponse =
			await client.completeSignature(completeRequest);

		// Step 4: Download the signed PDF from REST PKI Core and save it
		// locally so the /download route can serve it.
		const signedFileUrl = completeResponse.data.signedFile.location;
		const response = await fetch(signedFileUrl);
		if (!response.ok) {
			throw new Error(
				`Failed to download signed file: ${response.status} ${response.statusText}`
			);
		}
		const signedFileBuffer = Buffer.from(await response.arrayBuffer());

		// Save to local app-data with a unique filename, matching how
		// the PKI Express sample stores its output.
		const outputFile = `${uuidv4()}.pdf`;
		StorageMock.createAppDataSync();
		const outputPath = path.join(process.cwd(), "app-data", outputFile);
		fs.writeFileSync(outputPath, signedFileBuffer);

		// Render the result page with the local file ID.
		res.render("pades-server-key-core", {
			signedPdf: outputFile,
			signer: prepareResponse.data.certificate,
		});
	} catch (err) {
		next(err);
	}
});
module.exports = router;
