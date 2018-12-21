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
    REST_PKI_ACCESS_TOKEN='9MZRcEcYpebYou5C86j_X18eHUpitOnu4Loh98KchIH0g7yuo6oufMvFoUxcIWeFELRB4ve81PThXNXz5z_ls8Ei7vb9ie6zzHyHow_I7ZNJQUSSIhGeJHQvhrXMca4C6ufOywfm-DkeOpLA8QVnzK594REZOiIPiWd6krleY2avwLHdwkAeJLSSjvR3znSCxLkZYOdPEFdyPf6IPYYd61UcpjLi3T0GzYEpH_8vq1G3OQOl4PDQOrAgAyhr3xVf2AP2pxgo5Td1uWQ0QRkVcun6UgdIvIHq1OaABXA1YWLat0SywpsIK_njFcaR2IatNVE5J1oZjcawuiXthqzP2p7FievHT6T4yYjuOhQvzRx_2XtJiPpszeg3_dkkEs4Z5aDx97yr1QYpKkn8zPh9-puGgnqD2XIAMOMnLckOVDZJhG8jWMtz-JnYut5pZWM49X0s2XALXjvahWv718w806OPnLYq_fm25wzloizaR56ktPq8fWbITAcSQqVIY7XK3Rg5gQ'
    # This is a TRIAL token. It will be expired at 01/03/2019.
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