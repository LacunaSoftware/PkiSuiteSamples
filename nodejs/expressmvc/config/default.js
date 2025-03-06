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

		accessToken: 'UHf7q3bpm9MUk6kAK4jmDg6XCyYB0Z4eQSQnE607UUhyBALTxPLC5nyIIhIXyHXAGamWhjrBv6EAhVxhEEZqG7pRWU8tY6uag8lRX7oU47o8zsMCBPwdF2BmRl6pgXom-6JIqEDMZZZkxTqVY1-zJ4afL2aIVUDIWOgkdnSEaPBVPnti1V_frxSoLRjYKAow1dUzUlcZuJIWWxAgrQACGEy5UBwPIfF0BR3Im4MRijwW80sfxPgNCfgiqXlYOnqR-Jom6aZ93_pbcBezPUI0x5h194zx7zzfvyCoTFVYKLpso2gWUlz2jbAryA8Y-W1AFXrlTKHMCqoMtR3FuBr42-4NCAQrNAuWZynm6xc6GH76B1s9SlzrJ8drr44lA-p0AN9BqkaOGhR33auxcctDfzUikRLXcPqE6fMJD3tYRKQ1q48F-AR2bv5u6kVSgYULZS6qMaS6B8u_K3hMuw1BY92fXCnj7c3SWeGX0_y0qSsDzfssn0P2DbAAMEvt1oTfkAAgLw',
		// This is a TRIAL token. It will be expired at 30/04/2025.
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
		apiKey: 'pki-suite-samples-01|ac92ab94db9a84499c34aec3e884e598e653d886611c6599adff08997d21ccc4',
	// This is a TRIAL API key to use Amplia. It will expire at 30/04/2025.
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
	cloudhub: {
            // ====================================================
            //     >>>> PASTE YOUR CLOUDHUB API KEY BELOW <<<<
            // ====================================================
            apiKey: 'mR1j0v7L12lBHnxpgxVkIdikCN9Gm89rn8I9qet3UHo=',
            // If the CLOUDHUB sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your CLOUDHUB installation (with the trailing '/' character)
            endpoint: 'https://cloudhub.lacunasoftware.com/'
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
