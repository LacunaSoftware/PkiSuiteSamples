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
		accessToken: 'PmFZl-vOhi4AD79_QTU0fPSVTiuX1of4TVE9631OHttO3o5ayF4Rjw5aiVvoF6Fs-_YHSXb5KDcQhQ1XeA7EHgywALWsfIoOTe66srDIqTemxLvEKg0_FzQwBogpWLQfg-C-WgSsQMx0c_MfVleIV6qce5Cqg8G0ZJ1GQlFQLL9yRH4xDMwJ6rk8hQacEROI22szWsN8LyEaQ9Deh-K8GcbVZzgF4M5WPCpjZLdsdrCOU9qGfXBYGWs42XqrI8Ld12G1Hp8P2vp3p6BN0DU8iVQfMOkXqAGUKSnYsGku3iDn0wiPX5fNOMNsXrI03pkhc-tL6cUjK3RaidsZfOK1At6XAYvn4dFEPpihyqJLlISk3Cfua3e8JWDdVs8sbER8U4fgozDnNXV9xSeo2ogdRwsHuzjRQUhGIvLS8XIg5oWU9tmV-8NpBM38GK165CVIl0EJlQymA_RXWqdEw2F-HDCa3ojHF14fDcA9jTcPm3EdpzKs_HX81pGYSBRRH3xDbgrE4w',
		// This is a TRIAL token. It will be expired at 30/06/2021.
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
		apiKey: 'pki-suite-samples-02|99022048c3adf9498db86660ccebc6407f6cad2a5f48259fe7cf9c10dcebafe6',
		// This is a TRIAL API key to use Amplia. It will expire at 30/06/2021.
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