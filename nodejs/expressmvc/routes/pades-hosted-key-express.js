const express = require('express');
const forge = require('node-forge');
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const { KeyClient, CryptographyClient } = require('@azure/keyvault-keys');
const { ClientSecretCredential } = require('@azure/identity');
const {
	PadesSignatureStarter,
	SignatureFinisher,
	StandardSignaturePolicies,
} = require('pki-express');

const { Util } = require('../util');
const { StorageMock } = require('../storage-mock');
const { PadesVisualElementsExpress } = require('../pades-visual-elements-express');

const router = express.Router();
const APP_ROOT = process.cwd();

// Azure Key Vault configuration
const TENANT_ID     = 'TENANT_ID'; // Replace with your Azure AD tenant ID
const CLIENT_ID     = 'CLIENT_ID'; // Replace with your Azure AD app credentials
const CLIENT_SECRET = 'CLIENT_SECRET'; // Replace with your Azure AD app credentials
const KEY_VAULT_URL = 'KEY_VAULT_URL'; // Replace with your Key Vault URL
const KEY_NAME      = 'AlanTuring'; // Replace with the name of the key in Azure Key Vault (must be an RSA key for this example)

// Path to the PFX/P12 file containing the certificate that corresponds to the
// Azure Key Vault key above. The private key inside this file is NOT used —
// only the certificate is read. Replace with the correct path.
const CERT_PFX_PATH     = path.join(APP_ROOT, 'public', 'Alan Mathison Turing.pfx');
const CERT_PFX_PASSWORD = '1234';

/**
 * GET /pades-hosted-key-express
 *
 * Performs a PAdES signature using a private key hosted in Azure Key Vault,
 * combined with PKI Express for the PDF signing structure.
 */
router.get('/', async (req, res, next) => {
	const { fileId } = req.query;

	if (!StorageMock.existsSync({ fileId })) {
		const notFound = new Error('The fileId was not found');
		notFound.status = 404;
		next(notFound);
		return;
	}

	try {
		// Step 1: Load the certificate that corresponds to the Azure Key Vault key.
		// This is the same certificate from the PFX file used in the C# example.
		// The private key inside the PFX is NOT used — signing happens in Azure KV.
		const pfxBuffer = fs.readFileSync(CERT_PFX_PATH);
		const pfxAsn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
		const pfx = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, CERT_PFX_PASSWORD);

		const certBags = pfx.getBags({ bagType: forge.pki.oids.certBag });
		const forgeCert = certBags[forge.pki.oids.certBag][0].cert;
		const certDer = forge.asn1.toDer(forge.pki.certificateToAsn1(forgeCert)).getBytes();
		const certBase64 = Buffer.from(certDer, 'binary').toString('base64');

		// Step 2: Authenticate with Azure Key Vault and get the CryptographyClient.
		const credential  = new ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET);
		const keyClient   = new KeyClient(KEY_VAULT_URL, credential);
		const vaultKey    = await keyClient.getKey(KEY_NAME);
		const cryptoClient = new CryptographyClient(vaultKey.id, credential);

		// Step 3: Prepare the signature with PKI Express.
		// PKI Express processes the PDF, applies the visual representation, and
		// returns the hash that Azure Key Vault will sign.
		const signatureStarter = new PadesSignatureStarter();
		Util.setPkiDefaults(signatureStarter);

		signatureStarter.signaturePolicy = StandardSignaturePolicies.PADES_BASIC_WITH_LTV;
		signatureStarter.setPdfToSignFromPathSync(StorageMock.getDataPath(fileId));
		signatureStarter.setCertificateFromBase64Sync(certBase64);
		signatureStarter.addFileReferenceSync('stamp', StorageMock.getPdfStampPath());
		signatureStarter.setVisualRepresentationSync(
			PadesVisualElementsExpress.getVisualRepresentation()
		);

		const { toSignHash, transferFile } = await signatureStarter.start();

		// Step 4: Sign the hash with Azure Key Vault.
		// RS256 = RSA-PKCS1v1.5 with SHA-256. Azure KV handles the DigestInfo
		// wrapping and padding internally, so we pass only the raw hash bytes.
		const signResult = await cryptoClient.sign('RS256', Buffer.from(toSignHash, 'base64'));
		const signature  = signResult.result.toString('base64');

		// Step 5: Complete the signature with PKI Express.
		// PKI Express embeds the Azure Key Vault signature into the signed PDF.
		const signatureFinisher = new SignatureFinisher();
		Util.setPkiDefaults(signatureFinisher);

		signatureFinisher.setFileToSignFromPathSync(StorageMock.getDataPath(fileId));
		signatureFinisher.setTransferFileFromPathSync(transferFile);
		signatureFinisher.signature = signature;

		const outputFile = `${uuidv4()}.pdf`;
		StorageMock.createAppDataSync();
		signatureFinisher.outputFile = path.join(APP_ROOT, 'app-data', outputFile);

		const signerCert = await signatureFinisher.complete(true);

		res.render('pades-hosted-key-express', {
			signedPdf: outputFile,
			signer: signerCert,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
