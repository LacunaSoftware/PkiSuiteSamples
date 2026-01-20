class Config(object):
    DEBUG = False
    TESTING = False

    # Trust in Lacuna Test PKI (for development purposes only!)
    TRUST_LACUNA_TEST_ROOT = False

    # --------------------------------------------------------------------------
    # REST PKI
    # --------------------------------------------------------------------------

    # ========================================================
    #    >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
    # ========================================================
    REST_PKI_ACCESS_TOKEN='uBE53ESej76j7YLy2L2CzXq1Eh-AfAUhxaDgizPKsFpiNcUq1_NNPQGmjL7yPm4UkMWZqPCnJBYPv1pSsW-KuEN49XhWZJXqbhm41v-C6VuSg7_NUANQIQLoGyKjcZGrksdLgUPLDT3OYY8NSQG8knzG_GvDBVleR94oszy1kb7OPM3pzZtE2hAJLp2Il0pCDG0H8E8pjBqEwZJGZiJU-20bIvuUrp9yHEIMPhYOwAH8evDB3-7f9pmqGI1csH2WFz1LUzmRhsHDUoCErx7j8s1XjbuH7C8jbrsbmY277pbWs5ajlgq5FiCbBbFwr-54XvZJDx0aZ0yXCUhEVCDJGRqV-v7FhlYMaIPgEB4p1bzQpMtWN36h1O4k6nRBMlltxKuhusWLdVd6dRGDUKbX7Yfeqj6UoIkHBlve3DcoNfoQ0-x7PW2iMojFT-P9LpzwezMV1EJacn_km9-3-IOOJoT-x_iEcv9KII1rj0_j9PSNEr-EgKb-uZffJoIzczc19MBA8w'
    # This is a TRIAL token. It will be expired at 28/02/2026.
    # If the REST PKI sample doesn't work, please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on a "on premises' installation of REST PKI,
    # fill the field below with the URL address of your REST PKI installation
    # (with the trailing '/' character).
    REST_PKI_ENDPOINT = 'https://pki.rest/'

    # --------------------------------------------------------------------------
    # Amplia
    # --------------------------------------------------------------------------

    # The CA's id that will be used to issue a certificate using Amplia. We
    # have configured to the sample CA from sample subscription for these
    # samples.
    AMPLIA_CA_ID = 'eaffa754-1fb5-474a-b9ef-efe43101e89f'

    # ========================================================
    #     >>>> PASTE YOUR AMPLIA API KEY BELOW <<<<
    # ========================================================
    AMPLIA_API_KEY = 'pki-suite-samples-01|1e6a7cae9ff4ec4e8171fd70c69b95ef31da225ba9dbeefd0fcefbd19879868c'
    # This is a TRIAL API key to use Amplia. It will expire at 28/02/2026.
    # If the Amplia's samples do not work please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on a "on premises" installation of
    # Amplia, fill the field below with the URL address of your REST PKI
    # installation (with the trailing '/' character).
    AMPLIA_ENDPOINT = 'https://amplia.lacunasoftware.com/'

    # --------------------------------------------------------------------------
    # PKI Express
    # --------------------------------------------------------------------------

    # List of custom trusted roots. In this sample, we will get the certificate
    # files on static/ folder.
    PKI_EXPRESS_TRUSTED_ROOTS = []

    # Offline mode. Set this, if you want PKI Express to run on offline mode.
    # This mode is useful when there is no network available.
    PKI_EXPRESS_OFFLINE = False

    # --------------------------------------------------------------------------
    # Web PKI
    # --------------------------------------------------------------------------
    WEB_PKI_LICENSE = None
    # --------------------------------------------------------------------------
    # Cloudhub
    # --------------------------------------------------------------------------
    CLOUDHUB_API_KEY = 'mR1j0v7L12lBHnxpgxVkIdikCN9Gm89rn8I9qet3UHo='


class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    DEBUG = True

    # THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!
    TRUST_LACUNA_TEST_ROOT = True

    # --------------------------------------------------------------------------
    # IMPORTANT NOTICE: in production code, you should use HTTPS to communicate
    # with REST PKI, otherwise your API access token, as well as the documents
    # you sign, will be sent to REST PKI unencrypted.
    # --------------------------------------------------------------------------
    REST_PKI_ENDPOINT = 'http://pki.rest/'


class TestingConfig(Config):
    TESTING = True
