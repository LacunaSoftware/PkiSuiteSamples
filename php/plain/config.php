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
            'accessToken' => 'tLPpp5bbW9BQcKhm5uHi4GeMWS2iFIfv-X5nDAcraGd3_1zrskuZ7oa2VA5YqypADkMHSKFtxEUT6_0PTNwa6Ur6Y--8OwXO9EQI_qj3d3jNYE5mpdAvt5zNEN61QJsQqvJRoNic41mzAILXm3qnGDyQzB5-FL5LGhpYWzwOWfvpUbddDZFOLNmn620JVURmEIi_VR-62rSoQGT9MTZGJoZ_KC9dsUutL_AU8uJDM3XBQO0r2nKWZ1FveNK9nbowUEDiSjC41VlUSs90eceqLd71NBzbZ6QrruI3zX-W6pjn9I0sRRadDLOFqNQS2LuS2vbrbTf1B0GXEuADGr4BQCY7oo7bPvdlmLzJ1POcGOtQJ-R75pz4gR9tDMdD3Y6yG2HOdY01eaMb6ooIDKuAZB65ohftluhbixpcti07trRajhvcwER7E1hPdn9xYlTmnfoXrSS6ivR4dWd2_zB3IrTlTO8ycfCKd2fI-5od01MtsK6YbJdV3ntGQP72xurP8KVcbQ',
            // This is a TRIAL token. It will be expired at 30/09/2026.
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
            'apiKey' => 'pkisuitesamples02|09434736b68a714abc35f4ee141361027dcb24816a3f08010bc37eea2837b302',
            // This is a TRIAL API KEY. It will be expired at 30/09/2026.
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

            // The CA's id that will be used to issue an attribute certificate using Amplia. Attribute
            // certificates require a CA configured to issue this kind of certificate, which is
            // different from the CA used above for regular (public key) certificates.
            'attributeCaId' => 'c5882160-08d0-4c66-be63-019f13c60683',

            // ======================================================
            //       >>>> PASTE YOUR AMPLIA API KEY BELOW <<<<
            // ======================================================
            'apiKey' => 'pki-suite-samples-02|7084ea12b971234e83bc139c835f7c03a5ee0484259e010bddb900fee518611c',
            // This is a TRIAL API key to use Amplia. It will expire at 30/09/2026.
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