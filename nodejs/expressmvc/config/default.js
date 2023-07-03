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

		accessToken: '6RXZ5Cz6Y1qThhktybAC3di1xVh-pWkIX2PQr25_ALBD1vQqdD7_w8ccduHDd2Ajq2qj5cRwyvnWllfyxdY-fxnHJf7Rna7EaX-9Aeq6oG1a8r1x4iSlaWaUzMNM2Cn38HaRTcJ5-cTA4pI70kexYYX_nYBDdFNUqH7b38c5dfW-qAj2x6IIrx-KUeuoFXZ6ln1mo70E-rT1F5_VYu0QyUzs_f0I6jJtPHeTl6YZ2H7SG9Xp0UuqZliQaS8Q5BMchZFRbzlM7ilSE2K9N8S807fsM7pfFKcegn1fbRDq_XjLrq5AwKcXrhGrwDTtAEcR25kn5Y-2Ef0v0LocJHHV8ZuL4ngOvpykDnQe4i8vcorvRjGWkAQaf58ZK0S54jGjEaMn8EgTaWjwMsdX2NwsEUP1jIzqbPA7iXnC6_iY2oMhUIZtl5nBtOxuFpfzP_h49ENfU-zLlbGrnMOHrq7gNjJRGtvTRHSD4Kaeuq5s4NQbPry4m5p7C8vJiRAolbhN6y-m3w',
		// This is a TRIAL token. It will be expired at 31/08/2023.
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
		apiKey: 'pki-suite-samples-01|330a3396472b5045827c21e2cf927e1c173c8fcc8b0452e992eab91b98e8ba16',
	// This is a TRIAL API key to use Amplia. It will expire at 31/08/2023.
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
