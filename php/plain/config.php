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
            'accessToken' => 'Gz9nKOpmwWzA3nMQX8d4CuXOfPirK9gPkdXCSR6kvXqDCfNERH0rsy8kzahiSJWFSC1W4ntWYy6FcXh7hpp2pWO9NN60-CcRHvaCjlEIQpt13WAbrMYvGCDgJLmzK2PB5m41BCaOob2oTc-rz3awRcxiDFWApwjq91_RTqROnRYY2GTSoZcCr4Lu2X5Jvn8AkEszuOx-XPOTlFfDOXYQPOc9uacv1y7EDAzjZryUgTMbGORY2mH-JAw9wE-MHnDxfzR9X4l9KT4Kgedl9fiFj5EE30VtCBcU0ThF4xYhsazRv190rw9hyX9r9fQWzi97BIsRetXS9vZhYyc8w8kC7Q_LXuh4IvGSVL-eLZ8hUmITDyWxHyy3uEeFu6TxAg9FNcdrnmNSwGbO6uyd2iv36AbBxG2AEQviucMtX9uJPtebSx_jM33D6kEDPI_GWjsKVJBV9VkXejQs_F4bMXZ0b-JDTCPkB8KO7A8z5Fc424qENC2OcKVIk3R9HNETryDBnMFU3w',
            // This is a TRIAL token. It will be expired at 30/11/2024.
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
            'apiKey' => 'pki-suite-samples-02|6c4b4cab17e7df41826e281f9f217695eb5de3177172f528deab0ce0e9c7d818',
            // This is a TRIAL API KEY. It will be expired at 30/11/2024.
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
            'apiKey' => 'pki-suite-samples-02|75a8451c3f71b34396b10c9b2a7629af219efbeb0fdcac52e1e3b148eb380c20',
            // This is a TRIAL API key to use Amplia. It will expire at 30/11/2024.
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
        // Cloudhub
        // -----------------------------------------------------------------------------------------
        'cloudHub' => [
            // ====================================================
            //     >>>> PASTE YOUR CLOUDHUB API KEY BELOW <<<<
            // ====================================================
            'apiKey' => 'mR1j0v7L12lBHnxpgxVkIdikCN9Gm89rn8I9qet3UHo=',
            // If the CLOUDHUB sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your CLOUDHUB installation (with the trailing '/' character)
            "endpoint" => 'https://cloudhub.lacunasoftware.com/',
        ],

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
