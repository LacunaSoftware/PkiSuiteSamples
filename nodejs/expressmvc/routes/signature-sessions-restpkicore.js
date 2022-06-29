const { SignatureSessionsApi, Configuration } = require("restpkicore-client-typescript");
const express = require('express');
const axios = require("axios");
const { Util } = require('../util');
const { restPKIcore } = require("../config/default");
const router = express.Router();

var config = new Configuration();
config.apiKey = axios.create({
	headers: {
		'x-api-key': restPKIcore.apiKey
	}
});
config.basePath = restPKIcore.endpoint;

signApi = new SignatureSessionsApi(config, config.basePath, config.apiKey);

router.get('/', (req, res, next) => { 
    var returnUrl = null;

    // GET
    // signApi.apiSignatureSessionsIdGet("3fa85f64-5717-4562-b3fc-2c963f66afa6").then((response) => {
    //     console.log(response);
    // }).catch((err) => next(err));

    // POST
    signApi.apiSignatureSessionsPost().then((response) => {
        // console.log(response.data.redirectUrl);
        returnUrl = response.data.redirectUrl
        res.render('signature-sessions-restpkicore', {
            returnUrl
        });
    }).catch((err) => next(err))
});


module.exports = router;