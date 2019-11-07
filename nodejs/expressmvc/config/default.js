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
		accessToken: 'x2st_aScMCgWz24m27aH8aUtQwF44ar_4tYmI9wEaN8rBRtg0466e0vYoDtxdjhq_ncufxevzMdXqjLlWXgIxgULdRfSfZsc94XZHrWWtWbWubksGnNg-fzsXo59T_m8afBLk5esE7109KOJ95InQ46SKaJk_vXnpaNDmgDBCX1JByRWhkwXN22LlQdv0wpbZ_ulFg0J-VmvWGeXUsUhCx8u72A9YQnnASt5eZd72tAttJ-Uot3QmVwmgwnI3b9aHF35EVMHP95qwZbEtxoVcH6pLVpqjgFPHELL50uNg6mWt4XqdzyAey_W-6rPGyDcBvinXcagIh_dDk7YabViZWdfu-cOZgXfTxI6igqrbmeoVIkEFMrwa9gPuE8P7_L_fCpwEqy8dVp6rYpcQq-lWOtQzQV_h2gk71XW86WZl-Rt0Y7fXmsBUWWVcI1RJyDkNaZSxNwcrrJk_JoB11YSK02EbNmgMLxd5w-Pm16ba7IHpHyolA4Z5J44SHffGZZWpiSD_g',
		// This is a TRIAL token. It will be expired at 31/12/2019.
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