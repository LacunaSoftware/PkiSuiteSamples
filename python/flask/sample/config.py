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
    REST_PKI_ACCESS_TOKEN='VF0jCF4QWfjvUQ1cUBmeePrSNALinTQ1BgfGh0IMSFh3lBiiCpiQPba8NptdB_DwMKRItmccgQITMonKtX1U-kmrUYqsPegmKh7xzQUkBgiT9-ZzqcsH7sCk1mydDOKlG42QnQXMyTQWiexPeNhe8ZybGIcQGIblU72vGc8T5nRylMk4s3-jeXyYqiP8xLYKBlO50U7PByKk66OsjaVpF4dmUWXd96pVrNZ9J2KbWaNQEDh9rtUghIr88vwnE30kV5TL2hJz_LDI-smnSWYinJNPGpyWSrrLHI5uA6GplJbJNFvIn1bIYO2xjHkoESoaaaf3vu9Dh2ZNpofLN9YdCAqcFwYREnmJYCUjZZ9yQn2ba8w4xbIyDMg7q6hn_DPJUvB-H4NsVH3rMwaOzA0bXRTxcVi9SmWbJ8TmtPpmSMww21db9G6qW62yaa9j1VgHa2XjgvQSyISVPQIqUGaJKBsg82wpjf2lfTxpujruVvKE_u1_51RQP0M_2YmM40udL3zuBg'
    # This is a TRIAL token. It will be expired at 31/03/2019.
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
