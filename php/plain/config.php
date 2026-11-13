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
            'accessToken' => 'jVKhLLbskhYRYo4G-Wufun4yhmCj_gzW2WfbDWBZ8MVBdiI4uIdXQ3n5BVF__M24Y2DbMuWbUdXLD9i7nb37v0Lwz3LRbkCJqAiUlxvm2FO4Rp2VdbGg4_K64LXdQoYl-GbKjr2ZQK898WdaXl2Z7-_sGV8aOrdHmyaDiceacHXbxOEY6BAj2WmQw2y73WDG2H1s-wuOoRHFyMMhii_99DKqq_fsEDPTRZlH_xh5j0YnbLwTXkHxzQS2fe3mji7T5IA3RvStUkQpS2BGUZpv-tIE2Blo-mCs4u4_QwrytP58Ik3F1Ckp4xk8zcFkiHtrgk9WmqmK0j8jXumD81GszY8S9ZNNJqF1DfhEL0qqTuCiZ-UrCMtf43VWKXRWlQ32j1kcO91pJ73BX47DY4AGu7fXY-Kw_urgnvF4eAPB0dkZg_trC1KooVo6oG7VdSseZwWsYenxHG7HELIBAO-SOBvZ2iCCxy84e1yyNOFhRU2F1JMI6UY_qkxd7X7hxrRlcETo6A',
            // This is a TRIAL token. It will be expired at 31/12/2026.
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
            'apiKey' => 'pkisuitesamples01|aefd6b6a4aafd744bbf3818effca3a7c4a326bc5641bb450df7a4797ab967a77',
            // This is a TRIAL API KEY. It will be expired at 31/12/2026.
            // If the REST PKI NG sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your Rest PKI NG installation (with the trailing '/' character)
            "endpoint" => 'https://core.pki.rest/',
        ],

        // -----------------------------------------------------------------------------------------
        // Amplia
        // -----------------------------------------------------------------------------------------
        'amplia' => [

            // The CA's id that will be used to issue a certificate using Amplia. We have configured
            // it with the sample CA from the sample subscription for these samples.
            'caId' => 'eaffa754-1fb5-474a-b9ef-efe43101e89f',

            // The CA's id that will be used to issue an attribute certificate using Amplia. Attribute
            // certificates require a CA configured to issue this kind of certificate, which is
            // different from the CA used above for regular (public key) certificates.
            'attributeCaId' => 'c5882160-08d0-4c66-be63-019f13c60683',

            // ======================================================
            //       >>>> PASTE YOUR AMPLIA API KEY BELOW <<<<
            // ======================================================
            'apiKey' => 'pkisuitesamples01|df8c6d65a6f3944eacb9acf56ae9ddb1dbfa4cf528c69280260a71bb941959c2',
            // This is a TRIAL API key to use Amplia. It will expire at 31/12/2026.
            // If the Amplia's samples do not work please contact our support by email:
            // suporte@lacunasoftware.com

            // In order to use this sample on an "on premises" installation of Amplia, fill the
            // field below with the URL address of your Amplia installation (with the trailing '/'
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

            // Offline mode. Set this if you want PKI Express to run in offline mode. This mode
            // is useful when there is no network available.
            "offline" => false,

            # Default password to be used on generating a PKCS #12 file.
            "pkcs12Password" => "FZQkTVLy2MErFCu2H0e8Lq9QPW2cqEgMrp/PES9m5JZ9xej6mCheNtuK8bj/qLhMsV4PvPg2w964A8E/N2WaYA",
        ),
        // -----------------------------------------------------------------------------------------
        // Cloudhub
        // -----------------------------------------------------------------------------------------
        'cloudHub' => [
            // ====================================================
            //     >>>> PASTE YOUR CLOUDHUB API KEY BELOW <<<<
            // ====================================================
            'apiKey' => 'mR1j0v7L12lBHnxpgxVkIdikCN9Gm89rn8I9qet3UHo=',
            // If the CLOUDHUB sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your CLOUDHUB installation (with the trailing '/' character)
            "endpoint" => 'https://cloudhub.lacunasoftware.com/',
        ],

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