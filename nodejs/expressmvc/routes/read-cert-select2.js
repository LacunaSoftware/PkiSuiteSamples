const express = require('express');
const router = express.Router();

/**
 * GET /read-cert-select2
 */

router.get('/', (req, res, next) => {
    res.render('read-cert-select2')
});

module.exports = router;