<?php

function getConfig()
{
    return array(

        // =========================================================================================
        // Application Settings
        // =========================================================================================

        // Trust in Lacuna Test PKI (for development purposes only!)
        "trustLacunaTestRoot" => false,
        // THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!

        // -----------------------------------------------------------------------------------------
        // REST PKI
        // -----------------------------------------------------------------------------------------
        'restPki' => [

            // ====================================================
            //     >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
            // ====================================================
            'accessToken' => '9MZRcEcYpebYou5C86j_X18eHUpitOnu4Loh98KchIH0g7yuo6oufMvFoUxcIWeFELRB4ve81PThXNXz5z_ls8Ei7vb9ie6zzHyHow_I7ZNJQUSSIhGeJHQvhrXMca4C6ufOywfm-DkeOpLA8QVnzK594REZOiIPiWd6krleY2avwLHdwkAeJLSSjvR3znSCxLkZYOdPEFdyPf6IPYYd61UcpjLi3T0GzYEpH_8vq1G3OQOl4PDQOrAgAyhr3xVf2AP2pxgo5Td1uWQ0QRkVcun6UgdIvIHq1OaABXA1YWLat0SywpsIK_njFcaR2IatNVE5J1oZjcawuiXthqzP2p7FievHT6T4yYjuOhQvzRx_2XtJiPpszeg3_dkkEs4Z5aDx97yr1QYpKkn8zPh9-puGgnqD2XIAMOMnLckOVDZJhG8jWMtz-JnYut5pZWM49X0s2XALXjvahWv718w806OPnLYq_fm25wzloizaR56ktPq8fWbITAcSQqVIY7XK3Rg5gQ',
            // This is a TRIAL token. It will be expired at 01/03/2019.
            // If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your Rest PKI installation (with the trailing '/' character)
            "endpoint" => null,
        ],

        // -----------------------------------------------------------------------------------------
        // PKI Express
        // ----------------------------------------------------------------------------------------

        "pkiExpress" => array(

            // TODO: Write description.
            "trustedRoots" => [],

            // TODO: Write description.
            "offline" => false
        ),

        // -----------------------------------------------------------------------------------------
        // Web PKI
        // -----------------------------------------------------------------------------------------

        "webPki" => array(

            // Base64-encoded binary license for the Web PKI. This value is passed to Web PKI
            // component's constructor.
            "license" => null
        )

    );
}