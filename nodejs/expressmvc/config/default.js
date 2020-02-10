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
		accessToken: 'VF0jCF4QWfjvUQ1cUBmeePrSNALinTQ1BgfGh0IMSFh3lBiiCpiQPba8NptdB_DwMKRItmccgQITMonKtX1U-kmrUYqsPegmKh7xzQUkBgiT9-ZzqcsH7sCk1mydDOKlG42QnQXMyTQWiexPeNhe8ZybGIcQGIblU72vGc8T5nRylMk4s3-jeXyYqiP8xLYKBlO50U7PByKk66OsjaVpF4dmUWXd96pVrNZ9J2KbWaNQEDh9rtUghIr88vwnE30kV5TL2hJz_LDI-smnSWYinJNPGpyWSrrLHI5uA6GplJbJNFvIn1bIYO2xjHkoESoaaaf3vu9Dh2ZNpofLN9YdCAqcFwYREnmJYCUjZZ9yQn2ba8w4xbIyDMg7q6hn_DPJUvB-H4NsVH3rMwaOzA0bXRTxcVi9SmWbJ8TmtPpmSMww21db9G6qW62yaa9j1VgHa2XjgvQSyISVPQIqUGaJKBsg82wpjf2lfTxpujruVvKE_u1_51RQP0M_2YmM40udL3zuBg',
		// This is a TRIAL token. It will be expired at 31/03/2020.
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