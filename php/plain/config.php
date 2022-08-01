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
            'accessToken' => '6vQ7ZL8UCH1aDBrpuUXc3bdKJJo7ijMWbh90y-5R8h9G5Xc9Ut2-Ma8g7RFq6i87XeP2koaeisd85o5WZGUf4YmYVinAtQLKZXMfVQOVGayVu5EXfKHuR-b1Stp32bFaYa8uGcopuDy5eYFu56ESm5-j-32uS62CUHtKGn7Yn8hWzZrVDJHFD0I8FSbyVo7JqbPCeXvwTrigJiQJQ76MWe-EcQCZcBeZshIGWygDEve91AogfY5NLJ6s627xJJbCl0U0cd2oLJGfZAsF-FXHN8Wkw7rFiZKEmOcaqlu8b_85hTvv4N-eewhnGRNdM8mMdRC_-KIEh1QBWiJawiTgCKhJIfz_PW7ugieOicmmtyFZMMztiUj6cXHBHR7_l7CxCGo4pclUubkPDoqZuHZk8LIcUJcfrUd15c8s9FYXrD_x_MsdmUS2nG637y8L_gSUgg-aZKr0go6zyuR0TQEuea-FiHatFkzT3pJDfPHpiYqQZn2RHxlDmEiDZjbBkdtUpYIKCQ',
            // This is a TRIAL token. It will be expired at 30/09/2022.
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
            'apiKey' => 'pki-suite-samples-02|f1d3543ef18f4f4cb2d6d056b6ca92827696ac7d097a8c8e8ceaf5b3b7009395',
            // This is a TRIAL API KEY. It will be expired at 30/09/2022.
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
            'apiKey' => 'pki-suite-samples-02|fc4906d4065c1a48890e85047ae5525a1ef0bc2f3871e3c5fdd092795557405a',
            // This is a TRIAL API key to use Amplia. It will expire at 30/09/2022.
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