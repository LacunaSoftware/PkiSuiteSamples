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
		accessToken: '2UwpOvmto7dUebYbacnOUflxdL3MrbEWEhMcans6CnZkfUXdTHvIXfVgXSZa3KYU0Fpgr4hbfkWfuoYlLc_lSVzYafW1p8IfdaxyaLdXMI_jrLAF5_rpWcwWy_A-BPMTV37QuDUn3kphBN25vzQbCcBAKy62wcsAQhXhwgl-K0MJjAiaMysPtVhUXvXAzQv_yQNvguqc48YexpqVAbrGVFTXlCcPzyGDu8pxrFLayTw99POEIlbN6JAko97fwpaNa_UHn-hbgIHfJEgL47inK0bnfu8jU6Z7iHmivL1UGMFkPTmwNhYQ1842imUUh-Huvuwq8fjeMKO1KQrAUca1OdYVacNZwqDlDds04Ii05sWeL5_pC3uNRRNCiKN5wGf6zWFqXIQdZMXTgZa0Y-fFSWRVRusNTWT_t-KmKptRqw_L0hUvH_PK2ENAbX7V-xz2A-FnhBiteG-9g0JXEzDkaB036wPgMw4S3XlOLq2r444z10HM-nS5Ko41cM8PIQVxqEwskQ',
		// This is a TRIAL token. It will be expired at 31/03/2021.
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
		apiKey: 'pki-suite-samples-02|ad6e27c5ab1dce4da7b7a484ac889f7972c5b93b3265236f64a6f7c2978eb636',
		// This is a TRIAL API key to use Amplia. It will expire at 31/03/2022.
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