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

		accessToken: 'YSrnITGWeidLAsmaEAhaLhzZ-XJvdNq6JMT7qG3cat-xX6v3ZV0qKTwXe7zLdStJ4hJ8msf0qQMe1_-_vPysgfDaw7UxbaS21_ogOeot-W91WtrHzI7ZbA9GX1oEMuw1FJ7qVvw6pTnnKDJ0QsvgQZJZrZr8g_xQTReFWe52GBlzox8hUiVh4J_Fe2MATrPu37sRrt5N315PvXtxT0LGFChcyS96IJQkYKhe4uV_Mrs1VauHo0S4eFrpy2SK_KhOO1aXZ7G9HwI8VwESScHtvZWFQozQeNHwEtXI9L9yEDIJych6nEDESyp_IxTGhSSNJdBsKUOx0vglyC_rKcw19BXYeRGcvXKcaShRpsG1zPli0kkWYyEYQOpNNpZvtRCX4lw5EUiKrAmvHPwqI-6wGXYeJ_1Pgd1iDRMpH41lZ_Bk3PLFRt9bzHMOn4CGPx_8KYtD3GUN7TT9gknmnyPsDXtPsdEcXT0ZDN5tUAqyJuDJCmD6OeEu_CUHrgNMonPJhNuelQ',
		// This is a TRIAL token. It will be expired at 30/06/2026.
		// If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

		// In order to use this sample on a "on premises" installation of
		// REST PKI, fill the field below with the URL address of your REST PKI
		// installation (with the trailing '/' character).
		endpoint: 'https://pki.rest/'
	},

	// --------------------------------------------------------------------------
	// REST PKI Core
	// --------------------------------------------------------------------------
	restPkiCore: {
		// ========================================================
		//     >>>> PASTE YOUR REST PKI CORE API KEY BELOW <<<<
		// ========================================================
		apiKey: 'pkisuitesamples02|dc2ef3ce372b4a469906f4e04ad39685004d3e6a8597117bc13bf86748a6d25f',

		// In order to use this sample on a "on premises" installation of
		// REST PKI Core, fill the field below with the URL address of your REST PKI Core
		// installation (with the trailing '/' character).
		endpoint: 'https://core.pki.rest/'
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
		apiKey: 'pki-suite-samples-02|c90b324892dc0849a9992e8aaf69b8930ea2a78a2d670670195f9028ac195337',
	// This is a TRIAL API key to use Amplia. It will expire at 30/06/2026.
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
