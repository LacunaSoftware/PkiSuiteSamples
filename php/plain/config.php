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
            'accessToken' => 'wAYhZlI6FC52gTNLTbgb2XK8Ff9UohswNXvg_m7xXsm0zqL3gznc1YDARA5SJK9T3EJ0cRW-JOF2_fkj-tUdN684kHhDqLrdzkpq0KFnWC5UUnYZ3m2mrHw2ubRRKr8vyLpWzZNJlq-ljJzIBYH2B6msPS8pO0vXz8J_ee_tu2z6-oYm6ZapKgW8QgkhPDXnTEoWOp7pc6BQls_bUorELaexWJ2rLWVbC4zJ4RNsLjvXR4A9bafESgKBflV2ffrxjjj5PPdOnL3g7ASeGnyGE2Ne1H0ynKrrgZg8W7FHdmMw3nWli4ineGE86RYVMOYA-4zzmDCZ9PV0GJbpao_0SuYycYt21xVV3HPkQU8ToagZ2x98hVZCitbskorky4pR02xWO4NWHtNt3k7dYXcwg6tIgDM1LHFiuo0ucc3Xt3UQxOEsoFTz-8v6PcYZeXKjlQ25lqfuZsACHUVrlvClc_uxhmaLCWVkuYm7pOK0JW_hmjaipXYwO_NX525oi8Rb4MYYow',
            // This is a TRIAL token. It will be expired at 31/03/2023.
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
            'apiKey' => 'pki-suite-samples-01|d3a13daebae3a5408a2144b416469bd9e2db3650331bd8d44cd37e2ca4bb51b9',
            // This is a TRIAL API KEY. It will be expired at 31/03/2023.
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
            'apiKey' => 'pki-suite-samples-01|9b1ec4792dca2e4eb466e0af196da31e1367def9b882edb0e10f5ac1b434cc12',
            // This is a TRIAL API key to use Amplia. It will expire at 31/03/2023.
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
        // CloudHub
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
