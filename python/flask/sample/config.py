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
    REST_PKI_ACCESS_TOKEN='ftCmcHGLdSk_6r7T46fGugFvHSLwPljry7wYRSVYA2LNSKUzbNkw6iHp_VxWH513738Tb_sJ0oAF_nJbV8upWuQG4ndbhk-kLJCwahmlAJg-_r9WUuSE5iF1p5sctLe-WoCO3M9py2j2wOjjzaokWTsuAbRkTRygKTADesP5sopwhQUvrO71U_wQM4C_ZOwz36yYQ9ywfiww60AzPoCfDnOcGJgGd3Bchy-bfz7XUNBPEgERhiu2RfRHz_0Akb6DiC9p7G26v4d0aRd_oNPY2pCr5q2SUD6qL9lWpRuD2O16f0vn-3CPagXtW_fBo281yVXDuRLmsMmdiwDWK060iLN31gOkK0PalqA527ivRFc4wDu9ZwhIibExV5gRFKiY-Ld_lFaJ_ykHi6MsmyyDaCMiIRrQ-tt6qoA2yx73U855Wsoj0qkf0TWQo5qH5jJqRdpdBdjMmVjXzyBimDhqSt7W738XeeRioCF7tno3BhBNBhXmboJBtOGZ0D9dRG6TnorOeg'
    # This is a TRIAL token. It will be expired at 31/12/2019.
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
