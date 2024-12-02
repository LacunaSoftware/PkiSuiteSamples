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
    REST_PKI_ACCESS_TOKEN='XQu8knge2MuLcgsPe1rB72xKa6Uwx9jocqLhBcOH3_GjY7qxH3GS4E3v8MSWee3RgtDh0Z_kKxWQvMdIgZ7z3RDL4AoMyZ1wUtWqGKy8R_-Swh5dtwMRSRDbWoyOf1xTuPNQcdT_mI_hu_JTmwhWkZXBMqK000oufe2RG9rpR04LZLPpy2xnjlKlamyg2i2rGCH1dn6nSTNcRwPlhQn5D7-Zs0CCs2gX3ZEIFVtPLH7k0sEdWG_RJTsm7_pb_ySi2B6p0XUmch9_Hny24mN1gZ-xWUVWkekukGjslD1gGAOIEKsiRY985dg_L3yRAkRt9P6sB9qb8oegPRV4L6WOB0vZAQ2PAb5PMdtXlSQEg8nIFmxEvpvxhkgCt8pBQoM2hFeSReu1995joA7qbdaL9R327cuZtyrk4aZQ-KbZBZlejIy7V88v_8i2k1W_eGTG7cS-8VXS4EZH7TQzS79vNhDOwDsSaFSTcEaOFTtLSo_oZV2cJTjuhKsmCNTlQHJT8WcCdA'
    # This is a TRIAL token. It will be expired at 31/01/2025.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|9701d0d38d94de43958f5d80da94275690e807ab69a0075e7dd03545bd4353c7'
    # This is a TRIAL API key to use Amplia. It will expire at 31/01/2025.
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
