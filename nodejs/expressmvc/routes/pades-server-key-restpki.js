const express = require("express");
const crypto = require("crypto");
const forge = require("node-forge");
const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid/v4");
const {
	PadesSignatureStarter,
	PadesSignatureFinisher,
	StandardSignaturePolicies,
	StandardSecurityContexts,
	PadesMeasurementUnits,
} = require("restpki-client");
const { StorageMock } = require("../storage-mock");
const { Util } = require("../util");
const { PadesVisualElementsRestPki } = require("../pades-visual-elements-restpki");

const router = express.Router();
const APP_ROOT = process.cwd();

/**
 * GET /pades-server-key-restpki
 *
 * This route performs a PAdES signature using a server-side PKCS#12 certificate with REST PKI.
 * The process includes:
 *   1. Load the server certificate and private key from a PKCS#12 file
 *   2. Use REST PKI to prepare the signature with the certificate
 *   3. Sign the hash locally using the server's private key
 *   4. Complete the signature with REST PKI
 *   5. Save and display the signed PDF
 */
router.get("/", async (req, res, next) => {
	const { fileId } = req.query;

	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error("The fileId was not found");
		notFound.status = 404;
		next(notFound);
		return;
	}

	try {
		// Read the server certificate (PKCS#12) containing the certificate and private key
		const certPath = StorageMock.getSamplePkcs12Path();
		const certPassword = "1234";
		const pfxBuffer = fs.readFileSync(certPath);

		// Parse the PFX file using node-forge to extract certificate and private key
		const pfxAsn1 = forge.asn1.fromDer(pfxBuffer.toString("binary"));
		const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, certPassword);

		// Extract certificate in base64-encoded DER format for REST PKI
		const certBags = pfx.getBags({ bagType: forge.pki.oids.certBag });
		const cert = certBags[forge.pki.oids.certBag][0].cert;
		const certDer = forge.asn1
			.toDer(forge.pki.certificateToAsn1(cert))
			.getBytes();
		const certBase64 = Buffer.from(certDer, "binary").toString("base64");

		// Extract private key and convert to PEM for use with Node.js crypto
		const keyBags = pfx.getBags({
			bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
		});
		const forgePrivateKey =
			keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;
		const privateKeyPem = forge.pki.privateKeyToPem(forgePrivateKey);
		const privateKey = crypto.createPrivateKey(privateKeyPem);

		// Get REST PKI client
		const restPkiClient = Util.getRestPkiClient();

		// Step 1: Prepare the signature with REST PKI
		const signatureStarter = new PadesSignatureStarter(restPkiClient);

		// Set PDF to sign
		signatureStarter.setPdfToSignFromPath(StorageMock.getDataPath(fileId));

		// Set the certificate (in DER format as buffer)
		signatureStarter.signerCertificate = Buffer.from(certBase64, "base64");

		// Set signature policy
		signatureStarter.signaturePolicy = StandardSignaturePolicies.PADES_BASIC;

		// Set security context
		signatureStarter.securityContext = Util.getSecurityContextId();

		// Set measurement units
		signatureStarter.measurementUnits = PadesMeasurementUnits.CENTIMETERS;

		// Set visual representation
		const visualRepresentation = await PadesVisualElementsRestPki.getVisualRepresentation();
		signatureStarter.visualRepresentation = visualRepresentation;

		// Start the signature
		const startResult = await signatureStarter.start();

		// DigestInfo ASN.1 headers keyed by OID
		const digestInfoHeaders = {
			"1.3.14.3.2.26":          Buffer.from("3021300906052b0e03021a05000414", "hex"),          // SHA-1
			"2.16.840.1.101.3.4.2.1": Buffer.from("3031300d060960864801650304020105000420", "hex"),  // SHA-256
			"2.16.840.1.101.3.4.2.2": Buffer.from("3041300d060960864801650304020205000430", "hex"),  // SHA-384
			"2.16.840.1.101.3.4.2.3": Buffer.from("3051300d060960864801650304020305000440", "hex"),  // SHA-512
		};

		// Step 2: Sign the hash with the server's private key
		const toSignHash = Buffer.from(startResult.toSignHash, "base64");
		const oid = startResult.digestAlgorithmOid;
		const header = digestInfoHeaders[oid];
		if (!header) {
			throw new Error(`Unsupported digest algorithm OID: "${oid}"`);
		}

		const digestInfo = Buffer.concat([header, toSignHash]);

		const signature = crypto.privateEncrypt(
			{ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
			digestInfo
		);
		const signatureBase64 = signature.toString("base64");

		// Step 3: Complete the signature with REST PKI
		const finisher = new PadesSignatureFinisher(restPkiClient);
		finisher.token = startResult.token;
		finisher._signature = signatureBase64;

		const finishResult = await finisher.finish();

		// Step 4: Save the signed PDF
		const outputFile = `${uuidv4()}.pdf`;
		StorageMock.createAppDataSync();
		const outputPath = path.join(APP_ROOT, "app-data", outputFile);

		finishResult.writeToFile(outputPath).then(() => {
			// Render result page
			res.render("pades-server-key-restpki", {
				signedPdf: outputFile,
				signer: finishResult.certificate,
			});
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
