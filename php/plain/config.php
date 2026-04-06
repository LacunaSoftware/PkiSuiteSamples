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
            'accessToken' => 's_r-p0jjF0zdMxr7K5c4_IRgkgYb02JfZgxTEvuR0oubEtfhwf5Yza-R0vUgBGdaItwylFUx5BKAc5j_9SSzYkDrNAS1a-uOOdl-oPzEu7NDcAm1gcpKgw910rNl0I3GPPcXvoBF0z_fN_M70ZU5_2m9W_nZUc-SSN0z_HMhuzBr2NiC0OWhEUlecqnbeqah6S6QD7f2Ziau_7oQSI8XamA9v3nhuI6CYoo8Yp4XC1NLxHBVdXcBeWrVob3YhKCyC1Ak3d-guHp0OE29ToiiRzUylsQeJ44hMdFll7Z0jVJvNvCQXUV7A7MQIGAmMKpkVfPfNFpSlPA0HITsL1jHdmGFgBM5B4nCC_FbT7dNOVSDsM6K8uMAkX6pVvn7tc82ALqXrG9ei5XtWSqgnannSjkTVwEaaU_ONiEwZxlcs9ufHSDLXoQxDy9xuoUaC7CMM_zUOKpy7cM7JaHW30hPOFrAHasQZVDO9ai02KRN5HEKWzOMmLh47pJz62XoKubSlHz9Cw',
            // This is a TRIAL token. It will be expired at 31/05/2026.
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
            'apiKey' => 'pkisuitesamples02|54ecef6fb6a43e4c8fa8267343338ced9f9ff7ff7274bec244548d4f1e0e0188',
            // This is a TRIAL API KEY. It will be expired at 31/05/2026.
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
            'apiKey' => 'pki-suite-samples-02|aa4e283341a0ae45b547763c22f88f0a46277bd6115c4dba375353dbcdd9e8bf',
            // This is a TRIAL API key to use Amplia. It will expire at 31/05/2026.
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