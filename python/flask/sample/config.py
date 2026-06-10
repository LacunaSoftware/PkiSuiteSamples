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
    REST_PKI_ACCESS_TOKEN='YSrnITGWeidLAsmaEAhaLhzZ-XJvdNq6JMT7qG3cat-xX6v3ZV0qKTwXe7zLdStJ4hJ8msf0qQMe1_-_vPysgfDaw7UxbaS21_ogOeot-W91WtrHzI7ZbA9GX1oEMuw1FJ7qVvw6pTnnKDJ0QsvgQZJZrZr8g_xQTReFWe52GBlzox8hUiVh4J_Fe2MATrPu37sRrt5N315PvXtxT0LGFChcyS96IJQkYKhe4uV_Mrs1VauHo0S4eFrpy2SK_KhOO1aXZ7G9HwI8VwESScHtvZWFQozQeNHwEtXI9L9yEDIJych6nEDESyp_IxTGhSSNJdBsKUOx0vglyC_rKcw19BXYeRGcvXKcaShRpsG1zPli0kkWYyEYQOpNNpZvtRCX4lw5EUiKrAmvHPwqI-6wGXYeJ_1Pgd1iDRMpH41lZ_Bk3PLFRt9bzHMOn4CGPx_8KYtD3GUN7TT9gknmnyPsDXtPsdEcXT0ZDN5tUAqyJuDJCmD6OeEu_CUHrgNMonPJhNuelQ'
    # This is a TRIAL token. It will be expired at 30/06/2026.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|c90b324892dc0849a9992e8aaf69b8930ea2a78a2d670670195f9028ac195337'
    # This is a TRIAL API key to use Amplia. It will expire at 30/06/2026.
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
