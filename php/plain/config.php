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
            'accessToken' => '26ORhg_2cTmMD4KqE5Z9I39BzqZZ9zzEHMlS-16-U92nL5bG7Bvk-uh8wkQ4vWEO75CUMhyr9O2wegGIIKGVwPJqDnrTEiTmKJYOnmpw8EPJWxr_BNk-fqPzQzmZRANni0iNO0JVN_b1BOQzUkslrCPw1B2HQSgD1XnAueDkhZ-jLbjeY62VzLcysdd1qEA8RljtF8gDsE8tjnIOryVYiRNyrF2svhIBuXdL6HxR0oweNdNhXi4GgJTXBJ2RfgjVNtd5DEDnx1DIUIGVE_fMnedLHDKogHOTcWopmhWMCP5k-VE3KujDgEfa0oD0romyenYgKTRHa-oD3G3PXEcfgkKZZ7Tpf8oLOqgTIP3DAJUZt_rNVHYysO5n2fOyj7KGkPPtmL-jbm7iAcJ7x3J9XWMtm0CFteeWhojfdxbmjanshSHUg1yajxNqHsUi2UBDi0Fau-PLyGEsyMEK9dPFuFM-5r40iK7Wa_cfxwPBDDbWjrX5m59xlwSpPOwi8LBI2U7Tkw',
            // This is a TRIAL token. It will be expired at 31/05/2021.
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
            'apiKey' => 'pki-suite-samples-01|80e4c665466068409a04eee9d0e6abb16a9052e39adef2cd66b89c1a13ccde2b',
            // This is a TRIAL API KEY. It will be expired at 31/05/2021.
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
            'apiKey' => 'pki-suite-samples-01|4976af13a331744898f5d4d1ca1164594e09a6b607d501ad447bd7e6a801c2d7',
            // This is a TRIAL API key to use Amplia. It will expire at 31/05/2021.
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