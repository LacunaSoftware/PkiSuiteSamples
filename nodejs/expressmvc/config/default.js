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

		accessToken: 'F-Dj2tEaGuCUgMM3yW6O-W1zFhola1OR0gSG9HlnxLUsPVBjcofju9ver4geP2Xudb_1tYaPpPnn9GQrDQciP8MSYEFygZ4Xpl4mZdYwteP_pRG4rezP7SamyP-X3hgBgHbBIVC5L3rL0nOg-kS1iGNr4qo-gyrcoG6j_z8P40VtrzzaCF4BCVwI8i4kwhQhO7lQ0RNsDu3TEudZ9_HEOg9Nhao9ek7pBJ7tvdkZhjoZDEJn25HmA4p98BOwdHMR16xePS4ZQ0hE_J3XPwTJYZVD_dLtlWNy9LGFYrh6vbc3L8I7r3cyeH4fDwGdtHiYLnES4ZIbSMWeAotI40HRySsGuwoSToJESk6s7hE0DivlDEIV3azX3642PFE5979cjQKl1XJdS58MUBBHFGZu9MoSkkGH1LsQgk8NVl3VQnVwVEtzt9fWhlWZCgHXtqc9kxFolADgE6jpRC6JGs8URnS0KqlbppBF38PlZGBtyTzYxfQjtaRXpj-1i5-wfYmzPpnCYQ',
		// This is a TRIAL token. It will be expired at 28/02/2025.
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
		apiKey: 'pki-suite-samples-01|a4f5911fb0df924d9a3d473e0779a90762a82093b362755e094b639a117e7760',
	// This is a TRIAL API key to use Amplia. It will expire at 28/02/2025.
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
