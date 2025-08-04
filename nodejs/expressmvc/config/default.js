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

		accessToken: 'VyB9CP2mKdGYWdsCYiG0Mwdq-JvvQWn71IVSDW1r0_jG8E4v_wENj-keX4bqN1xma0D8Sop68DmZRODs1WbT41q3--9s2jPe_gZahf4_5Y0yprqi3BLOUWk9DT0_K9jmHp5r4WIbBZad-nNxZjfvB5UBwJPkmFhfrzzC52hAjj2DmH79mHvABZjnf8Hjn41tT922emz8edX1gdGS11QjUmxWrTM6kE9yJzLNb1KgeaR8Cdsm7c7s2j6Je-WzwFXFk2ot_AqAGDmSV687vPb397UjvcmzUpeie2VzI8zCUCF9CN1mtuBvtRo5DxUnHSuY6BhoKtqKr6DQgqcI9EfJ2XgiaJ7z7pM2pNB8ega7p_MAj4AcANroAhcVudUADck_NlmpGCFa2spWbS9hjVnPKYn_2ShIkYU2fgtq6q3kuDzpjUQ80wL8cDVKxrj2k_Z9NLLovwm6RURbLBjVCve96GFyiT0jeyJrwybiay1x1iUJOhfVZrTzyTh5Gdywvo84guNUMQ',
		// This is a TRIAL token. It will be expired at 30/09/2025.
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
		apiKey: 'pkisuitesamples02|4767d9becef3ff45ad221f4979927a8b6d16bff67e370826820e0a5565924965',

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
		apiKey: 'pki-suite-samples-02|1a439003d97ee04fa3f855d39ee123cc57a163c1e07e1990e503c499aa8ab9f4',
	// This is a TRIAL API key to use Amplia. It will expire at 30/09/2025.
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
