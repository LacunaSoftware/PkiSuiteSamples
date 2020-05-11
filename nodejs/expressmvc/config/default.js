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
		accessToken: 'lDCLovY8pwRh855mO-nbgZVlWWAny0q5RHZD6e6Ax4wpthscmWF6nfBswGO_JqoAYlvDX6ku8FaJcTstDF4WZadT28Ek7ohWvQoEug2WynuT9pfRNx5x6WgjLNDjZfvL3ASaei3FBc-raOiPOpGfEVMznO6bUMu1FlDPKl4qn1HcpuNv7FoRRHjXkFMFslrmgwEnzrVV3wvElHDE8W_UuMp0FKDKYXiiX11STghkLtONPiJNGcvypcnVfOD-Bpscvl3g2S_RFda81KHyqBjR4UffafqbyEvtbqiXr-OHCTwcd5v_562O298PAgRaaNtDiisjo-F5kFA79H46gp7QQVcq8VIUhPl7Y_fIkl-mDNvlAS6JoO1fMqzMihVAPQB-mUaUenw23QqRS62KhVW6VRqc0NUBuflhmP8YbTHE3dG8huQte4bPztDKO9RsKyN2ayIeA2OosxCATd-ZzALJCFinL-10O84Cxqv87oAyryk1qCAr1Mya6rLg3Vr3Xv3GXb1gaA',
		// This is a TRIAL token. It will be expired at 30/06/2020.
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
		apiKey: 'pki-suite-samples-01|54eae20f8b0a594f862cc89c4aefdb4ca8fdfbb90f3021e24696baf15b46c911',
		// This is a TRIAL API key to use Amplia. It will expire at 30/06/2020
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