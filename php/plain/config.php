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
            'accessToken' => '5KP92YmlwXjSdKtKYaAw4BlBpfFdt3dZw6R0omkuAX24ygyQMqscDu3RpEC4Db85FhoB1y-IV9ltx2NidpG1ScW0Hpt5YD4NKzod_zZw5uzdgybGZASR2bgC-lNseHVZUo5EcthdKjqp3Jon0KnA1xffNHZWp5OO3dfsHKVDWNwPFcsiLwlc94YS_-23t60vzywWI1Ph1LFb8HgH0SCVAyljNQGuWWL1HwbZbSsD4Z6vEyrp1NRXepMeBDIVuZwZhgi69bltBJ17CEWlVwIRpdjvsu3tY9eDY9mEFU5Gss4NmNA2xKhxNCTq2QWOvaqDoUQxJWmcmNMJBGUOO-vzXILJfzVaarKMNh--thKiCthDPpvatALdTAKNyNMH_ZGNNCiYqnZAqwzmDaoC6dgIxQNQ0k97NQiGeNpFJBMm97xoiwJsutVwcY8aiwtakTsujqfvfFQDKbk7W9ZeHHH_xjR3FFHOPIqX-sFNMgHVVNy1OYqOexsf0eqyfOnBTpro4kek9g',
            // This is a TRIAL token. It will be expired at 30/11/2023.
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
            'apiKey' => 'pki-suite-samples-02|84d493c83a6ed549be03ef16747dfa26603cb43dcb2b013934af7c80dc2d3b33',
            // This is a TRIAL API KEY. It will be expired at 30/11/2023.
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
            'apiKey' => 'pki-suite-samples-02|9a3883362fae234eb571191061f608b78877a870912ca36810cf2fbc72d1e1aa',
            // This is a TRIAL API key to use Amplia. It will expire at 30/11/2023.
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
