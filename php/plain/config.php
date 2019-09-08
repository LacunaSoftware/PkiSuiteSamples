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
            'accessToken' => 'EgHO0LNnl8P8eYlE3gaXX32iiX7WxQ-rcuVv2piMtnwYLXvn6ENIYJzSpJ9k1J1y5nmaAhgPaaax3M1KYk1jCBHaqN8Lv7ip6jnvbTucDRZ-U-a99x-L1SBqVheeT_jTWvIWhGI5RPTXRa2NMxlCM7StaWOvYHWIykSJaM9dM8lgB1rzW_XR-NbPxKSIyk3Wp1k0Piw8KGEz2XrkKEfjElzSNmuTFd-FU4ltZUFtn8LL6tKaGE0iyC14PNk5maSmRKFWrN_LpFvzF7yoZLad5Z640diJHTpkYZ--O10CFScI1LvpMUXhAj60eeTnniq24vwkOwlD79DBwNrhWxKuQHWPpRq-ooxT0fO4iS3UySzh1EaNm8zjdDwvmL985fbFjuDDCLEHhenF_2g_YEB5CCJLq3_dSOsq1SwsoezqRidGGkG3mMpcCkAYibGvtUeRLt6RiEyUPSP80GgO5-Y2Rs-oE-GFirvrZ40LSjNAbvSJO0JZ5wudH586B1ZDtfHqPiWgBcWgATG3jKjWCieM_tk5VHY',
            // This is a TRIAL token. It will be expired at 31/10/2019.
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
            'apiKey' => 'pki-suite-samples-01|36c2e631cec1744591446b67f2f40526973591b39e43008ec392e41fc9a27445',
            // This is a TRIAL API key to use Amplia. It will expire at 31/10/2019.
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