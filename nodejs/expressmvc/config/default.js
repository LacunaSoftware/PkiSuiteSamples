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

		accessToken: '-iGGkCsWf-YUBtVA9IemMmg-hUmLO1Saph96SbiJEpyeU5n4G-ocrDwLHeMXYZ5ETNlqIYRpOMhaVkYsU2MR4P--1O39JF1ghZxLUlH8_iGNA4mBzHs41hSHdaZ4zF-pML-eVxa3oe3beSO-L9JO3qUwrW-DkERW3KY0f2ay22DXi2b4AXEd8NCJpyN0kzgOooksoUCpuVipVjrB98rkV69kkC0pwtBQoGUjevoZ_GyEIpKK1FpkafKi2jk-dprS7zRlRGB2x9ZislVyT1ZFpySWt0a-hY6H03rzVfgzQjumTGoXX33HWJZ5ZnyRMCrJfCVJRm69E6Lwmmabjo4dwB-uU1UuI0FI0AHdi7NVJl-V610axh3927Db__VRxrE_0kJAOLqmL7ZXxP2k2JQbTZe5qHQYzleo72zbAzhSbWvEc1ftVpb6zEbkARz4VR_xetjCWplHTNlMhTl9LRHQjlE-z5kv84WZ3HqYGhUmQ2tC6CuxeV2aE23Rf8XQlVTY3Q2cP_MY8PnGJmmAtW__Eu7Oa04M9WweZgYC4udxJkPJJxUKcJkycELWV-',
		// This is a TRIAL token. It will be expired at 31/12/2024.
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
		apiKey: 'pki-suite-samples-01|9d8dbf5046fa4448914c72e557c4fd7a6864dc049c1854177282796f2152be78',
	// This is a TRIAL API key to use Amplia. It will expire at 31/12/2024.
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
