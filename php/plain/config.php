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
            'accessToken' => '8bXgIzJomxB7LoSJIdlhVROpQFM8M9SicR1koKpAJNYZNyChPqkcu2LSWcTcEk0gZGXBiC7VZ94_NIeEBPTPbA86bJDNkENwqEtxqAKCWh3OwKV6kGa4e6BwsJ47M5hb4E6DPXCGGPfFthtrG-sLvpDKl7oFe7nn7J-7vT3CUdqGbu7cW9B1YzRMAt_OfDAt4BXpASNjgYoldiHdEGdDyTeVLFolnHYslChtYcswP18TUwGCl6rWp4aWNDe6wVevP6u_LdK7VzeFxRd7gIZ4YZs2noE4DVHFoVzBR-FyORlxUGATeWV_8lPAiHC1TBHBi-mZJp4tI4IL4imWJSLrQqWI0j2HgVl20kpdy4J_HLXM5iTk39kzDfyYAyihp8ssIbce4RjrhkxoYg9x-ZckuvlFuQYcDlYAPqu0In1gS3Mcp-Ip7ILae7DsokItO9ostUtuYhNCcGTL6c45zXT7lMmo9vTnlq-air9IcNITZa2g19Iwz9XzZMc5cr4dGwiaicTN6w',
            // This is a TRIAL token. It will be expired at 30/11/2020.
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
            'apiKey' => 'pki-suite-samples-02|d319cce87d43ca4da87e8d53abd8009a7b86371bffaa823bc3f9bcfb71fa66bf',
            // This is a TRIAL API key to use Amplia. It will expire at 30/11/2020.
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