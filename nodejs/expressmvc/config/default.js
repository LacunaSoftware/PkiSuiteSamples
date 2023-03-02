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
		accessToken: 'wAYhZlI6FC52gTNLTbgb2XK8Ff9UohswNXvg_m7xXsm0zqL3gznc1YDARA5SJK9T3EJ0cRW-JOF2_fkj-tUdN684kHhDqLrdzkpq0KFnWC5UUnYZ3m2mrHw2ubRRKr8vyLpWzZNJlq-ljJzIBYH2B6msPS8pO0vXz8J_ee_tu2z6-oYm6ZapKgW8QgkhPDXnTEoWOp7pc6BQls_bUorELaexWJ2rLWVbC4zJ4RNsLjvXR4A9bafESgKBflV2ffrxjjj5PPdOnL3g7ASeGnyGE2Ne1H0ynKrrgZg8W7FHdmMw3nWli4ineGE86RYVMOYA-4zzmDCZ9PV0GJbpao_0SuYycYt21xVV3HPkQU8ToagZ2x98hVZCitbskorky4pR02xWO4NWHtNt3k7dYXcwg6tIgDM1LHFiuo0ucc3Xt3UQxOEsoFTz-8v6PcYZeXKjlQ25lqfuZsACHUVrlvClc_uxhmaLCWVkuYm7pOK0JW_hmjaipXYwO_NX525oi8Rb4MYYow',
		// This is a TRIAL token. It will be expired at 31/03/2023.
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
		apiKey: 'pki-suite-samples-01|9b1ec4792dca2e4eb466e0af196da31e1367def9b882edb0e10f5ac1b434cc12',
	// This is a TRIAL API key to use Amplia. It will expire at 31/03/2023.
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

	// --------------------------------------------------------------------------
	// Web PKI
	// --------------------------------------------------------------------------
	webPki: {
		// Base64-encoded binary license for the Web PKI. This value is passed to
		// Web PKI component's constructor on JavaScript.
		license: null
	}
};
