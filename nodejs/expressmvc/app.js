const express = require('express');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const moment = require('moment');
const { Config } = require('./config');

// Create global app object
const app = express();

// Initialize configuration according to the application's environment. The
// Config class is a helper located on config.js to store settings to be
// accessed in any module.
const environment = app.get('env');
Config
	.getInstance()
	.load(environment);


/**
 * Application Configuration
 */

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Configure server.
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Session Configuration
 */
app.use(session({
	secret: Config.getInstance().get('sessionSecret'),
	saveUninitialized: true,
	resave: true,
	store: new session.MemoryStore(),
}));

/**
 * Middleware Configuration.
 */
// Add middleware to add parameters on response's locals, to be used on the
// Pug template engine before rendering the page.
app.use((req, res, next) => {
	// Pass some session parameters.
	// res.locals.userId = req.session['userId'] || null;

	// Pass moment callback for formatting dates.
	res.locals.moment = moment;

	// Get Web PKI and REST PKI Configuration
	const WEB_PKI_CONFIG = Config.getInstance().get('webPki');
	const REST_PKI_CONFIG = Config.getInstance().get('restPki');

	// Pass Web PKI license
	res.locals.webPkiLicense = WEB_PKI_CONFIG.license;

	// Pass REST PKI endpoint
	res.locals.restPkiEndpoint = REST_PKI_CONFIG.endpoint;

	next();
});

/**
 * Routes Configuration.
 */
app.use(require('./routes'));

/**
 * "Route Not Found" Error Handlers.
 */
app.use((req, res, next) => {
	// If no route was found throw a 404 error and forward it to the error
	// handler.
	const err = new Error('Route Not Found');
	err.status = 404;
	next(err);
});

/**
 * Development error handler: Will print stacktrace.
 */
if (Config.getInstance().get('environment') === 'development') {
	app.use((err, req, res) => {
		const status = err.status || 500;
		res.status(status);
		res.render('error', {
			route: req.originalUrl,
			method: req.method,
			errorMessage: err.message,
			statusCode: status,
			stackTrace: err.stack,
		});
	});
}

/**
 * Production error handler: No stack traces leaked to user.
 */
app.use((err, req, res) => {
	res.status(err.status || 500);
	res.render('error', {
		route: req.originalUrl,
		method: req.method,
		errorMessage: err.message,
	});
});

module.exports = app;
