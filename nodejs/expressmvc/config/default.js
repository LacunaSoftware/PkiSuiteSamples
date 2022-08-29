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
		accessToken: '6vQ7ZL8UCH1aDBrpuUXc3bdKJJo7ijMWbh90y-5R8h9G5Xc9Ut2-Ma8g7RFq6i87XeP2koaeisd85o5WZGUf4YmYVinAtQLKZXMfVQOVGayVu5EXfKHuR-b1Stp32bFaYa8uGcopuDy5eYFu56ESm5-j-32uS62CUHtKGn7Yn8hWzZrVDJHFD0I8FSbyVo7JqbPCeXvwTrigJiQJQ76MWe-EcQCZcBeZshIGWygDEve91AogfY5NLJ6s627xJJbCl0U0cd2oLJGfZAsF-FXHN8Wkw7rFiZKEmOcaqlu8b_85hTvv4N-eewhnGRNdM8mMdRC_-KIEh1QBWiJawiTgCKhJIfz_PW7ugieOicmmtyFZMMztiUj6cXHBHR7_l7CxCGo4pclUubkPDoqZuHZk8LIcUJcfrUd15c8s9FYXrD_x_MsdmUS2nG637y8L_gSUgg-aZKr0go6zyuR0TQEuea-FiHatFkzT3pJDfPHpiYqQZn2RHxlDmEiDZjbBkdtUpYIKCQ',
		// This is a TRIAL token. It will be expired at 30/09/2022.
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
		apiKey: 'pki-suite-samples-02|fc4906d4065c1a48890e85047ae5525a1ef0bc2f3871e3c5fdd092795557405a',
		// This is a TRIAL API key to use Amplia. It will expire at 30/09/2022.
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
