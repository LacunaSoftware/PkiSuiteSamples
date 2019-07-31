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
		accessToken: 'Gy55pcM39T1Nydsj73YAh3uPXMBXIzQikuiF2G0spdnP-FPQkA-qg20oy9eqVhskuRui0J6t6Sq6smgzQmqDLda-LIumZAHrU5SNkhzejxusr5CIvwVbD3VA4cJicRANjbNRDTMfolk2k0he5_Rcan7Mf10Dw4r0rnIPO6iB8ZH7PQYLeSMCBjQV3X6jsfxK1fo8k9gktal1mFD8yd3YNsFuhX9oRyeIq2jvtQzUyOxgCelEGiQ7oDPFyjT6I-EKbSmNy7tDmJrmaQXA3B1Y5Xgvn4yfsc2WXbeMA_BWom_nv-nWtCjQG-uyLwEuWzWrLHxF0Dvt8YjuwAEsdYum4BK08wu2rNODfo00N2vPBiipRTpkUrHszfXndSA12cBm6trhzhRWuFfH1Zb3GwACL6K0syweEBev-sZjJ5Mq3M41dNS0ZEpX07WXhR04SoDWHwYXV8gxfAvLaFb2Ka9E-6SL0MoP5zs8O86wz3FE5ZizxPxLtAoSEG3e0AKBcEpGjlPuGg',
		// This is a TRIAL token. It will be expired at 30/09/2019.
		// If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

		// In order to use this sample on a "on premises" installation of
		// REST PKI, fill the field below with the URL address of your REST PKI
		// installation (with the trailing '/' character).
		endpoint: 'https://pki.rest/'
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