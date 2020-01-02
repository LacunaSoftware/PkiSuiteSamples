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
            'accessToken' => 'ftCmcHGLdSk_6r7T46fGugFvHSLwPljry7wYRSVYA2LNSKUzbNkw6iHp_VxWH513738Tb_sJ0oAF_nJbV8upWuQG4ndbhk-kLJCwahmlAJg-_r9WUuSE5iF1p5sctLe-WoCO3M9py2j2wOjjzaokWTsuAbRkTRygKTADesP5sopwhQUvrO71U_wQM4C_ZOwz36yYQ9ywfiww60AzPoCfDnOcGJgGd3Bchy-bfz7XUNBPEgERhiu2RfRHz_0Akb6DiC9p7G26v4d0aRd_oNPY2pCr5q2SUD6qL9lWpRuD2O16f0vn-3CPagXtW_fBo281yVXDuRLmsMmdiwDWK060iLN31gOkK0PalqA527ivRFc4wDu9ZwhIibExV5gRFKiY-Ld_lFaJ_ykHi6MsmyyDaCMiIRrQ-tt6qoA2yx73U855Wsoj0qkf0TWQo5qH5jJqRdpdBdjMmVjXzyBimDhqSt7W738XeeRioCF7tno3BhBNBhXmboJBtOGZ0D9dRG6TnorOeg',
            // This is a TRIAL token. It will be expired at 31/01/2020.
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
            'apiKey' => 'pki-suite-samples-02|6b7b2441f5f7744990d771120e50cbd68fa2d749a322f3760ba3bc49925dfc87',
            // This is a TRIAL API key to use Amplia. It will expire at 31/01/2020.
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