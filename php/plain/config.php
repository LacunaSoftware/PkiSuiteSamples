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
            'accessToken' => 'BCa6BKmqEDj5qokS3yXL1bGV3Z28_DSA0eyekzN0a2mAHFP3jFmM_QCvi17vhjOgeWTmAWXr06YepZnnlL4W7MBPQ_44KXB_pjhmiSx-61Z0kzB7u8r50Ij388LcLk-ZgkBqYEp5ZecDcD-ItDbxf1VQg6qcrR9RR9_pKMd00VBs94h9SBvPp__TYzc9Ailzh4VMT6PYxpro9iv4cR12PkdESPGPEZFMyz_FgGvsAclTCYMu4mT724J4O9nVxEzpfLO6EZn6hk76Us163ObFCNG-DUYXll-poBe5j5ppN6IzA5xzx8ecemfVyy6KwdhTMUdLjULYRmGi7KpKp7neqNsKUZoPPsY3BPQLFPQtmobr22mX1ALewBJ1ZGZLtxNRyGKITB-2QUirm6dg0R9M_Gb1fdkHL3hyx2uinUhNIsZD9x15EJHvgx7xIeJWe6uw8uAslusZpNKE4fIW8C1zhf1C3x9JjSZ1cnVzFXXRqnShrdIFvvu6I1orur5NMKmGDuFhCQ',
            // This is a TRIAL token. It will be expired at 31/10/2020.
            // If the REST PKI sample doesn't work, please contact our support by email: suporte@lacunasoftware.com

            // Address of your Rest PKI installation (with the trailing '/' character)
            "endpoint" => 'https://pki.rest/',
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
            'apiKey' => 'pki-suite-samples-01|58baf5b5b7b8694a8299c8365bf2265483aa5c2f3c7d592015688f49f135455b',
            // This is a TRIAL API key to use Amplia. It will expire at 31/10/2020.
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