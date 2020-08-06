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
		accessToken: 'AxAAi2WCn/4pfkW7OdAnb19JahEAUEtJIFN1aXRlIFNhbXBsZXMIAACQdcY7OtgICAAAuPgVtmXYCAAAAAAAAAQAfwAAAAABZTaBXQKUcZxT4ATV37uSHkg+n+XJ2XSxDVXkgQrKsN3B79g2IyeLr4iQwOW6ECs/cY+Sybre212JPf7A7hj72MC9gA06X+k7CpKqRV2MENtKk/4bnc9NDPiVRVzybHYtAO5PadB5ANfW4Ay66Bzv+TecPRsYMW1vRtG8QQI2BUazmfzSyRrRb7Wa9f6HKb3tnlUjdh/y+C5Oyx6r4nl3O6JX1d/hp7KaAPRlVI6/fvMZR8BATdiFQWTe4xikXfx3sDyGmJGthxHsYvWVVkxxa905OUyzccuMEFOPgmCSDT2JPvm5Jz2lE+nKKSFm6HfyFggtd1jxwR0FpKHpDXa+pA==',
		// This is a TRIAL token. It will be expired at 30/09/2020.
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
		apiKey: 'pki-suite-samples-01|1f3c9a4bbfdab24b9c1afabef298f166caba68aa76123d2341bf7c24c3d45529',
		// This is a TRIAL API key to use Amplia. It will expire at 31/08/2020
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