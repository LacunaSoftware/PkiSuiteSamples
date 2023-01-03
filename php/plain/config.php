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
            'accessToken' => 'Inn0QjJ4VF9ApkadmyLRghNYXhrymoeA6NrXCI9g26JDxFOrj1riOLlB_OmQNcuooWLFgm4oW_QtZfV2oX7xAbg4az3pSn_VhXi-kbvdVxUUupR3q9sAe4B0pOxwow5BSpQefmWlnOyOuF6fmu9lOelHUMCXgv_aQMzsgmwbnN7b9bQNwEz_JcjxxVOtoQrU-0TpFXBSHvRR04Bq4JWyc4R_KxUf7OEMFgkENcIy76twVjAG1DrNQWs9dK7TmvP0xW1z-TyEqKKogzJb4uto1oLelOi75mg_BfOwzL25l4skxc7ybF3IKGkkT6-yj7d3p-XBYXllmM5VQTZN8LEJjMIHBu93xe7zLrcTWRMR29j5TI7ZIYlOxCchgzZvV57_ZJur3jrZOx3CrZ2Puthx2TZ5oEQFjQ2-telcdz6peDz387iPb5YtWI7QaFDZi_LC2AHCKpnCWXD4gn1lYyZ-78lxWHI_i2YnJ-My7IL9uztj9CervviiuIXysZQOnSCJXrOPUA',
            // This is a TRIAL token. It will be expired at 31/01/2023.
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
            'apiKey' => 'pki-suite-samples-01|bd4ed214b6f42646acf08e0f21a18be153341eed3165622ac8523c8bae3f9b15',
            // This is a TRIAL API KEY. It will be expired at 31/01/2023.
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
            'apiKey' => 'pki-suite-samples-01|9297219315056d46a8221087579051090127eb1e4874f8b8eacc38f6ecf4f29b',
            // This is a TRIAL API key to use Amplia. It will expire at 31/01/2023.
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
