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
		accessToken: 'g6L7h08xSgHrEaPT6xeJnE-Ftkby1Kcch4Z8FNUrgZVua66wJ2x6_8ropuf9Mir2XYaa5860st5x2pv9BdY4T2BNQtt0NGjvlua9jvdKc6m8wZQTpiV6cGr6fMu4m_L4rdCyccZnA5Js8VpU9FUEQMbXLOmpyeDMHK46g3TC17jQrNOen1lJ6LKpiYjsO9HVfFgBXFfRTlLTHCUUxa787mi_hk9VKgKBsbuohjG5T92aqNDwbkwqLLr8Qnl6oua1bnhPJm-BxuG5evv2HXRVxK3zN_qGw1UClY8gITZE-KxAx1JaSLTvhQxJkhb2f2610M0n6SsCLXdslTKsjYjC35dGHPQag8vgjpT2d45VRnbysCE26vZryH1QPHzaRZzNb_jEtny7yEBCQ5FQ5Q-TbBo1wkx_4axsi3t0o7wGkL_47dNddH07du86kwBbVicoUy66qm8UyWAuksERbM0eLoXW-r13Lm_yabRYwg4Ha9petUsC2QzXm_QfVgyiNIwrEJGmww',
		// This is a TRIAL token. It will be expired at 31/12/2021.
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
		apiKey: 'pki-suite-samples-01|768e7883e96cb54fbd41228e37da5bdab5763432e275dd778c18291fad14fcf2',
		// This is a TRIAL API key to use Amplia. It will expire at 28/02/2022.
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