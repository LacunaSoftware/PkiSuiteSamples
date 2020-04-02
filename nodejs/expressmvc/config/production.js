/**
 * This module contains the application settings on "production" environment.
 * The fields here will overwrite the default settings.
 */
module.exports = {

	// ==========================================================================
	// Application Settings
	// ==========================================================================
	environment: 'production',
	protocol: 'https',
	ssl: {
		key: 'server.key',
		cert: 'server.cert'
	},
	port: process.env.PORT || '8080',
	debug: false,

	// Trust in Lacuna Test PKI (for development purposes only!)
	trustLacunaTestRoot: false,
	// THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!

	// Web PKI
	// webPki: {
	// 	license: '...'
	// },

	// REST PKI
	// restPki: {
	// 	accessToken: '...',
	// 	endpoint: '...'
	// },

	// Amplia
	// amplia: {
	// 	caId: '...',
	// 	apiKey: '...',
	// 	endpoint: '...'
	// }

	// PKI Express
	// pkiExpress: {
	// 	trustedRoots: [...],
	// 	offline: true | false,
	// },
};