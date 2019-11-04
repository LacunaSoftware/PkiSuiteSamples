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
            'accessToken' => 'x2st_aScMCgWz24m27aH8aUtQwF44ar_4tYmI9wEaN8rBRtg0466e0vYoDtxdjhq_ncufxevzMdXqjLlWXgIxgULdRfSfZsc94XZHrWWtWbWubksGnNg-fzsXo59T_m8afBLk5esE7109KOJ95InQ46SKaJk_vXnpaNDmgDBCX1JByRWhkwXN22LlQdv0wpbZ_ulFg0J-VmvWGeXUsUhCx8u72A9YQnnASt5eZd72tAttJ-Uot3QmVwmgwnI3b9aHF35EVMHP95qwZbEtxoVcH6pLVpqjgFPHELL50uNg6mWt4XqdzyAey_W-6rPGyDcBvinXcagIh_dDk7YabViZWdfu-cOZgXfTxI6igqrbmeoVIkEFMrwa9gPuE8P7_L_fCpwEqy8dVp6rYpcQq-lWOtQzQV_h2gk71XW86WZl-Rt0Y7fXmsBUWWVcI1RJyDkNaZSxNwcrrJk_JoB11YSK02EbNmgMLxd5w-Pm16ba7IHpHyolA4Z5J44SHffGZZWpiSD_g',
            // This is a TRIAL token. It will be expired at 31/12/2019.
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
            'apiKey' => 'pki-suite-samples-01|c21b23d15fb8c54a9fc21038c394624330f77c2d48e690f63ac34b918a7eefc7',
            // This is a TRIAL API key to use Amplia. It will expire at 31/12/2019.
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