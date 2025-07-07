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
    REST_PKI_ACCESS_TOKEN='ig_rjgG_P59EnT0E3CURJgCrkeV9CTqdhdpXoD7xqQeLEgLIUKW6avV_rEUHjYGjatsjCF7NQZiFzfeBOBUr_5g3rS3okgBg82TAhKfbkw7Rhh0hpfC0i_TgWIaHxZEeCLkhxmQOviVtB7JGNPfwJFBCAVgone7NZuVJ78HmUYw6QTdJ748ne1AMPgeTt4Qpo42163rhbWGFyunqHd4KadoTqr2Y4goToOPYwohyG-10dr9lmQggMTQNlwSMQNVjgtGLGfZaLFK46VXO__taFGNintSdgOW8IrgtzeK_H_EUR4ZUecVOlAvv4reMZ7z9IoDTZIFS0d2hqzpmkmtohYgeK_AqN_U9Tv5B5WyKjv_RJ0Uqcqv6bqWftpva7TwNEz_Vko0GOvLpKbcqlqx1q7SFr7Pp-Vijo8bHh0lfI4k2SDzMLQz86J4ViW-S_KoHV1OroEcgR18adJrEU_mnB0cvCv5ub2vaO3DAHX-HEKlyizUMuBkRVyPNe_-DFrCnV0BTYQ'
    # This is a TRIAL token. It will be expired at 31/08/2025.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|09b8a562702b5c46bf9fa1b7f5d67c0d3938f0b4d6a4fa095bb6b5fb79570315'
    # This is a TRIAL API key to use Amplia. It will expire at 31/08/2025.
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
