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
            'accessToken' => 'bo8fn3_ZWqNbVqH2DlVN-r2Evd-6if8aK8RaAuqZ3P5RxgjUvB5riU29Ztd86UGNd-Z2QZQDyG4zymq_21xPdLJxraoqEjvh_MRuYA4Fjb4S8FAo5xm2__3oSROUCMl6Dt_cU9Av3xjeUNuljDmY_17YK2V_MBDTrHxZTbYoa7eM_cm9M2brjqERANnuw75LZWCrA3w6OxVpmwbvwh_DU8h9GrcBicWDCD5s54uU-vhe2tk3zqdEX9Untkl5paGMCBdwjg9rOkz-TZtjS1BgCkowPHBTF0P3FGG1n_yefNnTTnsHLZDBRBmSKEPWrlc_9b_YOVTFx6UoQRrGhlWmWmK-3zpI_9G72Zq0eoCq7OMj8qTcDZqo7n1l3e09tfv3GcsDsfZ9K7YgDSI8J3cuDZhr-r65nidIuD5xj9VqzrNZN6x50gM88DBSSC-E6crCk_5cI2GgajLW1mZy5HEgbd0SfuZmOdkhkl-u6stOWQcISM7wYaYw4Lvrgsq2hwXxAKsxLQ',
            // This is a TRIAL token. It will be expired at 31/07/2020.
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
            'apiKey' => 'pki-suite-samples-02|aa4520f2721caf4f8c1f71cba5077e50ad5475bab0578a4a9803c82c0aeda3ff',
            // This is a TRIAL API key to use Amplia. It will expire at 31/07/2020.
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