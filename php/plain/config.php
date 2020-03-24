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
            'accessToken' => 'Ox-B93JLP0lC1oMIf4r1suSzFARy2iZzAg3jJAJ-uH_UsdFv97B4K4rrpOAGRPZgu64JCchz6e6lYAq4WgUlZF1QDspoQJn3iWfltSZ5_xB3GYgvZT_0CZ87ieKA6uwzBWePwCimRma__FDH3b6IZujmkppqrBBJmyOT5HBwTKo69zRfgiF-4mosXA49LaQM-OUir_RzbocM1Ujtasee4raMgNlvj79VR_suEWJ8JdI_Jz5bq0Obh4LaOuS41HtD6pbrH8oocYIyPjl_MUazuf2pcwxIV-ArSWWgq0JKnYHqXOXcTCD0Kg-xQuNdB3-LJyYq8W-gFbEmprTCcaYN-diITgjP1UT7EhxnPbBVaBj5L6iwgmyQHh23qqbkRD3-iwB-tvnSOMUkp-peTmfHn2BTh9OUn_fzvSi0xZev0MjLK_bwBa-CXoyjVf7mqdbYfYZrsHK3hvkk-h9cX0xl8mmkq1ecqKGMqFrbxQa0YJQsHXRWwquoP0eKbNYXWnIoEXfcBA',
            // This is a TRIAL token. It will be expired at 30/04/2020.
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
            'apiKey' => 'pki-suite-samples-01|7b8ce23fa7a74a42a8dd478ac5da0dd265a9cf3e991122b74dbab89ab5e815fb',
            // This is a TRIAL API key to use Amplia. It will expire at 30/04/2020.
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