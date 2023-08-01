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
    REST_PKI_ACCESS_TOKEN='wQyVby8RtCQQQxq0Kw4Frbe5pJDXPRCrXeyVID39yE5n765g_WZFPrr4FKlb9b4pmPfYgZ9ho-5uAAXG7ikCcVMat2AVuTWCUnThX5izvr5M3qsyI2VIdBuGhRnr-Hv62oCf6hw7fz7FKiru5KI2AUJ8A7lJeQmKwCoiaxDVvaTHAo5Tw190K8MOEyJO17LapavNzjmLzyAUvkRUexjt_9zG6Hl1A0QZf_t3Ba-5UIC-ycBMNn4nJd86-48E51wPUVANNoV-bv9InQX7ILRbqB7OfR2McSD7yG5qpZRLLJY6sc1JXSn4PMhuprXpekxeNksJ6jlslBSpz60pZDttgulTTQgpPedZYph5sS_7gxRwaQ2VHeWrWCvxanS89t2HPTGIlkpuRev2HR3h8maZQuSzkdAnCiPQGeIutXf9LegR7bGFDuZ2NZvLJuIDgf38JAjBOFtP0CFcO5qplHEoAQ5zQ2HGWA9Ad_81SFXu6PB43zlekOEQQjE9kf4LDkDyzhHpog'
    # This is a TRIAL token. It will be expired at 30/09/2023.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|dbebe77f6a8fcd4d812b9fd46ed83176266fbd1adb3dd82edbaab2b7b75bf364'
    # This is a TRIAL API key to use Amplia. It will expire at 30/09/2023.
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
