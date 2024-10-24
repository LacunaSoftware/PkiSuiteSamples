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
    REST_PKI_ACCESS_TOKEN='-iGGkCsWf-YUBtVA9IemMmg-hUmLO1Saph96SbiJEpyeU5n4G-ocrDwLHeMXYZ5ETNlqIYRpOMhaVkYsU2MR4P--1O39JF1ghZxLUlH8_iGNA4mBzHs41hSHdaZ4zF-pML-eVxa3oe3beSO-L9JO3qUwrW-DkERW3KY0f2ay22DXi2b4AXEd8NCJpyN0kzgOooksoUCpuVipVjrB98rkV69kkC0pwtBQoGUjevoZ_GyEIpKK1FpkafKi2jk-dprS7zRlRGB2x9ZislVyT1ZFpySWt0a-hY6H03rzVfgzQjumTGoXX33HWJZ5ZnyRMCrJfCVJRm69E6Lwmmabjo4dwB-GPWzDPFShaX_zFs_fuB170JHs3Jwr6ZOhuxUHpq1yd7Rzap4qR7Rf1hXeXxGRfceMj3Tg8JZoKp4QyWd21HLK2b9z3ZUaqHzhV3VRau4KpZSTMAI1BMPNkk05skd704C2hw7s5sOUaZ6q4K_PQQ36885gQGp3fCR_NUoFTLSY_LDxag'
    # This is a TRIAL token. It will be expired at 30/11/2024.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|75a8451c3f71b34396b10c9b2a7629af219efbeb0fdcac52e1e3b148eb380c20'
    # This is a TRIAL API key to use Amplia. It will expire at 30/11/2024.
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
