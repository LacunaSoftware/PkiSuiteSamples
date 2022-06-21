const client = require("restpkicore-client-typescript");
const axios = require("axios");
const { Util } = require('../util');
const { restPKIcore} = require("../config/default");



var config = new client.Configuration();
config.apiKey = axios.create({
    headers: {
        'x-api-key': restPKIcore.apiKey
    }
});
config.basePath = restPKIcore.endpoint;


// Authentication:
var authApi = new client.AuthenticationApi(config, undefined, config.apiKey);
authApi.apiV2AuthenticationPost({
    ignoreRevocationStatusUnknown: true,
    securityContextId : "201856ce-273c-4058-a872-8937bd547d36"
}).then((response) => { 
    
    console.log(response.data);
  
});