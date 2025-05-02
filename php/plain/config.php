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
            'accessToken' => 'gE_5kzruE8mFH2JAZwuudl1j07a3KfNk1EhPv8SQ0fljtqsyNxROCeU9kLgJjdYEClZIv8nbNXnGj2Q4gWSDqLmPF0tctbwxYq_hTV8jwVPiTkEQcf8nu2UI6qVQ37cMkR3Ti-eYgmUkjsJCDy92DzlAoBXZi5_qDbd7hsYHmIw_bRpSU7nPtbfW5zM3gYwHcDK4XXCY3vowtiu9Knq6ZMOUk5s_aVPHOvsYkvrKYyZYyDEdpcDrbcvR9k-WygtqMGSb_mmE955zjivf-Nnk2y2Kx_56vBwmvTyl3gSOXcUAtntDA9M8NRgRfKqQUWfDjIYBj0hD7BFNLWYW9cN5J4zuGl5Jx_M9MHWPP8XF6pih_UdFyt9zIwhunthcKCku2X-TIO1eL1vShat0jO4mBkr_H7pHtA81y8ftGPVDGrg0QUUgo_-y8LEvIvrOenaa2VIJbadtQhT59-PLL_AOVsSWETpXp3Lpy9nw4PzPevKCEYQY87aj-kZKL9x6Vo0G5vBQEg',
            // This is a TRIAL token. It will be expired at 30/06/2025.
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
            'apiKey' => 'pki-suite-samples-01|826efdd17323014ab3625e3da7296c0123df60c2e1e56e776c20fd1f784cd5e5',
            // This is a TRIAL API KEY. It will be expired at 30/06/2025.
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
            'apiKey' => 'pki-suite-samples-01|bcde1b050e8fce4e95166eec602254ed85ac10c27134df64f63128649f9b9d9d',
            // This is a TRIAL API key to use Amplia. It will expire at 30/06/2025.
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
