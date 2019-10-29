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
            'accessToken' => 'ohbl1j0m4T_BVuDa0eBD_AOjeoAbULGD77JE3c4TBDQGrh01eckKCDGZP4amcQA3cqw3fpoQnTzgTavqy8IGzbGf1aYxGx64H-YteC1JEf0vGL_7Jf8QCxEZ2bcbKuwUTGqiBwhRI1IMRfvj90BpA7AM-USu2qRqGdUSFmtUU7oTwfNJGrj7TnFPh3x83HzcOqvPOyb23piy3nzpW9zOFfMW32USuGT32vu3XJi8JIbxEAVSsKPy7izWWx0WTr28-O4yX8OH5vSDUJzMFtNUw1WYJLB-_P-eePkBDrih_LkL28oJFVdIB7ewXPYg9X6QY7uQPCOCho6TyerUwPnkJE3eo0_vLkli145rd7q0P1YYBjil9i5y5zS-LEOgovcR4gOdl8eW1Hpw0Def5DuIErQSOowih6HA2L99VYgMXCyCKajmK2Q_Z0qJdRsetMIC8hu4ghb0XSdOcEv4d1a6N1xr82gpdyohQtPGF4XieDao9Zk7TM2iFqkzdb20L-64EvURJQ',
            // This is a TRIAL token. It will be expired at 30/11/2019.
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
            'apiKey' => 'pki-suite-samples-02|3db2755e371a6041a56d9ed559c27e89327e4bafc1430454bfd3e2c617d0cb47',
            // This is a TRIAL API key to use Amplia. It will expire at 30/11/2019.
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