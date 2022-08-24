const express = require('express');

const router = express.Router();

/**
 * GET /
 *
 * The route to the application's homepage.
 */
router.get('/', (req, res) => {
    // Get parameters from urls
    const { code, state } = req.query;

    res.render('home');
});

module.exports = router;
