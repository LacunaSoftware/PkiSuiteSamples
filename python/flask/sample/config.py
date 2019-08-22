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
    REST_PKI_ACCESS_TOKEN='Gy55pcM39T1Nydsj73YAh3uPXMBXIzQikuiF2G0spdnP-FPQkA-qg20oy9eqVhskuRui0J6t6Sq6smgzQmqDLda-LIumZAHrU5SNkhzejxusr5CIvwVbD3VA4cJicRANjbNRDTMfolk2k0he5_Rcan7Mf10Dw4r0rnIPO6iB8ZH7PQYLeSMCBjQV3X6jsfxK1fo8k9gktal1mFD8yd3YNsFuhX9oRyeIq2jvtQzUyOxgCelEGiQ7oDPFyjT6I-EKbSmNy7tDmJrmaQXA3B1Y5Xgvn4yfsc2WXbeMA_BWom_nv-nWtCjQG-uyLwEuWzWrLHxF0Dvt8YjuwAEsdYum4BK08wu2rNODfo00N2vPBiipRTpkUrHszfXndSA12cBm6trhzhRWuFfH1Zb3GwACL6K0syweEBev-sZjJ5Mq3M41dNS0ZEpX07WXhR04SoDWHwYXV8gxfAvLaFb2Ka9E-6SL0MoP5zs8O86wz3FE5ZizxPxLtAoSEG3e0AKBcEpGjlPuGg'
    # This is a TRIAL token. It will be expired at 30/09/2019.
    # If the REST PKI sample doesn't work, please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on a "on premises' installation of REST PKI,
    # fill the field below with the URL address of your REST PKI installation
    # (with the trailing '/' character).
    REST_PKI_ENDPOINT = 'https://pki.rest/'

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
