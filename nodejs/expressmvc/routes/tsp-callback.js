const express = require("express");
const { TrustServicesManager } = require("pki-express");

const { Util } = require("../util");

const router = express.Router();

/**
 * GET /
 *
 * The route used for callback for cloud samples.
 */
router.get("/", async (req, res) => {
	const { code, state } = req.query;

	// Get an instance of the TrustServiceManager class, responsible for
	// communicating with PSCs and handling the OAuth flow. And set common
	// configuration with setPkiDefaults (see util.js)
	const manager = new TrustServicesManager();
	Util.setPkiDefaults(manager);

	// Set PKI default options (see util.js)
	Util.setPkiDefaults(manager);

	// Retrieve session from customState
	const result = await manager.getCustomState(state);
	const sessionId = result.customState;

	// Render page.
	res.render("tsp-callback", { code, state, sessionId });
});

module.exports = router;
