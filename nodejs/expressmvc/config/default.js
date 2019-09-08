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
		accessToken: 'EgHO0LNnl8P8eYlE3gaXX32iiX7WxQ-rcuVv2piMtnwYLXvn6ENIYJzSpJ9k1J1y5nmaAhgPaaax3M1KYk1jCBHaqN8Lv7ip6jnvbTucDRZ-U-a99x-L1SBqVheeT_jTWvIWhGI5RPTXRa2NMxlCM7StaWOvYHWIykSJaM9dM8lgB1rzW_XR-NbPxKSIyk3Wp1k0Piw8KGEz2XrkKEfjElzSNmuTFd-FU4ltZUFtn8LL6tKaGE0iyC14PNk5maSmRKFWrN_LpFvzF7yoZLad5Z640diJHTpkYZ--O10CFScI1LvpMUXhAj60eeTnniq24vwkOwlD79DBwNrhWxKuQHWPpRq-ooxT0fO4iS3UySzh1EaNm8zjdDwvmL985fbFjuDDCLEHhenF_2g_YEB5CCJLq3_dSOsq1SwsoezqRidGGkG3mMpcCkAYibGvtUeRLt6RiEyUPSP80GgO5-Y2Rs-oE-GFirvrZ40LSjNAbvSJO0JZ5wudH586B1ZDtfHqPiWgBcWgATG3jKjWCieM_tk5VHY',
		// This is a TRIAL token. It will be expired at 31/10/2019.
		// If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

		// In order to use this sample on a "on premises" installation of
		// REST PKI, fill the field below with the URL address of your REST PKI
		// installation (with the trailing '/' character).
		endpoint: 'https://pki.rest/'
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