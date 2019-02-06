class Config(object):
    DEBUG=False
    TESTING =False

    # Trust in Lacuna Test PKI (for development purposes only!)
    TRUST_LACUNA_TEST_ROOT=False

    # --------------------------------------------------------------------------
    # REST PKI
    # --------------------------------------------------------------------------

    # ========================================================
    #    >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
    # ========================================================
    REST_PKI_ACCESS_TOKEN='QPK_s7eVFFitenHh-6c5PBEk1nlssA5OQkbpyZWBnGEvG7cK3lTs4Toxs2STulwrRPORtJbT8m9V_hR_FTZTPUnzqgcWC4xmd7QYPJZIXBIw2HgsjTc6GAEL6N1TXSBLBNDz_FkwwnlKCk53YPBa4AAnWZBMfe5riah1F_BpinrxKGX1ewohIgxTHxzAeRtQcwRB8XW6yk9TR6GL7mK5ky0o2u00VnSgzrOLd8F0cuV44257dZlumMNTBkq2fBeAUWTGNo3Ydwgn5k5BYM2hfCdWDssiRv-GLyqxjo7t4brq2hUK6QBXisMXfZ4dSd_rRQvpVpa1cdS4KansOxanQX9M2fNU8Gmf6I22SwZ0c5wM9qlkv5Q-LZOYtakrkdqxY-lCUDog9goPCBQenSt128thFko3uFKdAyiZCiL5fTi9I-ZBGNbNB7rf6nACvlWAH_jkGpfSFnrarSbtzniVXI7wSf8ge4iCeP92HT9CNSbRkGnBYRl-ryr39nqz7--vYpJ6kw'
    # This is a TRIAL token. It will be expired at 01/04/2019.
    # If the REST PKI sample doesn't work, please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on a "on premises' installation of REST PKI,
    # fill the field below with the URL address of your REST PKI installation
    # (with the trailing '/' character).
    REST_PKI_ENDPOINT='https://pki.rest/'

    # --------------------------------------------------------------------------
    # PKI Express
    # --------------------------------------------------------------------------

    # List of custom trusted roots. In this sample, we will get the certificate
    # files on static/ folder.
    PKI_EXPRESS_TRUSTED_ROOTS=[]

    # Offline mode. Set this, if you want PKI Express to run on offline mode.
    # This mode is useful when there is no network available.
    PKI_EXPRESS_OFFLINE=False

    # --------------------------------------------------------------------------
    # Web PKI
    # --------------------------------------------------------------------------
    WEB_PKI_LICENSE=None

class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    DEBUG=True

    # THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!
    TRUST_LACUNA_TEST_ROOT=True

    # --------------------------------------------------------------------------
    # IMPORTANT NOTICE: in production code, you should use HTTPS to communicate
    # with REST PKI, otherwise your API access token, as well as the documents
    # you sign, will be sent to REST PKI unencrypted.
    # --------------------------------------------------------------------------
    REST_PKI_ENDPOINT='http://pki.rest/'

class TestingConfig(Config):
    TESTING=True