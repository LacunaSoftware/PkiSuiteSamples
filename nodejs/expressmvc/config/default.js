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

		accessToken: 'uaWtaFA3BIioiduXVFGzcDfMqeZmr4bHppGeNuqQcycWY40tySeNzFxIBQzHvL9cnvV_-5q80BbkL2-ZsKTM3SfFmyNa7VHdhUx8l0fj7UiqpmtmPTJtmvSbhKt6nLX6edEcCSh8epA-IfMovaTkDzGeHtwOtZaJz2Yq2rlxmUTZBSHIadT0FhfuMvUD8ze5HFiEGrh34wkoBavrBbVPphSVwM2nQ11EupCYn_iWROpbFQPgCnqrZAmgTsIR7E48PKdy9BB645Fr_ZY1baojT3qoPBr6XDICea-GYx2emJmrmMCzJLi2iv3fbYdv0aVBCQdnkSFdsiNim5BHvix8RaHXXleNkintJqLVyhrCXGqC08GFA11XwctDvpzn-5ilVjb4ldBi6Fwinj3KepBv89hPsZZiDx7NULaA_se68wUB4_1k0Snde2WX1AuC_bZ3Ls3AYfgmgz_EYIiPG9AzKLhzmOMNapWoV5zroL2wEr7jxVzTD8CGWMxTgJltnoM6i6rONg',
		// This is a TRIAL token. It will be expired at 31/03/2026.
		// If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

		// In order to use this sample on a "on premises" installation of
		// REST PKI, fill the field below with the URL address of your REST PKI
		// installation (with the trailing '/' character).
		endpoint: 'https://pki.rest/'
	},

	// --------------------------------------------------------------------------
	// REST PKI Core
	// --------------------------------------------------------------------------
	restPkiCore: {
		// ========================================================
		//     >>>> PASTE YOUR REST PKI CORE API KEY BELOW <<<<
		// ========================================================
		apiKey: 'pkisuitesamples02|15a73af64ce0da44bd50beed518cf2ae8e9eb98f9d583a0906f5912429ef2815',

		// In order to use this sample on a "on premises" installation of
		// REST PKI Core, fill the field below with the URL address of your REST PKI Core
		// installation (with the trailing '/' character).
		endpoint: 'https://core.pki.rest/'
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
		apiKey: 'pki-suite-samples-02|39fad4b91c4cf943b35d51d6cef63dd106befd206d147ce0de271a1f3f592b41',
	// This is a TRIAL API key to use Amplia. It will expire at 31/03/2026.
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
