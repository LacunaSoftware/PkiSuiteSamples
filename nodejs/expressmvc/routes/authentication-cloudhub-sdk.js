const { CloudHubClient, TrustServiceSessionTypes } = require('cloudhubnodeclient');
const express = require('express');


const app = express();

const router = express.Router();

/*
* GET /authentication-cloudhub-sdk
*
* This page will ask for the user identifier, so it is able to perform a request to
* the next page, where it will ask which cloud signature service the user wants
*/
router.get('/', async (req, res, next) => {
    try{
		// Render the authentication page.
		res.render('authentication-cloudhub-sdk');
	} catch (err) { next(err); }
});

router.post('/', async(req, res, next) => {
    try {
        const cpf = req.body.cpf;
        // remove all dots and hyphens
        const new_cpf = cpf.replace(/[.-]/g, "");
        console.log("cpf sent: ", new_cpf);
        const client = new CloudHubClient("https://cloudhub.lacunasoftware.com", "ftulJuCci2cUjkdecTu/fAsUePv8ahga+CRvgKPFmCc=");
        
        const sessionRes = await client.createSessionAsync({
            identifier: new_cpf,
            redirectUri: "http://localhost:54123/AuthenticationCloudHubSdk/CloudHubCallBack",
            type: TrustServiceSessionTypes.SingleSignature
        });

        console.log(sessionRes);

        res.render('authentication-cloudhub-sdk/service-select', {
			sessionRes: sessionRes
		});
    } catch (err) {next(err);}
});

module.exports = router;