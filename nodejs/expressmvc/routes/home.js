const express = require('express');
const { PadesSignatureStarter, InstallationNotFoundError } = require('pki-express');

const { Config } = require('../config');
const { SampleDocs, StorageMock } = require('../storage-mock');

const router = express.Router();

/**
 * GET /
 *
 * The route to the application's homepage.
 */
router.get('/', (req, res) => {
	res.render('home');
});

/**
 * GET /check-pki-express
 *
 * ...
 */
router.get('/check-pki-express', (req, res, next) => {
	const { rc } = req.query;
	const { fwd } = req.query;
	const { op } = req.query;
	if (fwd) {
		if (op) {
			res.redirect(`/${rc}?rc=${fwd}-express&op=${op}`);
		} else {
			res.redirect(`/${rc}?rc=${fwd}-express`);
		}
	} else {
		res.redirect(`/${rc}-express`);
	}
});

/**
 * GET /check-restpki-token
 *
 * ...
 */
router.get('/check-restpki-token', (req, res) => {
	const { accessToken } = Config.getInstance().get('restPki');
	if (!accessToken || accessToken.indexOf(' ACCESS TOKEN ') >= 0) {
		res.render('home/restpki-token-not-set');
	} else {
		const { rc } = req.query;
		const { fwd } = req.query;
		const { op } = req.query;
		if (fwd) {
			if (op) {
				res.redirect(`/${rc}?rc=${fwd}-restpki&op=${op}`);
			} else {
				res.redirect(`/${rc}?rc=${fwd}-restpki`);
			}
		} else {
			res.redirect(`/${rc}-restpki`);
		}
	}
});

/**
 * GET /check-amplia-api-key
 *
 * ...
 */
router.get('/check-amplia-api-key', (req, res) => {
	const { apiKey } = Config.getInstance().get('amplia');
	if (!apiKey || apiKey.indexOf(' API KEY ') >= 0) {
		res.render('home/amplia-api-key-not-set');
	} else {
		const { rc, fwd, op } = req.query;
		if (fwd) {
			if (op) {
				res.redirect(`/${rc}?rc=${fwd}-amplia&op=${op}`);
			} else {
				res.redirect(`/${rc}?rc=${fwd}-amplia`);
			}
		} else {
			res.redirect(`/${rc}-amplia`);
		}
	}
});

module.exports = router;
