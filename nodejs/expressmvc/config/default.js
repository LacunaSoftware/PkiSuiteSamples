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
		accessToken: '270JN8vXFPZEaUO5ndH7XZZB5M4ebLjdffXJEJyNGOqb38tH0WC8i2F_3obpnRPrO2qaLXi8GjKHNYHlinAyqL-m-HbutQWSksW-0_bHh5c_tX5TW_WLqxRFXmHkHTYG7alTgTB2eo_VGJrbAWgzXRYDvjyTrwX7YRrK8F-l7ZG6NupNJAwd81xjBEdGTa0CbJT3cUF7K9qm38beLVrLN9Ve5jwEaJiSTOX7BA5_aOGzN0u75YIVukmMrrHqDGUbe1QbJE92InOrbChYygGrxp_zG7JOVSHGnChmsK85DyBbnIuJ_HwrRj4tAKG5gFgYk_dsuB3CPn5In8cNugnzP_QpvMAOJLjWGNanlsanz2ZnU1IV2YJdoWRMKMyRifmlQd7-6xtHeP5rS88ZsPB49QO1rsNWs-VK5rk2egntrwnKlgdDRINuRVjldPQKfMfbFZc40J1IgSusX3lQTJxcoZeqiV62uNjkbQnFUUbyFQsV5wWCWFz68NXHn38rRISquswkCA',
		// This is a TRIAL token. It will be expired at 30/09/2021.
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
		apiKey: 'pki-suite-samples-02|e94d954b2d619449addbc7c9607c6605cb2924ab2efc758915e241baabb828ae',
		// This is a TRIAL API key to use Amplia. It will expire at 30/09/2021.
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