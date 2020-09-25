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
    REST_PKI_ACCESS_TOKEN='BCa6BKmqEDj5qokS3yXL1bGV3Z28_DSA0eyekzN0a2mAHFP3jFmM_QCvi17vhjOgeWTmAWXr06YepZnnlL4W7MBPQ_44KXB_pjhmiSx-61Z0kzB7u8r50Ij388LcLk-ZgkBqYEp5ZecDcD-ItDbxf1VQg6qcrR9RR9_pKMd00VBs94h9SBvPp__TYzc9Ailzh4VMT6PYxpro9iv4cR12PkdESPGPEZFMyz_FgGvsAclTCYMu4mT724J4O9nVxEzpfLO6EZn6hk76Us163ObFCNG-DUYXll-poBe5j5ppN6IzA5xzx8ecemfVyy6KwdhTMUdLjULYRmGi7KpKp7neqNsKUZoPPsY3BPQLFPQtmobr22mX1ALewBJ1ZGZLtxNRyGKITB-2QUirm6dg0R9M_Gb1fdkHL3hyx2uinUhNIsZD9x15EJHvgx7xIeJWe6uw8uAslusZpNKE4fIW8C1zhf1C3x9JjSZ1cnVzFXXRqnShrdIFvvu6I1orur5NMKmGDuFhCQ'
    # This is a TRIAL token. It will be expired at 31/10/2020.
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
