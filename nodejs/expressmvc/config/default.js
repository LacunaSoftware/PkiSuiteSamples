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

		accessToken: '1xH6I6YpLDvkmeVyxxYsMYyfJ1GW1fRVJtAKHVhLwM1ePfmhKqeBPBaouEQ6PADURuYG5UDkoNchSw2D6vziKp9FdYJxfm_LmNQ4OJFIUOxqq2iRBIkm2aHhMHRGzoDxVRYSwLuXeJ0mcxLYy5XRFiw8mYBdiSnr47RSz9aWTq5QZQ3tykWooywUlW-TW18m7GokZO8Rgl4JYFsyLwiuwBNjqmbRf2X8fA6P26ydLSaI5kCFOi-MksPmMtySbineMdq85rObC2hOcQZnTR-DCfcteTr7cd4rqxA0hqIKKl__XGFo52ebgc6etO97zyak2NN-hlitZwAa_IymsqBjuRraBSbAwOc63tIVx9sZL1vXKZ1RlVxBMNLDpyEjIFOu60uOk0yq5oECK0cNlFlcLt288eGTyMQFOAkMoH347IHuLSgPvem4BoLxSdL-l8W03UYICenJ5pB5t6IbYSJeNMhaU5Fda90PjoYOo6YzY9ORHqLLaw1Ulx3Lcbto23l4DQ9-3g',
		// This is a TRIAL token. It will be expired at 01/06/2026.
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
		apiKey: 'pkisuitesamples01|7da65e9f705767428082515ffce0351eef8584e7bff2b68c10ef11dfc9415758',

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
		apiKey: 'pki-suite-samples-01|7f2e800cfb03ae43bf3380099f30a517995687298eac2105a3230d54fa59ea22',
	// This is a TRIAL API key to use Amplia. It will expire at 01/06/2026.
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
