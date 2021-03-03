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
    REST_PKI_ACCESS_TOKEN='icm-xbV1ibTMxAZ5fFXR8uxEqTqBq2IhGG6Omtf_UElUigN5_ZDA1O_jk02f9INXJjJuXlGBYfDZ6fD0zUcFqqU4ApTSTASxZK23TzaGabL-5Iipg49jjsa0yBCg1Aw0wreNGje0jLPms0_pb2WntKgsyuF31_lrIfhXkfHW9PtnQmEGUi0TxFFso-33RHsHllnZxAUJqcUybsXCC-kqVsCPG8JNrkBgqc8g9ChryqeJcB8Cxvc85jReFH8JwhY3gaOXNVr79JbmAeNdCkXgY9sb4uQJHfF3MjS2cPFuWYhqnDBh5JdP5X6a5YLbDIsBDaV1-3XEn2U7Jfj-ME6uYDxKcHaJlaU39W6bTWZ7-v_2QAq_KJBRXA4seIPglQ9gwzqweCfhgYimvyzyD96HlszJ76UAO2LBbjxey0be8otbD7bdVud1sNCQifO2oGzcRalFt8rSMs7Fre43pCifT8KdyV6sjEamFCcOFL_W89IJnD4MrX5kG3R6LLyn1l-152-LvA'
    # This is a TRIAL token. It will be expired at 30/04/2021.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|e85934f453ff8745b631a2816e6b0c4847099954a7d724fa1f4697742933bf8a'
    # This is a TRIAL API key to use Amplia. It will expire at 30/04/2021.
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
