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
		accessToken: '0IYXNpevGWB_5BNxDAVtZQ3-Jp8tNTVDZ9L5jNYJLnadW0Xon6HCibbHCWFyTlR1AHXxA_z_ItAz9t0DtjivOt7ON-ERljXukzWIiMftcJJuGrLijsL-kr2ciPMA2xCOtG9OZEAwQQPwOBMaf78Yq0XRkHZ0ceoQuISIZoX740wXiRFDBh2DKZhf6E5DEnQXSZj_KoaPx5h9KzbTyeAdVyJu6lZqy_iEnIecae1p5WLQqxR1NU2tXc8fuvAuE4EQ_KXlbSjuiyVHVRTe-NTuNUycJb_sQ5jW51rNoxDCgcrIa_pcnUdmqWsYugOHRLegTFmNyo7dJPsKDmQyQ3C391VNv9j9LtncJOiexkWlDgxaGs2159cButhSwvUxRMAjNRiF7uzUIe2h1Lvo6-5QY6NidbPd7Zo4IzcWiWkAGhgEtkuvEpH04qhIT8GJ2Wk8Na_1IW0CbVCSghu8a_IpWF-AM1oN0xzUq999418Mhv_naeen81JS0X3eEZOCWlpaTz9YcA',
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