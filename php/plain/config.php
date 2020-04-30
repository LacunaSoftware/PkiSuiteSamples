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
            'accessToken' => '0r1aAYYJhLaSJ93fphOrvFMKHNR_ivw9tIujNrl6_KEgSUHBrnTAey1sIHMWBjVBsGnoY7GHOOQwDxI98sTmEcD0qCquk5Ci7xf-GmI0XUzUQM3jDcqzn5pvdDjhQ4IlOh1xOf8K4G2vRbU3AVNQSu60Fmv4Zy63lkY-UMZ_zlB0bKJVD4sELSugHZhNnAEyTcVwqPKCbqv3gc-YukPcWv9Sp65woPXT1sg-8tzXIhi8kqofr22UWfzMtPMXooCWRI2QYGuta-psXlDzxpZNS6jRQ0T_qSk5NG2JlB9MIfBLm7Qn6yUasYizryxEg_km9FF6CZjwKZiczKts_taGl5Z14J--bGKVybvY7OxZqNDbAd1VTyKUZBULOonHuVmECBm2YJla6ek8IC2pTSqTEKpuEcXLVNjoGEV0de_4zo3LM46CozYSDBxvym0bPCdKV3sr_GU-tB1PDa6GOlcTP6IpiBchOiWsqnlM2Kvnj-Cgzm2Larkn8eWbahGZUdCCTiXFXg',
            // This is a TRIAL token. It will be expired at 31/05/2020.
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
            'apiKey' => 'pki-suite-samples-02|0d05bec47215464883fa4a5550298b6d81146afcd7cc3963c66fdd946fbff4b5',
            // This is a TRIAL API key to use Amplia. It will expire at 31/05/2020.
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