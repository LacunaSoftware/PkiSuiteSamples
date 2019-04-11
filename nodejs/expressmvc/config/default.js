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
		accessToken: '9nusF9Wh-lTYsVRbhkgjYwMqrz6nfZQzrJmcU8nQMapctnql8GUh4KA56YCnm_Ff-VKelhD3tE9zXfUzKOn1yL3h3h7uz-Vq0Eu2sb9rl393Vd53LuP5Hoza7cOlCMMJa598yu-bc9zPwU_sH81sn6T-vKSpBjdvXM16rk--im3RTA5brTHy1ggCO_oavmVUqn1zb6H6St13M8B0FdflSNxeRD6ThcABKeDFQhKqrgAGGLZrsoZDXh-hleatUzMp0kALb_f9VKVDwt4QGEoMS14bT4hbU9hY4kaGdaHsAE8Zio6Ja5LSIIKIkqIID-i-5vEg4R9cjrZ7tFaM5MwKVlvETRDqHUlK30HjzA4ngLwSSRYKtKYFFa1PRBJ9l6aU7J9MUlxogk1URxV0oveC83bI_oWVvB1Wzd1gUFPGpHILINNRkzfafabl5V--zReEoF-wDbo6KewBBU9nF6-UaFEGK-3ZkQ2Fa8K9KYMJGrW7ylTwPIpojBWBHzlyXO5X-jjF-A',
		// This is a TRIAL token. It will be expired at 30/05/2019.
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