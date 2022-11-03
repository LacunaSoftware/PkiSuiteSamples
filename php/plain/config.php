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
            'accessToken' => 'nkq2uxw-tIc2DloGf1MKh48zBTGl1iMTW5gGEIs07_uBYTepc_04O18IGf86mUItvDCBbzHws3j36S9MlQ6ZzOjN2izGk_aYPJmJheFO8YyFeyZtPp37A40ubehy_M4p3SV4h8T5kWM-FFy_GSoHVwB2Pv-OgLWIle-X1wZljeXVHIu2ugmhMmI-Sl4GJ1WfM4wM3xE58RWWwwGRJyp1hqoor6CajOmuSX_gwDXz7E-eKi-MDghaauWbNQMfNOwHHNGWYKpFw46_ZqS4lYoLFsdEjuEQfM4bB_CbqE7BgF85N-C4GrWELHrx5_shH7mDuq7vIsCg7DrqgX2QyukeI-uJzjD2Qz6JHs-HVY5fwvnQwqvmgcqnd9Wl82KnqHxUSVYBVkLJ8oP5u1USlGtegrQpRo8vVadcvwpuqZM0VDws3ZmJtf64adTqg187Xcqtcg2wzGm27xsql0D-cbwVqJtoun6b-fe_Ppna6ohx7HRNZoFITZO5j6or67_CSqzGG_QLYw',
            // This is a TRIAL token. It will be expired at 31/12/2022.
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
            'apiKey' => 'pki-suite-samples-01|e04723e212141947ac681300171ef9515cc18ef696968bbf3a6d8d6ca97136c0',
            // This is a TRIAL API KEY. It will be expired at 31/12/2022.
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
            'apiKey' => 'pki-suite-samples-01|ee9a3416cc231a4ab177ccdee926d03f658a83d3673398514e99e21f590e8744',
            // This is a TRIAL API key to use Amplia. It will expire at 31/12/2022.
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