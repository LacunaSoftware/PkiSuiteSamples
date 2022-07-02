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
    REST_PKI_ACCESS_TOKEN='mzKQaEvvA1ZLlFaUmXdqCIaitItEw2C9aJyHeqMvBxlqIvLiVRkDQGAtNGIWgURh9HXGq9psFI5tVJInA06JVa1IKDsbuOjAbTI2ndklHXpX-8O_QE6sx0ojpFFOveMkALgqR8yc0VRV6qH_chZ9STar1wRxUOae7vWkCLGpIwT25TzcpEMxAfx3E2VnqTh2h0Xmqjqc5xMyES7Cljtp3GnfEhsLzT0Ru1-IpO2uwTxm9oowb3dr7yJQ9TAkMafCdFe39JDKkWi99uJ-Lt9Ve3RZi33BIgoEHHgUvHzr_R9Ig_aT-DzP8TMXNyuLSp9m2dzcI9Wh8g0zUE8F1hzjBLo7hJi3UL3Jc24hmk7cOCvBPEoxvDoUePPU8MbkPHP4F0ZCwBqnSck-XTSk2yjfoPa-Gd9wKouTI6aQxnkiGRO6zeoefpRVXl9ihkbd_awBRaym2RwAp6al-G1ULXAWADXXtDLukjXOCKwmxxik-wsLPV2b0xxOQRhDa1S9iK7otqeqfg'
    # This is a TRIAL token. It will be expired at 31/08/2022.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|8b669b58865aa34c8c264f1a83bff843cf4cf772a0c3beaca09838770b9b5625'
    # This is a TRIAL API key to use Amplia. It will expire at 31/08/2022.
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
