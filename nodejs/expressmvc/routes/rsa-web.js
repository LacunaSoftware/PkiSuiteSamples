const express = require('express');

const router = express.Router();

/**
 * GET /rsa-web
 */

router.get('/', (req, res) => {
	res.render('rsa-web');
});

module.exports = router;
