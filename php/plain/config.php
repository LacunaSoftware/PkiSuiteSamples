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
            'accessToken' => 'qG4Zryr5NDREhWB0k0DytvStN4lj8m9E9OMKdoC4R8dsZqpsc3ARuxOH00V-SRtZqwLdQ5-4dUQgeGQGpDUTfKqe3PMOj64E4Vmr4INkY30FbmV031tcVIH-A3B5aVXtGALFoVuzhSdmSfDVZgJCR5SERaV0bKIk_dr1Klh3ORj--9RdIf99JVBk44qtJaWVcKlYu7TJ6vd2Zkbr8GpUZIL7W1vWmRecexAVcsQplPNcqicS82ueVUX0KBq_XvX4U4pDMeOnpr8dULb5SLVVK-oAZdaAuidn3whjmJKa5YBNKS7VkD8rKuRpTO7DNNA1ih0VllRRRL0iE3ycXcBRePte2oMHXnjaMBDBXiEXpN72_JP4BSYlsvncBki_4AxpNaBTARclY-0BsZ15sO7jTdOddyA5FPf3h22Pvrfq7NdCmt7WVI48EW-onfxxXd7th59OpW6DdMov2w93iHtbr5WS5Ilb0NFgZDYFKnPuEgx6nMKlWDBKiOGwwsuhG3_6AFzymw',
            // This is a TRIAL token. It will be expired at 28/08/2021.
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
            'apiKey' => 'pki-suite-samples-01|a4815dce2a24b145a0dbcc50af13b91d8ae9cb45467176488ae1c30c353752f2',
            // This is a TRIAL API key to use Amplia. It will expire at 28/02/2021.
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