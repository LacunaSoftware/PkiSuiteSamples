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

		accessToken: 'i5sHjjspESuhjXrpWy3H2De1GT3aQ0LpZN8JDeAa8yNDXwO4lcOOoOsLIxeEhgSTOI7Q_tp1P-5yK0vy8fnRuP-I6R7kvQQO04xveGeEjEEgwpFKZ7xQdGfX0ZxsKXEPcDLYtzd7skqtWg9Z1SB8v6-m2YzdWzV_S4eEx2IjI-LjfEJalXVvkcKC03lpR9AqC6DnPOE88yH4RB-vw9Fn2pp3DdCH1Zvxw4cTWAsI87uxfNRK4wS1vcrbHihrWGoZCu8DCla1diZhzqlfe9pT5z8yIMswt7D7YXU4GHYEcjlJYCmZY6ITzhapTJ11OPgkSMHkjcmcsyOMFxXqFnvwrr69vhD6Rz5GrwCSzYTW_W1F77OkspORdH1lsf3qIqhSz4NH-5zZdmhHWSqRQ__Aj4cP_Yn6IZr5MGQkB70XnTpZ6tBVE1a3D1zMYgLZ-TnYC_Xdlp6hVuzwveBhVsDd3CF3ySl2IgRVpdK1sdyaonWHkzGkbq6VsQ42UBMvKVQCC2bfOQ',
		// This is a TRIAL token. It will be expired at 30/09/2026.
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
		apiKey: 'pki-suite-samples-01|48d5a482b1e7044b881a92dccca7840610e28072d992469ff893fda9a649ed3b',

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
		apiKey: 'pkisuitesamples01|3c64fc6788f5ab479fd00914f8a512c9c9c9d31f9b81d13de97c559f0123c44a',
	// This is a TRIAL API key to use Amplia. It will expire at 30/09/2026.
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
