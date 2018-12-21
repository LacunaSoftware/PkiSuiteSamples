class Config(object):
    DEBUG=False
    TESTING =False

    # Trust in Lacuna Test PKI (for development purposes only!)
    TRUST_LACUNA_TEST_ROOT=False

    # --------------------------------------------------------------------------
    # REST PKI
    # --------------------------------------------------------------------------

    # ========================================================
    #    >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
    # ========================================================
    REST_PKI_ACCESS_TOKEN='wD_6l5tXwSnzyPN9pDwJY9l3WxOeNjuLfiS1zFpVwoXEWY8t1UqXRiEHl2JuziZLvDxUxlObqQqT-c4pgH8vWqb1YuK8TCOD_yW1_PgmF-dtweUOrVwsLNRMzfSou5ap97uGNml0QYPMlhXRInVwUW5D6Bq49oqRnXh6hor9X2xu6sjFFP9xE5qKh_cXghDjNR-D7jpjbzjBx1ui6jYBppyXE-JqO8wWC-xgUJOr1S0Z9Dsljg8bgsP8iwhVxJ5W26LAVa8GzNOMZGinzJ1OqrBN0-TLemqfX0u5x48a4K0OtS3ybjjLx0ubKMJ6cCyqFaHiikTnPcFEgOXTD2jG_rtrDYuaZ2jDAX3w1m5k12wnVcsAxerS70xfPlnoaQkCjE0DRb6Zc0ySFc7TEpfE6FB6DKS3GZ8LF8tUx7a_2T1KKi58FwfbaeYThx8GRdJZHhEgO-1p_ctyySUCFErIIHATtA5j7uBoXDDPuy8P9TfQoCtO8yvaw00nzMOyKtodu4Og3Q'
    # This is a TRIAL token. It will be expired at 15/01/2019.
    # If the REST PKI sample doesn't work, please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on a "on premises' installation of REST PKI,
    # fill the field below with the URL address of your REST PKI installation
    # (with the trailing '/' character).
    REST_PKI_ENDPOINT='https://pki.rest/'

    # --------------------------------------------------------------------------
    # PKI Express
    # --------------------------------------------------------------------------

    # List of custom trusted roots. In this sample, we will get the certificate
    # files on static/ folder.
    PKI_EXPRESS_TRUSTED_ROOTS=[]

    # Offline mode. Set this, if you want PKI Express to run on offline mode.
    # This mode is useful when there is no network available.
    PKI_EXPRESS_OFFLINE=False

    # --------------------------------------------------------------------------
    # Web PKI
    # --------------------------------------------------------------------------
    WEB_PKI_LICENSE=None

class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    DEBUG=True

    # THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!
    TRUST_LACUNA_TEST_ROOT=True

    # --------------------------------------------------------------------------
    # IMPORTANT NOTICE: in production code, you should use HTTPS to communicate
    # with REST PKI, otherwise your API access token, as well as the documents
    # you sign, will be sent to REST PKI unencrypted.
    # --------------------------------------------------------------------------
    REST_PKI_ENDPOINT='http://pki.rest/'

class TestingConfig(Config):
    TESTING=True