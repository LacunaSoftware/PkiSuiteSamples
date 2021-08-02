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
		accessToken: '-n3Qz-rC_hrwva8ERfbIyCfTbem-XnUN9yxstku7pzVOOWEhOjNn9fQ0IywG1qTa3f0wMmgbHzT1wHGC8Ht1geO9wqI3_mu3UDBngOCwVaU5QO1qqYhc0_3y5dJIVXAw_hR2DSMj-yDvy934pRhH1OsHHmEr0JfcLgERD-vEnI8SMHR9WcLHlUF6q6WITTfQ6mDenbCHY3daUvvS_LphoIGJ-rE48VOKrOU5EG-2ydDebewnETVd-7jgavAh3o23QDaqHzOPeqoyFWY0pnosfF1U5XQTK4sHKOyJeUeKlW2Z1YxPThkgCDqQNnPyffjkktpUi1mTzkI2HSHnwkTmMCfESKC3X51K-6CP8k6lKO8WqMi0oHC0Pbka5DK_5ivcZxyFqFJNO5USazk9JG9eUcCojUVVRVm5Kc_SoKoget9o2ygx_TbLs9Cu_hqh2xWwCAzhLZ250pDrEE3-WgCZZri76XWRxMMN-jFBHvAlYhlCQMa2_8NSq14yPDgNf4KelkH3qw',
		// This is a TRIAL token. It will be expired at 31/08/2021.
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
		apiKey: 'pki-suite-samples-01|233e08e642b83840a8fcec5ed73c6bf16e559124dfe010891b9ff8c98d9fb506',
		// This is a TRIAL API key to use Amplia. It will expire at 31/08/2021.
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