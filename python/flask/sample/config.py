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
    REST_PKI_ACCESS_TOKEN='pbmcD4VtHBhiVTSPf5V4wPJJFge8PBeGQhHD3rgt-iXCO-efjXA8_qs9BK55kW4U0hDqfohMcc3XlrC4WxVmb9WLc0FMSwlCMkrHypqO3ISuF5NaK8P93FpREnRLVqX_PEcUxcZCbzu5Z6cR9rzPcm_-zG-QTGcMJ_fLBIQGqm97bZnLiurMB9mI7CnRjHJB7fVH9pfr3YOS8JzQXjnzQb05Z2Trbx-CxYC79pEzrieHsiceRHNeSi9MeutkelGXzneO3YQGujsqcLa9SkT3afM63WBv0LVEbEd5HNA05j8-Yx-22p7fC0vD2srHHygdTXspqwMbCtFkjt4mEGdO2ZSKSO0WwDSPc4egoLmiMizhckAtvLvgGPCfW4bZ28k4Vd9gXZwUdIA-MFGir_lfo8oP9f10N6Wr74DSNu6MeKF-ZOShaTJCxiv2i_CEMN4nFy2OjilAeFz-PQdQPIGXvLioklptYPeJS9gKeU1fY1PtkciXX0cxmhxWRu0RtJKcXK7Wxw'
    # This is a TRIAL token. It will be expired at 30/11/2021.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|547c90da4bbbfc4b99909e937ced4f50950b5d3a0ea78bad34466342a84a5d2d'
    # This is a TRIAL API key to use Amplia. It will expire at 30/11/2021.
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
