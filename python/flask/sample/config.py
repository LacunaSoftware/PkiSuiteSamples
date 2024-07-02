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
    REST_PKI_ACCESS_TOKEN='NMxVtdxmsJ2kW7NvkyjXCVyR65jhgdQzx-8LTpN8XDkuymqmMQu__ycHiDy9IPbIxiX0laBDw8yuXKiMbrXzv_80BkYdlbw_yBqbaFsgIlP00ShmiCP0nh5SQA5Gz4WgxB3lA7h_htqvyANobL9jMur2GlwLmMXd9Fs-Jn4pligdwLYDK6x2DR1CRLGqbbKhVM8oPHa494ZqoFsu_SRSjovUQU1Tkvoufzs2Ew7qP2rpA3e-xhcxwWdVxQc6sPdXJuQLKlmAXt6wvpfVUW3FQwviqsQ3sJ1Tjad-DyVSf7nm4IhgNpIN-3nWTgwn4WiWStwvRpuLGWM1FDkaH0SBYIONzjMGC6obnp_AcKFX79VF7BFoZhruLOouCrzreRqa7GnTsknzY0TtIHnfjNR3n_VyOXK35pFDCTZnUgzF8G3Okuve4W6KPpls4z4PEptPMF6FG5jn9UMjWgnDcn2jXhwkmbMeIYNchpj73LptHc5ZZVn3swgBDUwkr5S7jG-XjOeaXg'
    # This is a TRIAL token. It will be expired at 30/08/2024.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|13a250301cb43b44a9419e89736273dae41000fab28452a436836f75a238f2eb'
    # This is a TRIAL API key to use Amplia. It will expire at 30/08/2024.
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
