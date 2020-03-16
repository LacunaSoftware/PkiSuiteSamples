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
    REST_PKI_ACCESS_TOKEN='Ox-B93JLP0lC1oMIf4r1suSzFARy2iZzAg3jJAJ-uH_UsdFv97B4K4rrpOAGRPZgu64JCchz6e6lYAq4WgUlZF1QDspoQJn3iWfltSZ5_xB3GYgvZT_0CZ87ieKA6uwzBWePwCimRma__FDH3b6IZujmkppqrBBJmyOT5HBwTKo69zRfgiF-4mosXA49LaQM-OUir_RzbocM1Ujtasee4raMgNlvj79VR_suEWJ8JdI_Jz5bq0Obh4LaOuS41HtD6pbrH8oocYIyPjl_MUazuf2pcwxIV-ArSWWgq0JKnYHqXOXcTCD0Kg-xQuNdB3-LJyYq8W-gFbEmprTCcaYN-diITgjP1UT7EhxnPbBVaBj5L6iwgmyQHh23qqbkRD3-iwB-tvnSOMUkp-peTmfHn2BTh9OUn_fzvSi0xZev0MjLK_bwBa-CXoyjVf7mqdbYfYZrsHK3hvkk-h9cX0xl8mmkq1ecqKGMqFrbxQa0YJQsHXRWwquoP0eKbNYXWnIoEXfcBA'
    # This is a TRIAL token. It will be expired at 30/04/2019.
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
