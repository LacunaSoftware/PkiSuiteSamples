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
    REST_PKI_ACCESS_TOKEN='ohbl1j0m4T_BVuDa0eBD_AOjeoAbULGD77JE3c4TBDQGrh01eckKCDGZP4amcQA3cqw3fpoQnTzgTavqy8IGzbGf1aYxGx64H-YteC1JEf0vGL_7Jf8QCxEZ2bcbKuwUTGqiBwhRI1IMRfvj90BpA7AM-USu2qRqGdUSFmtUU7oTwfNJGrj7TnFPh3x83HzcOqvPOyb23piy3nzpW9zOFfMW32USuGT32vu3XJi8JIbxEAVSsKPy7izWWx0WTr28-O4yX8OH5vSDUJzMFtNUw1WYJLB-_P-eePkBDrih_LkL28oJFVdIB7ewXPYg9X6QY7uQPCOCho6TyerUwPnkJE3eo0_vLkli145rd7q0P1YYBjil9i5y5zS-LEOgovcR4gOdl8eW1Hpw0Def5DuIErQSOowih6HA2L99VYgMXCyCKajmK2Q_Z0qJdRsetMIC8hu4ghb0XSdOcEv4d1a6N1xr82gpdyohQtPGF4XieDao9Zk7TM2iFqkzdb20L-64EvURJQ'
    # This is a TRIAL token. It will be expired at 30/11/2019.
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
