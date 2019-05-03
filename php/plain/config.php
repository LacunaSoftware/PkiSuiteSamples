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
            'accessToken' => 'XqPlETa0uX6za3eFS8NqPjo0g1BGdlObRggziOD4Y_9RJtiYI14J3_G1Rl9TY1gLiO_afCXl6Gh7q399gNrRjlpTlJlMyw1QYXnvf1moxcUpEIjsMFwxcYgvPBA0XEqKhtKiLLfZrfa2Oi1iVntxnCtX1iOUKfo10kxPrEmN3CYaYcksVdSXfZVAKGmybS3dVbOky3JX__sL8K7cbdawlMGGf8D8XVc-Y21DNUQe6wXgb8CL9bWZRlgMvWmxuagJhQbkjhgG78OmnLTDmH5TDv8Baq4BckXkk6lw6T4mnpcbuYvN0CZqNfWVenQiAIQZG486XLMlYKXrcjLAGPj4bCGEKI3_NCJtl80ZYeeSydGcMTFA2GYndzE8sHlUQtWYKS-b_ibN9NSdnweS63_QJ_Fvn7mdM-DRpfln7nSo8_JFv-gbmsTYSlA9uSdDP5wtmU2qMfqu9A6kF7XKwPyMBpYOydc5Cm-kbkbFzt5nINWsfHlUw3N1FEHv_uoedOoU0-t6_w',
            // This is a TRIAL token. It will be expired at 30/06/2019.
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
            'apiKey' => 'pki-suite-samples-01|14f84a1c36b0f746a50bbbd9b1c28b95235bd3673b9cc6912c48d39ddece5706',
            // This is a TRIAL API key to use Amplia. It will expire at 30/06/2019.
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