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
            'accessToken' => 'KQR4RVFQVFxrDRQroO1TvZ2NY04RmRCud8OPNxk1OJCVFuyRxM35QlCd82BV7JlWHZvokJ0iAhkbV3HqiYAH5X6Zsf7R9DqhGngQ2vUrQVH4zTNzqCbj65nx5O_mp9PNebnwpPGT7rdLIT9Jvn2qCIUfh4JCHIJZC6bBLM-Rz6PJsRHT9Kl5V_tuyOp99XSwJWg1waoZVJ1wGSIl2-XCikVLv7K3UhaPkth-leWWHXxFXbLTIcwc5KFhPpja9EwI6i078LKcsS7CoiUSWFLnePBpCdwuMFJDtKDMEYoNeIwr2mR46PPM-mYfy1halWBYlx6dga6ChSvTJ6YT7-6rRSZRL4e68uN27kPPGDJ_-1Su4xZjlT9nQUxI_4ih97_IzozLDKPHSYaq3x_yWWgIzUcoLOZ93RVqOvh_0DWc9MsagC-P_hwqr-jZLK6ircs-WQXq7SZMaY3dEYm4AsdYiR8h2Bwa0QmoX30cwfZTrXVYNzxFZrubg7ibAgKqaUo4FzkJww',
            // This is a TRIAL token. It will be expired at 30/04/2022.
            // If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your Rest PKI installation (with the trailing '/' character)
            "endpoint" => 'https://pki.rest/',
        ],

        // -----------------------------------------------------------------------------------------
        // REST PKI NG
        // -----------------------------------------------------------------------------------------
        'restPkiNg' => [

            // ====================================================
            //     >>>> PASTE YOUR REST PKI CORE API KEY BELOW <<<<
            // ====================================================
            'apiKey' => 'pki-suite-samples-01|ec862bd72bcd92448b1cdca77dd1274dae999e3dfd9100b63eb8a9a16d16af25',
            // This is a TRIAL API KEY. It will be expired at 30/04/2022.
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
            'apiKey' => 'pki-suite-samples-01|ea06fd79c7f9fe43b0eac8cbcdc979a3a77e3c0743f70cdebb39081f39342c37',
            // This is a TRIAL API key to use Amplia. It will expire at 30/04/2022.
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