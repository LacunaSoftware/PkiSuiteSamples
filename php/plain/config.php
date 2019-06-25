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
            'accessToken' => 'NVXSO6IOSm3gH63iDTcJ8deTvDKiiZnM0t8CG3HkabskKXX1713SMCxwWUDUScKkKgtpMfdmls6VYflYUKNmjozbnKJcjVS1HH3LsArtgJK7D4wa3BwO_Xm1l7r26UTDJHlG9Js2JYr5M0wbO_lH2FGri-g3-MCj0dPA4Ufo3O1PFJNTRmTL-EtEPdPaFT_zp2jd2ZmsP5ohJmhNZgBM16_UBJ5ASgBk_WREmfRlG33eQZ6vVSSoUgCMZvz8v7LolWyRyQodgKcesuvRRvVgd745drLupS3PCgMsI1u11bPrTQcYXMldb37fRHYMU-na1sIHkbwG6adZ2j7D6cdjO4Tn6hBTlAGRQy6XB7IXPMQy-cyRdxhCZxP7G1h80iPlHO4Io3pJcZ3mWUXuox3LCzWogi9jutyeYPu9TJItabBrQz7z2hHG5WqKqEPhM1b5Z_YvEQ3nAJhWjxH5DTsroVsvl6d2JySfckvkRj8U6deA3M_7xN3NH5O4AYXRS0hsOGgOrw',
            // This is a TRIAL token. It will be expired at 31/07/2019.
            // If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your Rest PKI installation (with the trailing '/' character)
            "endpoint" => null,
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
            'apiKey' => 'pki-suite-samples-02|514760f1485c1b448a5e02c515ad5396b8ad73060aae7dda60b73ae28de001dc',
            // This is a TRIAL API key to use Amplia. It will expire at 31/07/2019.
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