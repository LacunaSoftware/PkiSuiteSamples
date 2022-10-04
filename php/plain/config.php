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
            'accessToken' => 'td4I_xrj-y9cRooCHPSmXLRs2KhaRZyH-LsMRbIS9H_w4YaMcXiOKrp1pEAip9m91bT1vEXQMoY4EZRFMOwr-R_cHnjDVcfgU7TMpOCF9do9XwH1NEwq3CDyFgBHS1gb_0ZC6vQNZKq8Ox6UicxaO5cQ-v2b1PRTDjHag0D1of8uXO-3ePcnE_UA1GvjCadh_9VQxDCRlhFW0OtRlqvvmCQLZAyXz9i-Rl1bJyqeGKxfrfJZz8dEBnEfkFB8IxGFBKpeBQ2L_qgWrwH0AWvFKRfoyEeARLxhdnlLzdHj3U224zhnkndZNWrpeeEb7hYG5yuWnWxo72IeloD-xtw-V7cxF6rgV2UrB-Ro1kOFKftPOxEjwnXCtUrFEGPaM4tz6lXXht1z4i4eXaX0ioG8ThEDPHx9hZk_i7gldflS1BURCG8uI2sSJjAufrhYgD8qqcMd7kqZMIIISuDR5bQaN_QJDkRmKoDQQqAWBX_-IdQGzOCX_lgoVhCY8rGTNJkv72g1mg',
            // This is a TRIAL token. It will be expired at 30/09/2022.
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
            'apiKey' => 'pki-suite-samples-01|f2258f370e0ec84eb7bde0ddcdc7e7ecb600101787590145b98a7b475fccedc5',
            // This is a TRIAL API KEY. It will be expired at 30/09/2022.
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
            'apiKey' => 'pki-suite-samples-01|6d9406f1b6881b49a5411aeefc8510edb8c319d70b2d90ce7f191978ea787d85',
            // This is a TRIAL API key to use Amplia. It will expire at 30/09/2022.
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