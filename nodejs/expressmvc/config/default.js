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

		accessToken: 'HPCQBYJSiCevWo0M-h8UO1DUHdK-bTUMwnsf7vcw2CbaYcjZCfqGt3bnFnFhx7YgOVi_eaZS4TpuKVFcOi8NB5MCFILsnFSybYMTy8Kqo0QmlwzgaZfALYR1cJDx6VenxBmSSu9_9Wh_da2sR6RaKS-t6i8qGII2E0q8NIJ6iZcqh3IeQ0eIHr4ROISfx2B8m2kxzBOZaUPBh1W9AkLHxy5U8cO2j9ePw3a8bEvgEbrPEKO9_b2HTBLqU4LJgxiBkWXIq0V-yWlhnZWKna3C1t7JoQKuF-tgoHwwC_3_qZVKBKpCnPPEDmNgmyZSEeTvczaMXR-nxH-uQTh35o15SHg2b1I5z8xjKzDwV3NaOZg9Ig_-Bn3z-7kJk-_SANoTCQTDVycXP5NDNO9PRnkF94DVUWP6CdqZ2KcdeRw9EfxUsYUTX33FA8NcJEtQEF_hWFZSpg9JBJM14aLpw-_cYPrAK7FNU4uay_lK4QzrbkfZa-j6HR2Z3eW92R3pOwMPL31yWw',
		// This is a TRIAL token. It will be expired at 31/10/2025.
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
		apiKey: 'pkisuitesamples01|c0d3940075fd7c438222fa4bb739939421d06c330452cd84a2070c884878d482',

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
		apiKey: 'pki-suite-samples-01|2058a12561968c4b975c574fd83dc1bab558562b6042fdb8bfa1a6194230ce32',
	// This is a TRIAL API key to use Amplia. It will expire at 31/10/2025.
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
