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

		accessToken: 'BhAehKDdXcSH-pQtoiX5KSFg4hiQOdOpSCCKbZf2IsZPlK4s_BX2jxp4gudxoJs_mAvUcVIHM3jHoK6l3ZcQvVD3SQuqB_DjY8U9LITFkuowzoTyRyvI_864pdh-ECypTiaHwmwwzzJCbryiKQZ2BXieqUYWr7oi-yEdkYh_JWZli9vkyGJbaG_yNGZmNOMNCpSHrSX0au-_2_KKRwd4j6hRkVB1bVWLf1fwwO3SrZFEa0_92iwD54pBItIy6DXBNBmVvUxdEh_8M33Nv26TeiyxwzGeks2QLk48a9eefR1MYmAgee6NsFprHWi5BTdc9uHlKooeWmHAqFktB1o2SsYBc1ireuNZHW2e_kyMt8q_TxwwWmSjdCuyAobRSm2tbpkNgvYIe_fk-E_hbwujC1TN0j6831Ea5hNgtDKfOug-PPKWEjfP9SEaHmkk-Gakng5z7pwdNdy-DR1T4Cr4-76WFdAoPobPX8_nAavkg1ksNVnArTQxb8Ji2p7cTEErwfidng',
		// This is a TRIAL token. It will be expired at 31/05/2025.
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
		apiKey: 'pki-suite-samples-02|51b83be56cd4464e969fc1ef8f15960521555545ddcdd3b5bcef240f28f2aa19',
	// This is a TRIAL API key to use Amplia. It will expire at 31/05/2025.
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
