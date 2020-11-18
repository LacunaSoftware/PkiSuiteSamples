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
		accessToken: 'p-wmO405fqTQhNljcIgs3LZ2tI6nQ3lWnoI-1u6Pz5mg61AclBFdiyWutxYSDF5YBhe6WcYI1gJbwvaJ6NQSLl8qVYt48n-oLjJDQzo4KlB15wPqPr3PeblkgubxI-JOEaJfTsnQeNW6bS6Pl5oXq64cH2nUPl0lzjKBw6S9i7VGRWgw_gli_aB8NAG3opJG2FhoosyjRy00xZylnD8LzsX-FlWbMPd_IRLp9f1u8unRSIYhu1_m7cfpXeYe15XenFXvGW07pwvcImKcbhsJJhi4mWFYr8WlHIjPnFPoJssmPkx0W-uDP9m67t-9gIbb3h5aNV4jsrRDTwZwtNU9sMpVCrsDKrolXOE1hSVbtOXdkxxY-GNrUEDbXBd3aiJcM9SJy-tz2HuqdkEj_7FYGAOGjyLuIwtufyltnLVHsU-Eh33bHBvTlXbJaO-3Xi1YTac5s0if7jG3zmxtWnp-TthLK90uHaZB6suqzVokQIeG1fDsmX6akgQb05my80JjoXyUqA',
		// This is a TRIAL token. It will be expired at 31/12/2020.
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
		apiKey: 'pki-suite-samples-01|4dda4ac3b6784544be8f68db9885e2ed3a65fe9e756b39b0b05c45dab5a5f036',
		// This is a TRIAL API key to use Amplia. It will expire at 31/12/2020
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