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
		accessToken: '26ORhg_2cTmMD4KqE5Z9I39BzqZZ9zzEHMlS-16-U92nL5bG7Bvk-uh8wkQ4vWEO75CUMhyr9O2wegGIIKGVwPJqDnrTEiTmKJYOnmpw8EPJWxr_BNk-fqPzQzmZRANni0iNO0JVN_b1BOQzUkslrCPw1B2HQSgD1XnAueDkhZ-jLbjeY62VzLcysdd1qEA8RljtF8gDsE8tjnIOryVYiRNyrF2svhIBuXdL6HxR0oweNdNhXi4GgJTXBJ2RfgjVNtd5DEDnx1DIUIGVE_fMnedLHDKogHOTcWopmhWMCP5k-VE3KujDgEfa0oD0romyenYgKTRHa-oD3G3PXEcfgkKZZ7Tpf8oLOqgTIP3DAJUZt_rNVHYysO5n2fOyj7KGkPPtmL-jbm7iAcJ7x3J9XWMtm0CFteeWhojfdxbmjanshSHUg1yajxNqHsUi2UBDi0Fau-PLyGEsyMEK9dPFuFM-5r40iK7Wa_cfxwPBDDbWjrX5m59xlwSpPOwi8LBI2U7Tkw',
		// This is a TRIAL token. It will be expired at 31/05/2021.
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
		apiKey: 'pki-suite-samples-01|4976af13a331744898f5d4d1ca1164594e09a6b607d501ad447bd7e6a801c2d7',
		// This is a TRIAL API key to use Amplia. It will expire at 31/05/2021.
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