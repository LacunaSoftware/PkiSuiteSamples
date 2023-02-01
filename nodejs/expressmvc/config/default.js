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
		accessToken: 'pPRfszRrwB0_ZUmISeuKRPXnX1Epe2CdNyeNUgNWaf2qpgxhGfGSxJhbhAXXadMyysY-DE5dv2w2EfeM1aKz4q8xBP4m504Ie6gTFElvzwTqyUPMl1vwooPsqR3zugn7jCxFq64lI7Yh00uTYDs9rao-q6CgdsZrBOnpfKujRzAtbXdryFgv9xz56pBcQAGeDDWGgnHLcW8DCq1JF7rab7dD6veyFv8hoY1bo1yVQXuSUEo1dfGhQJ754ditmHjYo85OvPYBLKntBb2x1-QydPq2dJXq94tXT4LAjO5wKGKj4Ny_OjN8cJBRbsfyxDtpNHCbIUscjtKzGqXeTtZVA9nrHuM03jCOzoXa7RFUPEsRlznCH502QzeADQzTsDUtEatJ6rZyqc6QzLDxJw-TDvAiGKfX4Nd_yMc5yl1U5mq_qGTpb-vy3t9es1Ype1R_z7FcPawW2a5NH5rjCdCI7ohp3VhnKhBNmZIDSJU0aviqmdOTXQPP5lth6T8gFlHfT2TkSg',
		// This is a TRIAL token. It will be expired at 31/03/2023.
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
		apiKey: 'pki-suite-samples-02|80a04495bc96c240b1753e98b294d7167f1149f6da25428875c76693591f5395',
	// This is a TRIAL API key to use Amplia. It will expire at 31/03/2023.
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
