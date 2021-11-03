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
            'accessToken' => '53JHoj0eBexCQNoigRNFR0bFpRir1ArwSSWrX-nwEnL477Kvfp3OodmaJ-q0w5t1R8xPVTpNdKqOftqlaE6t7vsqtbGxA7pkHODO7Lna3_mAZKdhobvBtmroHjxYzG_JQn-9PEm1SIpYXBhk5oTfUag_De8rzxYWebwSwuG8_HcspN1MEUbZ8WrMNZZhEcCj3NWHFG7hw_vEBvN0fEVqyx7l5ifqFUrKk1I8s3SrlUSKJ1a1S4b7XplU7vFv8iMJiQ3B0Nq5mJS84UhVE-UtU8aRTq6UnVGAG3rh3UjfucanIimO_D0ZLFpQAhnIkq4_Y2WH9w7LxOGYONN-f4XPuNOutVtLPFwMkPUx5f-Yg6nOxisGa9rdBFpdOziyZoqsBaC-n7y9Xv3mI7FVXMpWnTLODSNz8jolDu8Rhk6AZWC0NXnPOa9JWhRa0l1pzw--PKoB9v9VPxXTpWaa6WvWV8sphRvWE1hjx93TBOIyYvv6k3DVgTsve2DFqOaZ7hpjcaWoaw',
            // This is a TRIAL token. It will be expired at 31/12/2021.
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
            'apiKey' => 'pki-suite-samples-02|06b6279ec5eb26468cc98c20959197e4de91420466fa7f88e022c77d56989377',
            // This is a TRIAL API KEY. It will be expired at 31/12/2021.
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
            'apiKey' => 'pki-suite-samples-02|bbed7617a60ae14eb172df172352b3320659c2b3525c488e653362890cd50fd8',
            // This is a TRIAL API key to use Amplia. It will expire at 31/12/2021.
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