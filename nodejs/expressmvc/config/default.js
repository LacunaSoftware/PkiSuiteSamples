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
		accessToken: 'hCQn5FmlpDY1LVX0gdafyH4Q34jpoLf86yE2cuGOVuAZvjT_FSWQkfR6yQX2haawBy5pluyt2c4_Dp5Tx5zfu-NaB0t9W8nZ3CJzH8dBheK_Rd3F07ZhGqh0KyIdUMU1gy_ezJ1ib-aRESacHvlRgunkvUFfA7ZvdW7CLLENeYgwC7Em9H9YoZIP_I173B61untmT2XnnJSGZu-_UMYEI0UozSe4phi-2nBRqg1OOxfgI2J2BYDUcfrot4AOzZkixeUva0B_Dntv8L8nPuV93r2uVVf5jRQ350JU40x8pa-10OgR8Ejn-EwjUlnjAVN1NvXMg30Xeq5zb6BdvqcxY8OkIEmx8NJlaKn7Ztw-xKcRG66z8LxOtWhBvzaxW9VRTLZ5otl_4LU3maEMoFt_I34ULjxiEUpRZ2qoqAKw-jpugohHU2LPoyBQ-RDquBDj4RPqfwPIcmPvVcwDXjiaijbZ7Z8ypXFae8sBR-tVbWqdi-tHLc_BQde8GKNPIRzs8wFPBw',
		// This is a TRIAL token. It will be expired at 31/07/2021.
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
		apiKey: 'pki-suite-samples-01|a14de7728d208549a1ca55cf555584ff8ff1c052ed79a1481a32da153a021b0c',
		// This is a TRIAL API key to use Amplia. It will expire at 31/07/2021.
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