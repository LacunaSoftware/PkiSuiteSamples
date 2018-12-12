<?php

function getConfig()
{
    return array(

        // =========================================================================================
        // Application Settings
        // =========================================================================================

        /**
         * Lacuna Text PKI (for development purposes only!)
         *
         * This security context trusts ICP-Brasil certificates as well as certificates on
         * Lacuna Software's test PKI. Use it to accept the test certificates provided by
         * Lacuna Software, uncomment the following
         * line.
         *
         * THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!
         * For more information, see https://github.com/LacunaSoftware/RestPkiSamples/blob/master/TestCertificates.md
         *
         * If you want that this application trusts on Lacuna Test Root (default: false), set the
         * field below to true.
         */
        "trustLacunaTestRoot" => false,
        // In production, accept only certificates from ICP-Brasil.

        // -----------------------------------------------------------------------------------------
        // REST PKI
        // -----------------------------------------------------------------------------------------
        'restPki' => [

            // ====================================================
            //     >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
            // ====================================================
            'accessToken' => 'YOUR ACCESS TOKEN HERE',
            //                ^^^^^^^^^^^^^^^^^^^^^^

            // Address of your Rest PKI installation (with the trailing '/' character)
            "endpoint" => 'https://pki.rest/',
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