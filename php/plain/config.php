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
            'accessToken' => 'mzKQaEvvA1ZLlFaUmXdqCIaitItEw2C9aJyHeqMvBxlqIvLiVRkDQGAtNGIWgURh9HXGq9psFI5tVJInA06JVa1IKDsbuOjAbTI2ndklHXpX-8O_QE6sx0ojpFFOveMkALgqR8yc0VRV6qH_chZ9STar1wRxUOae7vWkCLGpIwT25TzcpEMxAfx3E2VnqTh2h0Xmqjqc5xMyES7Cljtp3GnfEhsLzT0Ru1-IpO2uwTxm9oowb3dr7yJQ9TAkMafCdFe39JDKkWi99uJ-Lt9Ve3RZi33BIgoEHHgUvHzr_R9Ig_aT-DzP8TMXNyuLSp9m2dzcI9Wh8g0zUE8F1hzjBLo7hJi3UL3Jc24hmk7cOCvBPEoxvDoUePPU8MbkPHP4F0ZCwBqnSck-XTSk2yjfoPa-Gd9wKouTI6aQxnkiGRO6zeoefpRVXl9ihkbd_awBRaym2RwAp6al-G1ULXAWADXXtDLukjXOCKwmxxik-wsLPV2b0xxOQRhDa1S9iK7otqeqfg',
            // This is a TRIAL token. It will be expired at 31/08/2022.
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
            'apiKey' => 'pki-suite-samples-01|195f854bb922444f89402bf80145d0ceb07a6d8b2e2e144b68a94fe03634cdec',
            // This is a TRIAL API KEY. It will be expired at 31/08/2022.
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
            'apiKey' => 'pki-suite-samples-01|8b669b58865aa34c8c264f1a83bff843cf4cf772a0c3beaca09838770b9b5625',
            // This is a TRIAL API key to use Amplia. It will expire at 31/08/2022.
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