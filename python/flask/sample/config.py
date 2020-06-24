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
    REST_PKI_ACCESS_TOKEN='bo8fn3_ZWqNbVqH2DlVN-r2Evd-6if8aK8RaAuqZ3P5RxgjUvB5riU29Ztd86UGNd-Z2QZQDyG4zymq_21xPdLJxraoqEjvh_MRuYA4Fjb4S8FAo5xm2__3oSROUCMl6Dt_cU9Av3xjeUNuljDmY_17YK2V_MBDTrHxZTbYoa7eM_cm9M2brjqERANnuw75LZWCrA3w6OxVpmwbvwh_DU8h9GrcBicWDCD5s54uU-vhe2tk3zqdEX9Untkl5paGMCBdwjg9rOkz-TZtjS1BgCkowPHBTF0P3FGG1n_yefNnTTnsHLZDBRBmSKEPWrlc_9b_YOVTFx6UoQRrGhlWmWmK-3zpI_9G72Zq0eoCq7OMj8qTcDZqo7n1l3e09tfv3GcsDsfZ9K7YgDSI8J3cuDZhr-r65nidIuD5xj9VqzrNZN6x50gM88DBSSC-E6crCk_5cI2GgajLW1mZy5HEgbd0SfuZmOdkhkl-u6stOWQcISM7wYaYw4Lvrgsq2hwXxAKsxLQ'
    # This is a TRIAL token. It will be expired at 31/07/2020.
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
