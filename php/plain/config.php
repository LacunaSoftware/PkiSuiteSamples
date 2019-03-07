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