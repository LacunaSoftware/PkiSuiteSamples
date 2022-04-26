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
            'accessToken' => 'DuSD8tuUGVbrlmoZmRc_kOwJky6C5MxsB17IyUd3MXn_otd4gjtGqAT0oNYt9_GHfwqDoal3Tz0fr_FuR4kGcgpu73XaFuApNBIqIb1H4UOGPoiRHcpwvneXvGzhBue29MVk2UtGF5PJN4HzSy-Ry7S3MD6p7QfSKeUgXk-BgDqoca_Ah3WkrAJezyyXLZiiH9Ui3yAqm-6Z5TsqqcHW1CtSb-mUVGB8zUKTxLMnyQrO4ROfX0Ft_f6CCWOqaHLnUJ3THz4GuruItJEFHO4rBxQely_GkksdojO6VEYDP3auBJDQNm6pHKdbeGNsi5iDGQICvFT-FTwJuESJ4Or9zST_v8Fuf_Y6hZ55q_I_QDxvisl0-Xcu3Nfx4Iey-Mhla0u_-DY1o1la5F3OI38RsE4qTgYD3sJbAPdb0dZvglaJtkfihemaRE-1F-uSJp_VxswI0Dm8TUgNri-1hgAyEzLb2OHXGNx3PGPVXfYIsl9yIUkjDSuw4VYn3BPXQOXp8sOG3A',
            // This is a TRIAL token. It will be expired at 31/05/2022.
            // If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your Rest PKI installation (with the trailing '/' character)
            "endpoint" => 'https://pki.rest/',
        ],

        // -----------------------------------------------------------------------------------------
        // REST PKI NG
        // -----------------------------------------------------------------------------------------
        'restPkiNg' => [

            // ====================================================
            //     >>>> PASTE YOUR REST PKI CORE API KEY BELOW <<<<
            // ====================================================
            'apiKey' => 'pki-suite-samples-02|81173dd3ce2b2248897f225f4a981a1031a0d2b4950959d45684f1e5c8be3442',
            // This is a TRIAL API KEY. It will be expired at 31/05/2022.
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
            'apiKey' => 'pki-suite-samples-02|d077131ed431af4a8dd45232cc5c0c6371bcffd61e156ffbaf4095e26b4fe428',
            // This is a TRIAL API key to use Amplia. It will expire at 31/05/2022.
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