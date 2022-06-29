const client = require("restpkicore-client-typescript");
const express = require('express');
const axios = require("axios");
const { Util } = require('../util');
const { restPKIcore } = require("../config/default");
const router = express.Router();

var config = new client.Configuration();
config.apiKey = axios.create({
	headers: {
		'x-api-key': restPKIcore.apiKey
	}
});
config.basePath = restPKIcore.endpoint;

signApi = new client.SignatureSessionsApi(config, config.basePath, config.apiKey);

// signApi.apiSignatureSessionsIdGet("3fa85f64-5717-4562-b3fc-2c963f66afa6").then((response) => {
//     console.log(response);
// })

router.get('/', (req, res, next) => { 
    res.render('signature-sessions-restpkicore');
});

module.exports = router;