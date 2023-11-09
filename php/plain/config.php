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
            'accessToken' => 'smgv1rEQCMlV6Ry9OpScHVp1YKVzRUxWYshBOxrPPK-8uwJEqyjawjMv5IGfAPWYE5899J7_hH7HKX7EKJKmJFAebo7v0Z3X1f7l_8I0oZJQTBBD_XCTTDPMv4jlrTehXXC5yTs7a7j3RM04iZicEHmicvzz6iEkMIT4tfWn2i_xnasm83v8p2w3VYACk7EIo7lAA2v8_iLQ2HWfV3yw_H5_NDET3_0YAExDxNRN0fanj2I3-YS6EJrZOKxJRF_UTE5io54qVarbgb22UVpF_ZC0aiqvdHIc4sl1glDaWZibNNTOmE8D-h1mY0yqdVKoKzFULXspjZTUkiZim_Lhq6PlnKPgErtdpB3fCy72vY9hoowxokQGEiab_UP1X5ViMUu3CejRMQHeb4x4e3vC14xF8k5VAv-H8FYRz6zSHkWZeTfLuoQfrH1qkDEO6dIl3vL5Ze0pIMgI8BVaiY1uhAGExP5XFvJZ-3_pkaaCEZbLlGXGpJTQokl1TD_DlyOzSlha8A',
            // This is a TRIAL token. It will be expired at 30/11/2023.
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
            'apiKey' => 'pki-suite-samples-01|0182307d118c2148a30d93dfa43193cc652a7d5951f42ff2640e22e52090dfd2',
            // This is a TRIAL API KEY. It will be expired at 30/11/2023.
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
            'apiKey' => 'pki-suite-samples-01|62d077b7ea184c48af425b4a9484f7b8c2046ed7a47f802df01ae7dea7d157be',
            // This is a TRIAL API key to use Amplia. It will expire at 30/11/2023.
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
