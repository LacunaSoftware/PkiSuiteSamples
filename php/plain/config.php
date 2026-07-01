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
            'accessToken' => '_R5vcAVgl1ISp3-rOjJ5HDAzuQnnGDWoVJonKeq_wzLjYecaXL9yHY3ylms_iG-rk2nR1uQ2BoZnEV7o6aPZPoqOi3-Ddn5AL6BQpyoC-uvK9LGhm5ISR1qlstGtlVKWMyr5O-yZDzkNzDR-5rqx76mhBrQ1-oLKzXkM9Rw6D07s-HAKY81241lldK398vnae1RdPRQZiq2LOkW_wBvP0hdlaV1jcaqiw1L7thWb5FqN2j-lTuzshSMEuR-JaMcKa6djvTsECrLh9Krl8MiGKmTjfI8ZoRf2bQPIDDLFKL11ZeZHOTlGF9n533hWSLIMik_6M5LUFAmlWUu8yKTqNHwWjYo9gAlqjyGxaduijfWmh7dqvYjnRH7Yy64SpdV1s1eVlcdVC8VnYD2bOQwbE20zeBikuMN_Nr6Im6t0vz2-leSHmB64OVLMBlpTCW0IrxApOBt6VMe1FedPpkuoXeChGsLoEp8NCR0xJg4td9bhHaT1catpe1VA76u_8DOL2f_RSQ',
            // This is a TRIAL token. It will be expired at 31/07/2026.
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
            'apiKey' => 'pkisuitesamples01|e952581dec3f3e4788bed4c61c557ea169e517dbbd8650cc5f905f2113a296d5',
            // This is a TRIAL API KEY. It will be expired at 31/07/2026.
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
            'apiKey' => 'pki-suite-samples-01|623ac767c466414893d3d03e2988cfa514cca0f75c60a2f8bca2f1250bd35307',
            // This is a TRIAL API key to use Amplia. It will expire at 31/07/2026.
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