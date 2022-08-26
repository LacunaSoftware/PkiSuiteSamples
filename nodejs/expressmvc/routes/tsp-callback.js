const express = require("express");
const { TrustServicesManager } = require("pki-express");

const { Util } = require("../util");

const router = express.Router();

/**
 * GET /
 *
 * The route for .
 */
router.get("/", async (req, res) => {
	const { code, state } = req.query;

	// Get an instance of the TrustServiceManager class,
	// responsible for communicating with PSCs and handling
	// the OAuth flow.
	const manager = new TrustServicesManager();

	// Set PKI default options (see util.js).
	Util.setPkiDefaults(manager);

	// Retrieve session from customState
	const result = await manager.getCustomState(state);
	const sessionId = result.customState;

	// Render page.
	res.render("tsp-callback", { code, state, sessionId });
});

module.exports = router;
