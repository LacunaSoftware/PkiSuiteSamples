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

		accessToken: 'FUk9hTcET9KlWMEo0ii1AV2QoFIJwubtTvS2903xYEydpg2zL-06JoNDlAEi_YKozJfXdyacpm0K0H_Sf4OL7xH-zqzgOEIkKBsgotAWyfY59NDDz6kWrftD2CtnZdD3eA5Cuywe07brXrC_WsUWmQXASbEv1XxT5JPv3OalHzkD4eSx4WW-aH1Xon5MFMSLYc8S_iUGGdRq5YugemLhkZx6FeVxFrlv85tov8gmArYBUQyZIm1w87-PPFKFTiQeakmZdcsTZSqy_7IT94_uMgUax3i7wNAbRQ5Bpt6Htc0qCNpq4Fgosbfb4AanzumQjnlpvpGTUzcXT6IByyox6ZXGmTD3gYx4ttG_5xfSIAsY7Q2WQ_pDJpXDSEYEEhiidi7ul8YSDWWRwgM4V-jGcPMZoI4eVVoKQEm7Xpu1jY3v2oWH5KjyWqOrkHXuf_ueACw1vmumDUzHhW0PQ6CLtQ8jUye-gNWLi6iuuJe-qwNfyUz7_BNw5jHBJTVIpO-oLCxmBg',
		// This is a TRIAL token. It will be expired at 31/10/2026.
		// If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

		// In order to use this sample on a "on premises" installation of
		// REST PKI, fill the field below with the URL address of your REST PKI
		// installation (with the trailing '/' character).
		endpoint: 'https://pki.rest/'
	},

	// --------------------------------------------------------------------------
	// REST PKI Core
	// --------------------------------------------------------------------------
	restPkiCore: {
		// ========================================================
		//     >>>> PASTE YOUR REST PKI CORE API KEY BELOW <<<<
		// ========================================================
		apiKey: 'pkisuitesamples02|1e3bb1e03dbaf54993f013831a349bb359715f096841a347b767297074a34ded',

		// In order to use this sample on a "on premises" installation of
		// REST PKI Core, fill the field below with the URL address of your REST PKI Core
		// installation (with the trailing '/' character).
		endpoint: 'https://core.pki.rest/'
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
		apiKey: 'pkisuitesamples02|e97c52359d52924092c51a95cfb1ade7898a68d6c21ec351b225009b79a7d1d0',
	// This is a TRIAL API key to use Amplia. It will expire at 31/10/2026.
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
