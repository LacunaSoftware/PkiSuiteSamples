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
		accessToken: 'Inn0QjJ4VF9ApkadmyLRghNYXhrymoeA6NrXCI9g26JDxFOrj1riOLlB_OmQNcuooWLFgm4oW_QtZfV2oX7xAbg4az3pSn_VhXi-kbvdVxUUupR3q9sAe4B0pOxwow5BSpQefmWlnOyOuF6fmu9lOelHUMCXgv_aQMzsgmwbnN7b9bQNwEz_JcjxxVOtoQrU-0TpFXBSHvRR04Bq4JWyc4R_KxUf7OEMFgkENcIy76twVjAG1DrNQWs9dK7TmvP0xW1z-TyEqKKogzJb4uto1oLelOi75mg_BfOwzL25l4skxc7ybF3IKGkkT6-yj7d3p-XBYXllmM5VQTZN8LEJjMIHBu93xe7zLrcTWRMR29j5TI7ZIYlOxCchgzZvV57_ZJur3jrZOx3CrZ2Puthx2TZ5oEQFjQ2-telcdz6peDz387iPb5YtWI7QaFDZi_LC2AHCKpnCWXD4gn1lYyZ-78lxWHI_i2YnJ-My7IL9uztj9CervviiuIXysZQOnSCJXrOPUA',
		// This is a TRIAL token. It will be expired at 31/12/2022.
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
		apiKey: 'pki-suite-samples-01|ee9a3416cc231a4ab177ccdee926d03f658a83d3673398514e99e21f590e8744',
	// This is a TRIAL API key to use Amplia. It will expire at 31/12/2022.
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

	// --------------------------------------------------------------------------
	// Web PKI
	// --------------------------------------------------------------------------
	webPki: {
		// Base64-encoded binary license for the Web PKI. This value is passed to
		// Web PKI component's constructor on JavaScript.
		license: null
	}
};
