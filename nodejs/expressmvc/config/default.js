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

		accessToken: 'so8X9JmE7zvHXy__MwY1aTVVN9ZfgJWottK7v5yXBGMV0wFyr4OJPsXov64rR-thwf8IVwJKhBrv9X51v1ebTHnFEg9i-Ai6-XqrCGwAsu0L5nGoqpBiLzSWw0nxOVbc8nsy9XclsyKQSsgCbsxvMiyTO-_KqD5lFo0IZRdXSQ-iqyXoKWXaVz9tUCCCDX7YNAQ5FlhIiW31QZKitZbnKi5aJQzQl5n-tEAtqIfbXDXwQLeMWtDpc2wk82yxaKtur41Jp4J0LjZyvAxMSCdaPn005b9AGhCdHrFJys5pwHJQZyd4i-r7YKUWYAStwNbxZnL_S41TtMR8ZyvqQpw9SLAVXNjLII8EkojkfUq23ey1h4kdCMGAGrZQcbaNUAvcGmyWNFD0INcrzN4PQ4VmRO8HqZW5AzqOGZP--gFA7JnYTbqXZ3MNc1ygpNf7-yciaqFHvMYl5dkhVhHJA_4zkNHOWC3V97HwzGgdE13GNPUOa4Iel49Am8TIZgpmdP-zIQHR_Q',
		// This is a TRIAL token. It will be expired at 30/06/2023.
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
		apiKey: 'pki-suite-samples-01|aa5151b62a2b364a921ce9129a8b9e18f74e9ee295ea54dd423e0c7fed3ddf33',
	// This is a TRIAL API key to use Amplia. It will expire at 30/06/2023.
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
