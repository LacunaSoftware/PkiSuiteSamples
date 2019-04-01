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
            'accessToken' => 'zF1ozzyD_Vw67x3kKrdgbN9OjqgEvDrApbJogKtjfNxqvnQpS6jRfUPONGFhIZMDnLrR_Hp_vRWIk6LrzwrxLkOmGOFUyhTh2SC0FFCQuCE-Jv2KjL556IMOPxkQwncCxcFkQHdxVDpslFIezY29CGp0rWLCLXuPJp9EVkUlR48BofZE7J0XFvMx-TkZtg1bCsQWKdLtyMgQJxsLz1OQJ-XbPnWN-lEpp2tfJmSRQXLvIYnSAe5oSr-s89C6T_CmIYpZBRJsAjHYgky7Vk5lSDPZHs99F7NAoBZ8TdDUs7DenfTJ23ONmSqyHHPEKoXgqAb5-rQZ3S0YDDzAqPFwAJ84bXaHNMueDjvIWwgcIjfHvzEVf0RpvRvNirnUsDaMsy2ipgO_uT1npKnAuVAPV0tJM6Ci8jTmIVk4BBb_Ju6dxKJdpEyyCzDNFfokks2txcMSkpOAxQmlTJsqyIY8K8JRWULjujW4rjGNpFcr_QuY_919WKm-ouTzLoS8eUctnFIUcg',
            // This is a TRIAL token. It will be expired at 30/04/2019.
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
            'apiKey' => 'pki-suite-samples-01|bf04175eb7d3124d897753d94cf2d922b3aa8d444aad2d2d238e5ddea49654c2',
            // This is a TRIAL API key to use Amplia. It will expire at 30/04/2019.
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

            // TODO: Write description.
            "trustedRoots" => [],

            // TODO: Write description.
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