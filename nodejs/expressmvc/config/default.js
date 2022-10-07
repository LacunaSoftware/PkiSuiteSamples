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
		accessToken: 'SYh_mzoyynRQBsGjKT2XRPFPKHZVkbeggxEv0uFTgeJy2PiTRjbaEXCknD15tKLGg-Gg6JZidhUszN-m5PD4yOSdeOwCK063_jflilJ_Pz4BbZ5dKfgBVdN3UpxpF77emzGS7VkKK_fR_6pmHu_TUF6N9r_c2BjggOOLHFF3wlW4LoIVoeGT62N9lQ6Sn7cwzX_gbfgmsiKtThOoiVRmve5ZVpj00dU3hLKyn_R7Et5axLVabIGd85daSgo9PNhvj0jtFl5yGFLyOL3wodkSf-lUfEsrqVwo-RTiEiq8dHt_3rvR8cxfLHgBMXFmchIB38FYMmYEESAHxbshNPgWqnMBW-yQZpbDgIh6OfGQmS-v93_kLnv1bBq1u32TbOog_QU0oy6bVSMwnOSUrHF8g-xU7XYlCsSPHzD0FLBc7GzyFD4mznDuy1kVTFh1zkZdSgBz1g4dS2cf00QNo137w_Xdimyh4a5fuX7g4e-YLLPeEx26WyJVgu5vUOm2jp7N9GCeGg',
		// This is a TRIAL token. It will be expired at 31/11/2022.
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
		apiKey: 'pki-suite-samples-02|0ea74a1b1d189340a6d509f92e503f96fae5c3cb7f658d8c8c63146b6c8d17cd',
		// This is a TRIAL API key to use Amplia. It will expire at 31/11/2022.
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
