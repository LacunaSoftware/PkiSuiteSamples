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

		accessToken: 'o-efxzcAO1hiK2KwTg9PcW0833MIAmcdvaHpsvYbSPGd245gkfS2IZRbdGV4pocDop9NyRIKpC5F1YUTjmhJWKgJVGb0u_flHbbvIWpObDQM44WfHpq2lP4TQsEZM4qqXEGniAsdlwjMm6xGFh_OUj-tSPSbyVxK1SO9cnCxhiQpqPTSHx1BnswWia0jFKtHSSIxUei8jyUq8AyRgnR6KMcbkqVJlOlP0TQ7l0IB1mea6_TGOghnxNPBjikVJTtkQ2ayRe9VZihNw2g03nH_qMGrQB1ZwBnphK9sRXXiHO4wn21ip0giNs3YkCIhndIi0pC7uxTtnIi0UaKhlYaik6rwFl5hoxC-170NfB59bPyq6dOgxcJVjhIXTc2p3-qwCXfRvlpVDh3JJ0MqiUGiDmIeus7aj5i5bXN--vG8Hi-Fj5_Io3SerFuZrpqfWLgS6foAVU2PuU2xuWUtKRsv9GUMSx5WbclnlhTqKnwyCtEcUnD1FMDUB6J3CewnocBEJhZ1ng',
		// This is a TRIAL token. It will be expired at 31/05/2024.
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
		apiKey: 'pki-suite-samples-02|108756e5f06a7a4687dc8b00aa1dd59b232b4fce8a24d0a59e8702b2636d39b1',
	// This is a TRIAL API key to use Amplia. It will expire at 31/05/2024.
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
