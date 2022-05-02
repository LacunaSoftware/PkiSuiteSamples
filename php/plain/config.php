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
            'accessToken' => 'b28yTbTHPkqzCxEUqwZaO26D5FtpYB2YCSV6MmdSta06XRdstgq6UlGYr0A4btZRRl6uTGUAjtNVDXQshtcDw1vV9O_algS5-yImgsNIEp8omJ5_1iHeebEyOLNy2lMjOInGDJNWOaxni_YHS-xIy3dce1R_1WO-iyjhPzdofr-6FBUcN_i3588x-qN458veuy0dNSCbqk0NEaBtyqPqDrSveBEhp3B6CAGOu9dvFlESdKzaKW-C1tOq1bEZnqaaZgMTtdQdC2djdk_MhtKlwqnCMLDI6R-6rUQgeYtNPf--UDaeO5XLlh3AoxYgVOFHzJmEBKd-JbY3db0cdLzlKT8wfu2uR-f4CzZ-g3xUWQkewJqFRpAURzbVtLygWofk9eZEy2hFHGVhSqzYRmVP2DvQm2IcV49wMH3rG2CEBCYWroMWFkgkUgusftBYExsYz8Bf1r90c_ieQ8sjttPS7E_-mwZexxWL7cush7Yb0fRcyGetlSo2rdYszlD7ESgqBH0LZQ',
            // This is a TRIAL token. It will be expired at 30/06/2022.
            // If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your Rest PKI installation (with the trailing '/' character)
            "endpoint" => 'https://pki.rest/',
        ],

        // -----------------------------------------------------------------------------------------
        // REST PKI NG
        // -----------------------------------------------------------------------------------------
        'restPkiNg' => [

            // ====================================================
            //     >>>> PASTE YOUR REST PKI API KEY BELOW <<<<
            // ====================================================
            'apiKey' => 'pki-suite-samples-01|4c951e182496a545be6f31b3c7c76f512f610588947999807fbcaa0d1f72fb9c',
            // This is a TRIAL API KEY. It will be expired at 30/06/2022.
            // If the REST PKI NG sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your Rest PKI NG installation (with the trailing '/' character)
            "endpoint" => 'https://core.pki.rest/',
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
            'apiKey' => 'pki-suite-samples-01|3ab03c6c5a99324a81b69132680800e08de58c0edd77aa8dcc073ade81d274e2',
            // This is a TRIAL API key to use Amplia. It will expire at 30/06/2022.
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
            "offline" => false,

            # Default password to be used on generating a PKCS #12 file.
            "pkcs12Password" => "FZQkTVLy2MErFCu2H0e8Lq9QPW2cqEgMrp/PES9m5JZ9xej6mCheNtuK8bj/qLhMsV4PvPg2w964A8E/N2WaYA",
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