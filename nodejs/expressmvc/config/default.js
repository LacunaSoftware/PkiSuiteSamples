/**
 * This module contains the default application settings.
 */
module.exports = {

	// ==========================================================================
	// Application Settings
	// ==========================================================================
	debug: true,
	protocol: 'http',
	sessionSecret: 'keyboard cat',

	// Server HTTP port.
	port: process.env.PORT || '3000',

	// Application Environment.
	environment: 'default',

	// Trust in Lacuna Test PKI (for development purposes only!)
	trustLacunaTestRoot: true,
	// THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!

	// --------------------------------------------------------------------------
	// REST PKI
	// --------------------------------------------------------------------------
	restPki: {
		// ========================================================
		//     >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
		// ========================================================
		accessToken: '192Z_JVBKZsC3lNp03LYL1YHXRgni5axl1YpbYbrgxJmQoKlj4u6yM2zB1CfjijX-cAeV75tiIvymVLUrlw2nw2tyP9B_fdbJ8xlu4ctkwNAjIIXCyjAQLxIPQOgCYv2eSkZcIE4cd0LexUUeNZ692qBGFSYKv7U9I1lEWXPKrTp314W0zASb0ir_iGvvs1BDdDbE2A_MbTIP7Y_09vlCBHB10TcmhIJzkYC_B-x5FEbLvK9FqWKzJ1LuueS-wNCZsR-CB4Icr1hmRpqgxeUiGs7roPnNtP5uthVy9nzxFkr5VUWci7puaOdW5WQwx9yK2TLCKI8ShGp-HDEVFPMW4o9YrJeXazDpIsWiwPkShImfbLVnhwZeTZMZuItVIxVuBmaso3SvEEvw4xIkjioEX0jiB9m2ep5xOHdQsmC7zmB4BOGhwPEkI7lXozD7h5crvsDDHLVSps7xZ25fV5nEChYNMELM3fAohCDofyJo-Bp24LkyZSGYDNShJEqgJAxoO51hA',
		// This is a TRIAL token. It will be expired at 31/07/2021.
		// If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

		// In order to use this sample on a "on premises" installation of
		// REST PKI, fill the field below with the URL address of your REST PKI
		// installation (with the trailing '/' character).
		endpoint: 'https://pki.rest/'
	},

	// --------------------------------------------------------------------------
	// Amplia
	// --------------------------------------------------------------------------
	amplia: {

		// The CA's id that will be used to issue a certificate using Amplia. We
		// have configured to the sample CA from sample subscription for these
		// samples.
		caId: 'eaffa754-1fb5-474a-b9ef-efe43101e89f',

		// ========================================================
		//     >>>> PASTE YOUR AMPLIA API KEY BELOW <<<<
		// ========================================================
		apiKey: 'pki-suite-samples-02|dccd702f5909d64a89168e97c02b56631a0e00aea6b1a171ca65e61003c69001',
		// This is a TRIAL API key to use Amplia. It will expire at 31/08/2021.
		// If the Amplia's samples do not work please contact our support by email:
		// suporte@lacunasoftware.com
		//
		// In order to use this sample on a "on premises" installation of
		// Amplia, fill the field below with the URL address of your REST PKI
		// installation (with the trailing '/' character).
		endpoint: 'https://amplia.lacunasoftware.com/'
	},

	// --------------------------------------------------------------------------
	// PKI Express
	// --------------------------------------------------------------------------
	pkiExpress: {
		// List of custom trusted roots. In this sample, we will get the
		// certificate files on resources/ static folder.
		trustedRoots: [],

		// Offline mode. Set this, if you want PKI Express to run on offline mode.
		// This mode is useful when there is no network available.
		offline: false
	},

	// --------------------------------------------------------------------------
	// Web PKI
	// --------------------------------------------------------------------------
	webPki: {
		// Base64-encoded binary license for the Web PKI. This value is passed to
		// Web PKI component's constructor on JavaScript.
		license: null
	}
};