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
    REST_PKI_ACCESS_TOKEN='ibFx0V8fOBTFXo1tlOAD_OJeFEF8eVa-8hfYX7tbAwvkwVTVNcNmHaLzVfzex5aPnmdlP3MQJjhEepBmGNnWhA0k5VQiLwlEY5ZHch-mv91Yl7Ra1S73WCii5vWYzcJkve7argPc9khaSFRm85S2Y716yU1GKlWNeoflZlOv7PGh7nCFzNbbur7tpx335zfSyBJKz3wW8pDnb6jXg-Yi3FqXOIhYEtjzqCVbkkOFqwWYvxiVsTsJ9IclWkUXkfscSzWVqi_5K-tv--42cPk5B7Zu0ayq-zavXxeqkFTlw2rA3HLphftrhUY60KJ-fwq9teiEGVSPI2aFUqKC1vh7i_CLotW2i3TAxBH8GSUr_A8q2RRv1uvGlDk0OKD9tChF6PdURxeX27eSTCabcgj8W7_EojPjkgfKUXjWkSpDRMRBxownuVWKUZ8qdD1js1q__BB3q-VTDLfQtICI3qzWZP4_JynPZHBTQE1Gbv41su1TDw1V-uOsn0Qqe3r7iulv2A3yZg'
    # This is a TRIAL token. It will be expired at 31/07/2025.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|e0532a5137a55a4f902e7cdc5b267fd70419cb5dc05ce69e3740ed30278f1417'
    # This is a TRIAL API key to use Amplia. It will expire at 31/07/2025.
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
