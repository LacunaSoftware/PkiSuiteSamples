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

		accessToken: 'ibFx0V8fOBTFXo1tlOAD_OJeFEF8eVa-8hfYX7tbAwvkwVTVNcNmHaLzVfzex5aPnmdlP3MQJjhEepBmGNnWhA0k5VQiLwlEY5ZHch-mv91Yl7Ra1S73WCii5vWYzcJkve7argPc9khaSFRm85S2Y716yU1GKlWNeoflZlOv7PGh7nCFzNbbur7tpx335zfSyBJKz3wW8pDnb6jXg-Yi3FqXOIhYEtjzqCVbkkOFqwWYvxiVsTsJ9IclWkUXkfscSzWVqi_5K-tv--42cPk5B7Zu0ayq-zavXxeqkFTlw2rA3HLphftrhUY60KJ-fwq9teiEGVSPI2aFUqKC1vh7i_CLotW2i3TAxBH8GSUr_A8q2RRv1uvGlDk0OKD9tChF6PdURxeX27eSTCabcgj8W7_EojPjkgfKUXjWkSpDRMRBxownuVWKUZ8qdD1js1q__BB3q-VTDLfQtICI3qzWZP4_JynPZHBTQE1Gbv41su1TDw1V-uOsn0Qqe3r7iulv2A3yZg',
		// This is a TRIAL token. It will be expired at 31/07/2025.
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
		apiKey: 'pki-suite-samples-02|e0532a5137a55a4f902e7cdc5b267fd70419cb5dc05ce69e3740ed30278f1417',
	// This is a TRIAL API key to use Amplia. It will expire at 31/07/2025.
		// If the Amplia's samples do not work please contact our support by email:
		// suporte@lacunasoftware.com
		//
		// In order to use this sample on a "on premises" installation of
		// Amplia, fill the field below with the URL address of your Amplia
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
	cloudhub: {
            // ====================================================
            //     >>>> PASTE YOUR CLOUDHUB API KEY BELOW <<<<
            // ====================================================
            apiKey: 'mR1j0v7L12lBHnxpgxVkIdikCN9Gm89rn8I9qet3UHo=',
            // If the CLOUDHUB sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your CLOUDHUB installation (with the trailing '/' character)
            endpoint: 'https://cloudhub.lacunasoftware.com/'
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
