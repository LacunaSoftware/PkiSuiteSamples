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
            'accessToken' => 'cGZXaEebA5xqCRQYj7_FpmhX_XoH59CcJpugA17ItTVvyywGkDmtsulqptdo6Nf0Ae_yU4jMIIVBpoieSELR2HyE1NSC3YkoHFSHhNFaMiitb0FdtKE0oo2X0pBHLuyuvkRSSYKLRtpNw5sChVZZbUenaM78AE6SUeVnKSKiOZ2GNJjwELZ6CiUlE3H0tneYg0XM0Jf6yV1qxff4jaOaK0L576OPONowBWvEbI9HGvCcntZdT6aewxataOlWDQ5rSt4l3vDxPoyxswHJ9mx3wuUQXB9v9910Hac2aqlK45-9h64vcCjQAZPncO6BaLkd_FwSEyFZJpTgE5D9wuZOk7pRNMYbw8Qc19HArU87kakVHgSCCIMklrYB-6Rygzxlk-0cyzSZDuMHkBYe3RxIrcZVl5uMWS1F_oETMVGUJS8VaOs6xrZ93xNrmkQo4UkIREl6s7-0K7VIRmFsP3asqY954VAd7mTht4BCapZeUB2xDqrcAR4vCEj3oIDHDL9VGtVkzw',
            // This is a TRIAL token. It will be expired at 31/12/2022.
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
            'apiKey' => 'pki-suite-samples-01|e04723e212141947ac681300171ef9515cc18ef696968bbf3a6d8d6ca97136c0',
            // This is a TRIAL API KEY. It will be expired at 31/12/2022.
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
            'apiKey' => 'pki-suite-samples-01|ee9a3416cc231a4ab177ccdee926d03f658a83d3673398514e99e21f590e8744',
            // This is a TRIAL API key to use Amplia. It will expire at 31/12/2022.
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