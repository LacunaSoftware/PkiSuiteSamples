const express = require('express');
const router = express.Router();

/**
 * GET /list-cert-select2
 */

router.get('/', (req, res, next) => {
    res.render('list-cert-select2')
});

module.exports = router;