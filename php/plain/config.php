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
            'accessToken' => 'XQu8knge2MuLcgsPe1rB72xKa6Uwx9jocqLhBcOH3_GjY7qxH3GS4E3v8MSWee3RgtDh0Z_kKxWQvMdIgZ7z3RDL4AoMyZ1wUtWqGKy8R_-Swh5dtwMRSRDbWoyOf1xTuPNQcdT_mI_hu_JTmwhWkZXBMqK000oufe2RG9rpR04LZLPpy2xnjlKlamyg2i2rGCH1dn6nSTNcRwPlhQn5D7-Zs0CCs2gX3ZEIFVtPLH7k0sEdWG_RJTsm7_pb_ySi2B6p0XUmch9_Hny24mN1gZ-xWUVWkekukGjslD1gGAOIEKsiRY985dg_L3yRAkRt9P6sB9qb8oegPRV4L6WOB0vZAQ2PAb5PMdtXlSQEg8nIFmxEvpvxhkgCt8pBQoM2hFeSReu1995joA7qbdaL9R327cuZtyrk4aZQ-KbZBZlejIy7V88v_8i2k1W_eGTG7cS-8VXS4EZH7TQzS79vNhDOwDsSaFSTcEaOFTtLSo_oZV2cJTjuhKsmCNTlQHJT8WcCdA',
            // This is a TRIAL token. It will be expired at 31/01/2025.
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
            'apiKey' => 'pki-suite-samples-02|233bfc2f1499c1429b8f879bda3b869e65496811d92e132d616e805cc97d6417',
            // This is a TRIAL API KEY. It will be expired at 31/01/2025.
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
            'apiKey' => 'pki-suite-samples-02|9701d0d38d94de43958f5d80da94275690e807ab69a0075e7dd03545bd4353c7',
            // This is a TRIAL API key to use Amplia. It will expire at 31/01/2025.
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
