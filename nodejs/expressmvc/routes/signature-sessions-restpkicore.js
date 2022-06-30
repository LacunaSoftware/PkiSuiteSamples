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
    
    // POST
    signApi.apiSignatureSessionsPost().then((response) => {
        var signInfo = null;
        var returnUrl = response.data.redirectUrl;
        var signSessionId = response.data.sessionId;
        
        // GET
        signApi.apiSignatureSessionsIdGet(signSessionId).then((response) => {
            signInfo = response.data;

            res.render('signature-sessions-restpkicore', {
                returnUrl, signInfo
            });

        }).catch((err) => next(err));
    }).catch((err) => next(err))
});


module.exports = router;