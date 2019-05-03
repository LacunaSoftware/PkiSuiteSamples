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
		accessToken: 'XqPlETa0uX6za3eFS8NqPjo0g1BGdlObRggziOD4Y_9RJtiYI14J3_G1Rl9TY1gLiO_afCXl6Gh7q399gNrRjlpTlJlMyw1QYXnvf1moxcUpEIjsMFwxcYgvPBA0XEqKhtKiLLfZrfa2Oi1iVntxnCtX1iOUKfo10kxPrEmN3CYaYcksVdSXfZVAKGmybS3dVbOky3JX__sL8K7cbdawlMGGf8D8XVc-Y21DNUQe6wXgb8CL9bWZRlgMvWmxuagJhQbkjhgG78OmnLTDmH5TDv8Baq4BckXkk6lw6T4mnpcbuYvN0CZqNfWVenQiAIQZG486XLMlYKXrcjLAGPj4bCGEKI3_NCJtl80ZYeeSydGcMTFA2GYndzE8sHlUQtWYKS-b_ibN9NSdnweS63_QJ_Fvn7mdM-DRpfln7nSo8_JFv-gbmsTYSlA9uSdDP5wtmU2qMfqu9A6kF7XKwPyMBpYOydc5Cm-kbkbFzt5nINWsfHlUw3N1FEHv_uoedOoU0-t6_w',
		// This is a TRIAL token. It will be expired at 30/06/2019.
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