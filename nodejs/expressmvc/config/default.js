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

		accessToken: 'Yuy9-PZcP_qPggH00h9oOJzbvDnoyctHg4sq_DEjUGeyTLUtC8uls4RpJiVGdndhpo0BEsrYSGG9bshOe5Zbxfi5GX0YEazEyLA8svwHPiQehruwOKc5YsxBX8-8kgcmOpv0W1oYuevG2_UEVTUO1h9f9bHPPnJJJxhTU4mNo_9u8MZLv4ZhjAszX4qUYZvs-xZ6OdBRULil73NNpNZ0DSwwzkw7ZYb8GGKZUnJgbU70YpguKQSTHkI18zSO8JFA9wN2oGVlVJormZu5ATaBxb8YgJlMrLwJMgM1bXCvIoRRO_QWSdibcaCAL0nDnBa3nrtvCQGbl8yXZzERJwP746Xe2RlOubcHpBobBwfP8Mhfm2lQwStxwr8Xepoy_K5w1XsvuHPBuCWjrJiCrD2Fw48wZ_WuqWBnNE0Z29-bNUWVn-hNL3Be0OcGgDvrX-s7YGL5Q9ThDd_xHquWYrQYMy5J6FTztvsSck9HOB460vyr5IpKawIzOtbRS-ABQAdiYnaxlw',
		// This is a TRIAL token. It will be expired at 30/06/2023.
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
		apiKey: 'pki-suite-samples-02|cff926f241d0074098956c2aa3c1257e0a8c88d57580f6d21b77122d883b6c9e',
	// This is a TRIAL API key to use Amplia. It will expire at 30/06/2023.
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
