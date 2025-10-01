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
            'accessToken' => 'Rzgbz-hkIvraE1YwJVrAkFn7og7e_dKTfQSnr5mX3UpNrQGY1vC45wmh1onCmRsTtOaQ8hVeF3nV90u_Ona3N1hiCHmwkm96L4NTwG1vvOP2nBkDnGu2DASlkgNbt_bXZs-8v-QV8r5t5SFfEDrX5ergRnJODxEqvVQl5a4P9E8Fz1xUE76-b0grm9SPhceeqEx85GVDjXkyQo0tOml577yMGVE8yjMMtTapjGxzOMZXk0IsQSjO7n6OHG9qWKcqHhzWHk23t_ujuxLKkL-ujXoDWEv9CvMeX68ic1l2DCttUeReQQFWmXrp6vDb1OJB7DpQWkXX2U9FJWHrMZPelVZR6XyHrz-R2b_dz_vPcNd6d-JCPV6VEHEPOf8vcXRwZ0lrUSsGDw25cOYvG_cMUuCXc8eTTB_oHb_03Wh-ZAH_pe5iLB_g7cDu_R8C9OrGtRUU7LvAJc7NiaVV8MHd4sJtjbUPJNgt6q5bRYGzoWlu7u8FZE4ME4KK8TwWRnPvmVgcrw',
            // This is a TRIAL token. It will be expired at 30/11/2025.
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
            'apiKey' => 'pkisuitesamples02|659ebe80a3b84d4cad8bd34d5a9639bf1a2cd597fe72edb35538c6c30d1d2282',
            // This is a TRIAL API KEY. It will be expired at 30/11/2025.
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
            'apiKey' => 'pki-suite-samples-02|e4c55811357f514eb7cc8f9162d485a6aee6310db6de744fdbfc2ae195976d2a',
            // This is a TRIAL API key to use Amplia. It will expire at 30/11/2025.
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