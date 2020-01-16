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
		accessToken: 'VZ2kllu4IQR7lFoMkRO0CCP9HYVJBc4fpmwA8qianigyzzMlEPrlLGYMGKXjv8PY-i0OVc6UHJxNr9GxxbFL6CdbE8bvhn7Z10XIvjL3YnE2_WzTWw4mqKH_dv1BaKwJ9uL6cj8WncXsavX4P9sAG3zxVv-iEAdKJjODRuuMKqLAeTJsQrxgbswSHMpMereQ1IjvyiSJvit09NCsgDoD-IcNqGWhwtHRnj2iri3122rLzUA_zZEW5RzNmDLWGSszf3WJvfNkqtpQ-GsUxtzmrhwu__qr9_8kBlg4GaeVidNsJ3kC5yAEyzpsWrMHi3FPNRqlkt6EWgXmaMju7ex8Fn2On_tWi4hqIcetzfQxR4Uc3XVf2JmEMa7DnCkjwDXXrWR4GP3ivkQDZlDprtZnl3vNTQmtAHqPkz2kB6jLxmDECAlV661dOLp72cLbC49S15k2gRFEfYDa6_T0hR0N0IoBDR2j-3_MeTbr2ToozNe7f_7ipUsfq3zNXJ8Z0hqvI1ZhAg',
		// This is a TRIAL token. It will be expired at 29/02/2020.
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