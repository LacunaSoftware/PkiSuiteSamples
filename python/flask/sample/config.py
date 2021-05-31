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
    REST_PKI_ACCESS_TOKEN='hCQn5FmlpDY1LVX0gdafyH4Q34jpoLf86yE2cuGOVuAZvjT_FSWQkfR6yQX2haawBy5pluyt2c4_Dp5Tx5zfu-NaB0t9W8nZ3CJzH8dBheK_Rd3F07ZhGqh0KyIdUMU1gy_ezJ1ib-aRESacHvlRgunkvUFfA7ZvdW7CLLENeYgwC7Em9H9YoZIP_I173B61untmT2XnnJSGZu-_UMYEI0UozSe4phi-2nBRqg1OOxfgI2J2BYDUcfrot4AOzZkixeUva0B_Dntv8L8nPuV93r2uVVf5jRQ350JU40x8pa-10OgR8Ejn-EwjUlnjAVN1NvXMg30Xeq5zb6BdvqcxY8OkIEmx8NJlaKn7Ztw-xKcRG66z8LxOtWhBvzaxW9VRTLZ5otl_4LU3maEMoFt_I34ULjxiEUpRZ2qoqAKw-jpugohHU2LPoyBQ-RDquBDj4RPqfwPIcmPvVcwDXjiaijbZ7Z8ypXFae8sBR-tVbWqdi-tHLc_BQde8GKNPIRzs8wFPBw'
    # This is a TRIAL token. It will be expired at 31/07/2021.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|a14de7728d208549a1ca55cf555584ff8ff1c052ed79a1481a32da153a021b0c'
    # This is a TRIAL API key to use Amplia. It will expire at 31/07/2021.
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
