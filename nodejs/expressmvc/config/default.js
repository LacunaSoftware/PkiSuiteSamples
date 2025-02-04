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

		accessToken: 'aUYuxBVZrZp2irpH8EIB_SscnuALrXWaoogOdQNaOccu50N5x1tIh8k3lNvYgJlV84bitmAONOsyOlnKfMGGuHCWDxONI7Kwys_XltmwTe3KoegZMaDJc6XMI1aoPVlM1yKtXHvWpvPLkDjtu3oiGnBJYYHghAgDuON4xNmll0pFdzf4D90P1XDAaKln3ZGd34l96YJLlRdppKNhD3a0ecWwvlSG8B10S9uPC0X8b7zLlwS9ECJAcg3QldCrBnvAybgydlRFkbINmW_bP0AHRT3NvN13F8bJLCfZDxGq30etJRaYCmIUEI6a9O3Tb8peDoGFh69Hg7L7xznNK1N_8tZ5Qv-WS4-5E0SEBVrh4JS5OQjkZquBlc1IkmGROYRNbNLd-msG0EunFnNO-Ex_JNGp06f5LSh2KtqpvBbhQdJuOCAd1ZxDTPsLZ0YY3P9JuqSO9TN1qWIu6r1TYYenXEv6Vj1Gp-zQg_D2UOqafyHXGoxz-LwVPUH5E74CcLeWx-zjAg',
		// This is a TRIAL token. It will be expired at 31/03/2025.
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
		apiKey: 'pki-suite-samples-02|a36dd461198e5f47aafa47b121ed2ecd6bcc9bb8ae9a3486038959a191b13791',
	// This is a TRIAL API key to use Amplia. It will expire at 31/03/2025.
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
