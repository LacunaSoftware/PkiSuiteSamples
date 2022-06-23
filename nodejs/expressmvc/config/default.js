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
		accessToken: '50fIymBIX8rCUcCAdQ667jkW-hZNT9eelkl4L8dSv6RO38NR4hgD5f1yNcXxP3Tp8nLIBPO8qA4u-GKIc3KDa8BgeVW1oudTh-pYlILaTzVOf6TPAcujZas6jMl8ycYFEJC5d7eszuTuMCkYGHp1T1dnEyhnyn9S9F39phQcicOE0NyrKM-dGQlGfweCvmik4HhKqDrhBBohEg7jatWO48dNRbLmhBJ_z3gK-UruLFPODgaAk37oE1QN2qBJ5T0-MygGJIuKcFSc8CYgRN9_ux37lcNa3rifYYL17K0cZM6vrkQegM83uHvw0bWYcT3eSUYTjBJUgomgAYw8daUp8pSGVEpSggZoTnjJCXOQta2DuRlRd7bB4u_QxsFdnQGNDdyuyix4dpdOR-ElhMx0ScafBeYUjodakBqv_5YMDU885x2NakvhZ6k_PD3o3LY5H8iMPxdUCEVh03n8b7upIMXnIkiX4_hq5dPQKSZwdxbO6CdT07eyUPPaHOiZpP28XyOo0g',
		// This is a TRIAL token. It will be expired at 31/07/2022.
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
		apiKey: 'pki-suite-samples-02|33ef9018939d1b44bfdf0d1aa464982a6701cbfab82a66b26561a9f8a3c011d3',
		// This is a TRIAL API key to use Amplia. It will expire at 30/06/2022.
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