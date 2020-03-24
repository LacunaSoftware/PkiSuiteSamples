const express = require('express');

const router = express.Router();

/**
 * GET /read-cert-jquery
 */

router.get('/', (req, res) => {
	res.render('read-cert-jquery');
});

module.exports = router;
