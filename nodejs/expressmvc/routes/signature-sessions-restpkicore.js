const { SignatureSessionsApi, Configuration } = require("restpkicore-client-typescript");
const express = require('express')
const { Util } = require('../util');
const router = express.Router();

var client = Util.getRestPKICoreClient();


signApi = new SignatureSessionsApi(client, client.basePath ,client.apiKey);

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