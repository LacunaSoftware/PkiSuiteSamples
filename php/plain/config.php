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
            'accessToken' => 'QPK_s7eVFFitenHh-6c5PBEk1nlssA5OQkbpyZWBnGEvG7cK3lTs4Toxs2STulwrRPORtJbT8m9V_hR_FTZTPUnzqgcWC4xmd7QYPJZIXBIw2HgsjTc6GAEL6N1TXSBLBNDz_FkwwnlKCk53YPBa4AAnWZBMfe5riah1F_BpinrxKGX1ewohIgxTHxzAeRtQcwRB8XW6yk9TR6GL7mK5ky0o2u00VnSgzrOLd8F0cuV44257dZlumMNTBkq2fBeAUWTGNo3Ydwgn5k5BYM2hfCdWDssiRv-GLyqxjo7t4brq2hUK6QBXisMXfZ4dSd_rRQvpVpa1cdS4KansOxanQX9M2fNU8Gmf6I22SwZ0c5wM9qlkv5Q-LZOYtakrkdqxY-lCUDog9goPCBQenSt128thFko3uFKdAyiZCiL5fTi9I-ZBGNbNB7rf6nACvlWAH_jkGpfSFnrarSbtzniVXI7wSf8ge4iCeP92HT9CNSbRkGnBYRl-ryr39nqz7--vYpJ6kw',
            // This is a TRIAL token. It will be expired at 01/04/2019.
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