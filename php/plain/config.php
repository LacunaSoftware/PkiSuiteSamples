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
            'accessToken' => 'VF0jCF4QWfjvUQ1cUBmeePrSNALinTQ1BgfGh0IMSFh3lBiiCpiQPba8NptdB_DwMKRItmccgQITMonKtX1U-kmrUYqsPegmKh7xzQUkBgiT9-ZzqcsH7sCk1mydDOKlG42QnQXMyTQWiexPeNhe8ZybGIcQGIblU72vGc8T5nRylMk4s3-jeXyYqiP8xLYKBlO50U7PByKk66OsjaVpF4dmUWXd96pVrNZ9J2KbWaNQEDh9rtUghIr88vwnE30kV5TL2hJz_LDI-smnSWYinJNPGpyWSrrLHI5uA6GplJbJNFvIn1bIYO2xjHkoESoaaaf3vu9Dh2ZNpofLN9YdCAqcFwYREnmJYCUjZZ9yQn2ba8w4xbIyDMg7q6hn_DPJUvB-H4NsVH3rMwaOzA0bXRTxcVi9SmWbJ8TmtPpmSMww21db9G6qW62yaa9j1VgHa2XjgvQSyISVPQIqUGaJKBsg82wpjf2lfTxpujruVvKE_u1_51RQP0M_2YmM40udL3zuBg',
            // This is a TRIAL token. It will be expired at 31/03/2020.
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
            'apiKey' => 'pki-suite-samples-02|db35305bf2aae24cb41adc5362fc063619556e7169bcf5698e4c238aa576c3e5',
            // This is a TRIAL API key to use Amplia. It will expire at 31/03/2020.
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