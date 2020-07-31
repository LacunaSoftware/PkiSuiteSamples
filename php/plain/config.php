<?php

function getConfig()
{
    return array(

        // =========================================================================================
        // Application Settings
        // =========================================================================================

        // Trust in Lacuna Test PKI (for development purposes only!)
        "trustLacunaTestRoot" => true,
        // THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!

        // -----------------------------------------------------------------------------------------
        // REST PKI
        // -----------------------------------------------------------------------------------------
        'restPki' => [

            // ====================================================
            //     >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
            // ====================================================
            'accessToken' => 'NwwJCTbvLfr67RhLIeLd1Ut8S9itJDPBKXcF-CpRdoSkY4_nJrCuuKI3BDMgCqfwuNXfj3_aQP6keDMd8wxF5cEmptKmzTLdzvL7XGuYPNOcs7fjiipEWE1hL7AWsfFQdMVz8pYHPjpU9J7iO72WiHI2ELAqqhyNVrpT4MCR97b4FT3e43DBBqiF8nF_NK_oRuH50ycmVzme1zLPx-S-lmpXcfgjHl3lTLxjv36YD803dAF0gOgGD7L-rUqGEF80I_ATgXuEqCPhZw8dNdueTYDSN56kuATEWilYAzwwrd3eCeNq5qUyXVjiJg0s5OgNnsRe7pnGXQ6wu-zoIWLakIoPrhTYYnF85XzMM3SgKgGsxI9wxM3HvtgGgHfYXO4BRpACP_7kcqwwqP6e0P-u6Cp1skoOk_-vA4czbRW9DOf1cOelTLDLJbS0fnhgNXgW9_IycXxNC6EKZZWAI8rTDgw2jcTBQsvYNyCVKDtDSE4pOm6TQDxXzSHXMMdReZ4nyxvxjw',
            // This is a TRIAL token. It will be expired at 31/08/2020.
            // If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your Rest PKI installation (with the trailing '/' character)
            "endpoint" => 'https://pki.rest/',
        ],

        // -----------------------------------------------------------------------------------------
        // Amplia
        // -----------------------------------------------------------------------------------------
        'amplia' => [

            // The CA's id that will be used to issue a certificate using Amplia. We have configured
            // to the sample CA from sample subscription for these samples.
            'caId' => 'eaffa754-1fb5-474a-b9ef-efe43101e89f',

            // ======================================================
            //       >>>> PASTE YOUR AMPLIA API KEY BELOW <<<<
            // ======================================================
            'apiKey' => 'pki-suite-samples-01|1f3c9a4bbfdab24b9c1afabef298f166caba68aa76123d2341bf7c24c3d45529',
            // This is a TRIAL API key to use Amplia. It will expire at 31/08/2020.
            // If the Amplia's samples do not work please contact our support by email:
            // suporte@lacunasoftware.com

            // In order to use this sample on a "on premises" installation of Amplia, fill the
            // field below with the URL address of your REST PKI installation (with the trailing '/'
            // character).
            'endpoint' => null,
        ],

        // -----------------------------------------------------------------------------------------
        // PKI Express
        // ----------------------------------------------------------------------------------------

        "pkiExpress" => array(

            // List of custom trusted roots. In this sample, we will get the certificate files on
            // resources folder.
            "trustedRoots" => [],

            // Offline mode. Set this, if you want to PKI Express to run on offline mode. This mode
            // is useful when there is no network available.
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