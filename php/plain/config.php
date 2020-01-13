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
            'accessToken' => 'VZ2kllu4IQR7lFoMkRO0CCP9HYVJBc4fpmwA8qianigyzzMlEPrlLGYMGKXjv8PY-i0OVc6UHJxNr9GxxbFL6CdbE8bvhn7Z10XIvjL3YnE2_WzTWw4mqKH_dv1BaKwJ9uL6cj8WncXsavX4P9sAG3zxVv-iEAdKJjODRuuMKqLAeTJsQrxgbswSHMpMereQ1IjvyiSJvit09NCsgDoD-IcNqGWhwtHRnj2iri3122rLzUA_zZEW5RzNmDLWGSszf3WJvfNkqtpQ-GsUxtzmrhwu__qr9_8kBlg4GaeVidNsJ3kC5yAEyzpsWrMHi3FPNRqlkt6EWgXmaMju7ex8Fn2On_tWi4hqIcetzfQxR4Uc3XVf2JmEMa7DnCkjwDXXrWR4GP3ivkQDZlDprtZnl3vNTQmtAHqPkz2kB6jLxmDECAlV661dOLp72cLbC49S15k2gRFEfYDa6_T0hR0N0IoBDR2j-3_MeTbr2ToozNe7f_7ipUsfq3zNXJ8Z0hqvI1ZhAg',
            // This is a TRIAL token. It will be expired at 29/02/2020.
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
            'apiKey' => 'pki-suite-samples-01|79b816758281324d86b9b616e9eaaa1d4accf9e2ca851d24ac67f24278773b79',
            // This is a TRIAL API key to use Amplia. It will expire at 29/02/2020.
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