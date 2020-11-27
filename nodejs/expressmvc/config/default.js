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
		accessToken: 'mlUvIL-kRUclDo86QBG22W8KWhdQcZzuqnjemEmyFD4zrqMiL_swVH9GL5criPhMB9zjps8qko_63E61IuGTEG51gQd65wJVblf_ldYhQsGFhBhj3KV5EqTmtL8uAwD0SWJ2sqiqJK5Fbln2n5vMscaSPDvNqpXymxClWARLp_mO86P43z7IluyOZPKycJJW1fxmAppVBxWDzga_ctZOn6x0zzA2DIJWGsVM00Tds45-qlye6uY1BTgnx2i7lGMeFvaagN3aVB6p5j2Tted5OQDgCpiAC19osq_ybVN9N8MysNjhRzRftu_LZpU35BkLc736r1NJRbISuH-c5Y0upDIOZSTtmicXYTVtWBP9E2bWZmCkeFcWdCDLy-B8y2boFgsX-mFvgQmLIxaZYH9qE4jcjvTFcGZZ_n60dZE_R4ViHi8-VI_ORBT6YrCwwWESqP3SuiY1l8l39jR7XMEKQbxTaXc7f42NZZp664Heb_TGuyOogMmWb7zJLCRTsTUt0Us6Fw',
		// This is a TRIAL token. It will be expired at 31/01/2021.
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
		apiKey: 'pki-suite-samples-02|6ad0c0c4a610b540bcf7dd4187ea1ee83f189c6d347ed6de74daca6ca3c70335',
		// This is a TRIAL API key to use Amplia. It will expire at 31/01/2021.
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