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
    REST_PKI_ACCESS_TOKEN='XqPlETa0uX6za3eFS8NqPjo0g1BGdlObRggziOD4Y_9RJtiYI14J3_G1Rl9TY1gLiO_afCXl6Gh7q399gNrRjlpTlJlMyw1QYXnvf1moxcUpEIjsMFwxcYgvPBA0XEqKhtKiLLfZrfa2Oi1iVntxnCtX1iOUKfo10kxPrEmN3CYaYcksVdSXfZVAKGmybS3dVbOky3JX__sL8K7cbdawlMGGf8D8XVc-Y21DNUQe6wXgb8CL9bWZRlgMvWmxuagJhQbkjhgG78OmnLTDmH5TDv8Baq4BckXkk6lw6T4mnpcbuYvN0CZqNfWVenQiAIQZG486XLMlYKXrcjLAGPj4bCGEKI3_NCJtl80ZYeeSydGcMTFA2GYndzE8sHlUQtWYKS-b_ibN9NSdnweS63_QJ_Fvn7mdM-DRpfln7nSo8_JFv-gbmsTYSlA9uSdDP5wtmU2qMfqu9A6kF7XKwPyMBpYOydc5Cm-kbkbFzt5nINWsfHlUw3N1FEHv_uoedOoU0-t6_w'
    # This is a TRIAL token. It will be expired at 30/06/2019.
    # If the REST PKI sample doesn't work, please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on a "on premises' installation of REST PKI,
    # fill the field below with the URL address of your REST PKI installation
    # (with the trailing '/' character).
    REST_PKI_ENDPOINT = 'https://pki.rest/'

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
