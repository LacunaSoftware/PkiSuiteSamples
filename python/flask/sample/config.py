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
    REST_PKI_ACCESS_TOKEN='p-wmO405fqTQhNljcIgs3LZ2tI6nQ3lWnoI-1u6Pz5mg61AclBFdiyWutxYSDF5YBhe6WcYI1gJbwvaJ6NQSLl8qVYt48n-oLjJDQzo4KlB15wPqPr3PeblkgubxI-JOEaJfTsnQeNW6bS6Pl5oXq64cH2nUPl0lzjKBw6S9i7VGRWgw_gli_aB8NAG3opJG2FhoosyjRy00xZylnD8LzsX-FlWbMPd_IRLp9f1u8unRSIYhu1_m7cfpXeYe15XenFXvGW07pwvcImKcbhsJJhi4mWFYr8WlHIjPnFPoJssmPkx0W-uDP9m67t-9gIbb3h5aNV4jsrRDTwZwtNU9sMpVCrsDKrolXOE1hSVbtOXdkxxY-GNrUEDbXBd3aiJcM9SJy-tz2HuqdkEj_7FYGAOGjyLuIwtufyltnLVHsU-Eh33bHBvTlXbJaO-3Xi1YTac5s0if7jG3zmxtWnp-TthLK90uHaZB6suqzVokQIeG1fDsmX6akgQb05my80JjoXyUqA'
    # This is a TRIAL token. It will be expired at 31/12/2020.
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
