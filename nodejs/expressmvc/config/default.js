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

		accessToken: 'ig_rjgG_P59EnT0E3CURJgCrkeV9CTqdhdpXoD7xqQeLEgLIUKW6avV_rEUHjYGjatsjCF7NQZiFzfeBOBUr_5g3rS3okgBg82TAhKfbkw7Rhh0hpfC0i_TgWIaHxZEeCLkhxmQOviVtB7JGNPfwJFBCAVgone7NZuVJ78HmUYw6QTdJ748ne1AMPgeTt4Qpo42163rhbWGFyunqHd4KadoTqr2Y4goToOPYwohyG-10dr9lmQggMTQNlwSMQNVjgtGLGfZaLFK46VXO__taFGNintSdgOW8IrgtzeK_H_EUR4ZUecVOlAvv4reMZ7z9IoDTZIFS0d2hqzpmkmtohYgeK_AqN_U9Tv5B5WyKjv_RJ0Uqcqv6bqWftpva7TwNEz_Vko0GOvLpKbcqlqx1q7SFr7Pp-Vijo8bHh0lfI4k2SDzMLQz86J4ViW-S_KoHV1OroEcgR18adJrEU_mnB0cvCv5ub2vaO3DAHX-HEKlyizUMuBkRVyPNe_-DFrCnV0BTYQ',
		// This is a TRIAL token. It will be expired at 31/08/2025.
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
		apiKey: 'pki-suite-samples-01|28599b060e5f164bb5d253cd899b47e91c911baf7aa0c07fd56d618b15300d05',

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
		apiKey: 'pki-suite-samples-01|09b8a562702b5c46bf9fa1b7f5d67c0d3938f0b4d6a4fa095bb6b5fb79570315',
	// This is a TRIAL API key to use Amplia. It will expire at 31/08/2025.
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
