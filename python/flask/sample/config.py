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
    REST_PKI_ACCESS_TOKEN='Rzgbz-hkIvraE1YwJVrAkFn7og7e_dKTfQSnr5mX3UpNrQGY1vC45wmh1onCmRsTtOaQ8hVeF3nV90u_Ona3N1hiCHmwkm96L4NTwG1vvOP2nBkDnGu2DASlkgNbt_bXZs-8v-QV8r5t5SFfEDrX5ergRnJODxEqvVQl5a4P9E8Fz1xUE76-b0grm9SPhceeqEx85GVDjXkyQo0tOml577yMGVE8yjMMtTapjGxzOMZXk0IsQSjO7n6OHG9qWKcqHhzWHk23t_ujuxLKkL-ujXoDWEv9CvMeX68ic1l2DCttUeReQQFWmXrp6vDb1OJB7DpQWkXX2U9FJWHrMZPelVZR6XyHrz-R2b_dz_vPcNd6d-JCPV6VEHEPOf8vcXRwZ0lrUSsGDw25cOYvG_cMUuCXc8eTTB_oHb_03Wh-ZAH_pe5iLB_g7cDu_R8C9OrGtRUU7LvAJc7NiaVV8MHd4sJtjbUPJNgt6q5bRYGzoWlu7u8FZE4ME4KK8TwWRnPvmVgcrw'
    # This is a TRIAL token. It will be expired at 30/11/2025.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|e4c55811357f514eb7cc8f9162d485a6aee6310db6de744fdbfc2ae195976d2a'
    # This is a TRIAL API key to use Amplia. It will expire at 30/11/2025.
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
