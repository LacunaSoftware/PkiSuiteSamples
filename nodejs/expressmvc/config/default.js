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

		accessToken: 'P7ecKegwvF9jl2F2X-syRNW3FOVi3BxYGTZN0GSHZ6li9VuB5OTbj0a2aZUIr0UhYxxOjSzivVc31zXPvhqYlE1P0H0prFbJQ9sR3y1iljWiq7gTmi-5IIfvKJlZ113D3vTm68GpXkxlmlcZNsSO_mpv5MOuwoZtxeyzPjzH4YMUCuAvYjdHWg0-zke77LHyzebcXqpNAAHdHZkaRQ4IicUpogQrBBkcHG-WZGk-EW79SahdCymLHi4vKsOC2Q2vxs_sAP4iACFwjdSZgTohuXZsDM5p4rWAkEeFB0Aa_-Qb50fucCq---zAaVm3IWyp_J4IWBAzvLdbRz7jkAFc2OGpyulC54HNrwNsPsJWbVs2vECugqECDQEiSG47p3Yt5xZ2rJec0XyI2gVQVa0OxCEtXPyyNleajbbdNOz8c9n6aqreKqRQ1RRZTtU8WMNGY4w6riCRrtaX15ZhZ5TYxsxBlk-wOE57uG5dpnqGiYYX8Q0sX8aAx9PyUhhwbbfi8-68Og',
		// This is a TRIAL token. It will be expired at 31/01/2024.
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
		apiKey: 'pki-suite-samples-02|375a246b57b32a458e46a18607e6b1a2e33a89cce6764cf6210694bab963c9e5',
	// This is a TRIAL API key to use Amplia. It will expire at 31/01/2024.
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
