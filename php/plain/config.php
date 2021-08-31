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
            'accessToken' => '270JN8vXFPZEaUO5ndH7XZZB5M4ebLjdffXJEJyNGOqb38tH0WC8i2F_3obpnRPrO2qaLXi8GjKHNYHlinAyqL-m-HbutQWSksW-0_bHh5c_tX5TW_WLqxRFXmHkHTYG7alTgTB2eo_VGJrbAWgzXRYDvjyTrwX7YRrK8F-l7ZG6NupNJAwd81xjBEdGTa0CbJT3cUF7K9qm38beLVrLN9Ve5jwEaJiSTOX7BA5_aOGzN0u75YIVukmMrrHqDGUbe1QbJE92InOrbChYygGrxp_zG7JOVSHGnChmsK85DyBbnIuJ_HwrRj4tAKG5gFgYk_dsuB3CPn5In8cNugnzP_QpvMAOJLjWGNanlsanz2ZnU1IV2YJdoWRMKMyRifmlQd7-6xtHeP5rS88ZsPB49QO1rsNWs-VK5rk2egntrwnKlgdDRINuRVjldPQKfMfbFZc40J1IgSusX3lQTJxcoZeqiV62uNjkbQnFUUbyFQsV5wWCWFz68NXHn38rRISquswkCA',
            // This is a TRIAL token. It will be expired at 30/09/2021.
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
            'apiKey' => 'pki-suite-samples-02|0872099d52d0934da30313d49076ff488988870c1a58ffa1bd3b9cbc67904e3a',
            // This is a TRIAL API KEY. It will be expired at 30/09/2021.
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
            'apiKey' => 'pki-suite-samples-02|e94d954b2d619449addbc7c9607c6605cb2924ab2efc758915e241baabb828ae',
            // This is a TRIAL API key to use Amplia. It will expire at 30/09/2021.
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