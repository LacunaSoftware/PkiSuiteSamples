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
            'accessToken' => 'uBE53ESej76j7YLy2L2CzXq1Eh-AfAUhxaDgizPKsFpiNcUq1_NNPQGmjL7yPm4UkMWZqPCnJBYPv1pSsW-KuEN49XhWZJXqbhm41v-C6VuSg7_NUANQIQLoGyKjcZGrksdLgUPLDT3OYY8NSQG8knzG_GvDBVleR94oszy1kb7OPM3pzZtE2hAJLp2Il0pCDG0H8E8pjBqEwZJGZiJU-20bIvuUrp9yHEIMPhYOwAH8evDB3-7f9pmqGI1csH2WFz1LUzmRhsHDUoCErx7j8s1XjbuH7C8jbrsbmY277pbWs5ajlgq5FiCbBbFwr-54XvZJDx0aZ0yXCUhEVCDJGRqV-v7FhlYMaIPgEB4p1bzQpMtWN36h1O4k6nRBMlltxKuhusWLdVd6dRGDUKbX7Yfeqj6UoIkHBlve3DcoNfoQ0-x7PW2iMojFT-P9LpzwezMV1EJacn_km9-3-IOOJoT-x_iEcv9KII1rj0_j9PSNEr-EgKb-uZffJoIzczc19MBA8w',
            // This is a TRIAL token. It will be expired at 28/02/2026.
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
            'apiKey' => 'pkisuitesamples01|9364e9534990ad42861930ff74556cee5a366670cff21ae1adea7bd059c4e4c9',
            // This is a TRIAL API KEY. It will be expired at 28/02/2026.
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
            'apiKey' => 'pki-suite-samples-01|1e6a7cae9ff4ec4e8171fd70c69b95ef31da225ba9dbeefd0fcefbd19879868c',
            // This is a TRIAL API key to use Amplia. It will expire at 28/02/2026.
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