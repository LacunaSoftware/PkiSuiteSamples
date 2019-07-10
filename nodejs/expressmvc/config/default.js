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
		accessToken: 'qCzaYvkfrNEuSPSZ08wDidgmg5MBGCjwU2-A0D8l0DOUaWOqR_OVfZhbSNJ44dthx8uF3Wekj-MlHiMaBabziwK87JpXJXwFAlY8v_ccAkBzVq21d_UBPD4ZZH7P71j-rsPfBSilLk6fpUpMWGB-OwUlnW6j6OIR3FX90VXW1WgN2OI8HfnFZjLF2U-nvJyO5yt4dab2cS9B9m821u5JFGLLvlukDU_xg1wquLkxFEJEBppw_ESQNuWSJnILe1UYcdMdHVF9D-322cLkr7BoV0ZqZ2PsfEkqm9IGAjmfZSddPVRocIdQ9c4lB4d-PThF9QYoOdMoFZXwHHgjrlIjazQ_KfsEd2VaUuuqQPnVpnGBKnafqQiNC9C6FypEpAcn643RV-pcO7iDMi8XjCRelDlCMxrS08Rh4arf4Y-19SUfIGqcJL66iH7Phzs5ME2tFly1yG8UNJ6bxjzNfPOTIRXyy9058KpHUPs39W3ydt5I3Fme2ptwtczYmqzbh-nwPZSWig',
		// This is a TRIAL token. It will be expired at 30/08/2019.
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