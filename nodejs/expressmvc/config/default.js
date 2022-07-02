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
		accessToken: 'mzKQaEvvA1ZLlFaUmXdqCIaitItEw2C9aJyHeqMvBxlqIvLiVRkDQGAtNGIWgURh9HXGq9psFI5tVJInA06JVa1IKDsbuOjAbTI2ndklHXpX-8O_QE6sx0ojpFFOveMkALgqR8yc0VRV6qH_chZ9STar1wRxUOae7vWkCLGpIwT25TzcpEMxAfx3E2VnqTh2h0Xmqjqc5xMyES7Cljtp3GnfEhsLzT0Ru1-IpO2uwTxm9oowb3dr7yJQ9TAkMafCdFe39JDKkWi99uJ-Lt9Ve3RZi33BIgoEHHgUvHzr_R9Ig_aT-DzP8TMXNyuLSp9m2dzcI9Wh8g0zUE8F1hzjBLo7hJi3UL3Jc24hmk7cOCvBPEoxvDoUePPU8MbkPHP4F0ZCwBqnSck-XTSk2yjfoPa-Gd9wKouTI6aQxnkiGRO6zeoefpRVXl9ihkbd_awBRaym2RwAp6al-G1ULXAWADXXtDLukjXOCKwmxxik-wsLPV2b0xxOQRhDa1S9iK7otqeqfg',
		// This is a TRIAL token. It will be expired at 31/08/2022.
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
		apiKey: 'pki-suite-samples-01|8b669b58865aa34c8c264f1a83bff843cf4cf772a0c3beaca09838770b9b5625',
		// This is a TRIAL API key to use Amplia. It will expire at 31/08/2022.
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