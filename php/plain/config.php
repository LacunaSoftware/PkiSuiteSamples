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
            'accessToken' => '9nusF9Wh-lTYsVRbhkgjYwMqrz6nfZQzrJmcU8nQMapctnql8GUh4KA56YCnm_Ff-VKelhD3tE9zXfUzKOn1yL3h3h7uz-Vq0Eu2sb9rl393Vd53LuP5Hoza7cOlCMMJa598yu-bc9zPwU_sH81sn6T-vKSpBjdvXM16rk--im3RTA5brTHy1ggCO_oavmVUqn1zb6H6St13M8B0FdflSNxeRD6ThcABKeDFQhKqrgAGGLZrsoZDXh-hleatUzMp0kALb_f9VKVDwt4QGEoMS14bT4hbU9hY4kaGdaHsAE8Zio6Ja5LSIIKIkqIID-i-5vEg4R9cjrZ7tFaM5MwKVlvETRDqHUlK30HjzA4ngLwSSRYKtKYFFa1PRBJ9l6aU7J9MUlxogk1URxV0oveC83bI_oWVvB1Wzd1gUFPGpHILINNRkzfafabl5V--zReEoF-wDbo6KewBBU9nF6-UaFEGK-3ZkQ2Fa8K9KYMJGrW7ylTwPIpojBWBHzlyXO5X-jjF-A',
            // This is a TRIAL token. It will be expired at 30/05/2019.
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
            'apiKey' => 'pki-suite-samples-01|bf04175eb7d3124d897753d94cf2d922b3aa8d444aad2d2d238e5ddea49654c2',
            // This is a TRIAL API key to use Amplia. It will expire at 30/04/2019.
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