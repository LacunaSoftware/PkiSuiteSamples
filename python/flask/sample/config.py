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
    REST_PKI_ACCESS_TOKEN='uU1UuI0FI0AHdi7NVJl-V610axh3927Db__VRxrE_0kJAOLqmL7ZXxP2k2JQbTZe5qHQYzleo72zbAzhSbWvEc1ftVpb6zEbkARz4VR_xetjCWplHTNlMhTl9LRHQjlE-z5kv84WZ3HqYGhUmQ2tC6CuxeV2aE23Rf8XQlVTY3Q2cP_MY8PnGJmmAtW__Eu7Oa04M9WweZgYC4udxJkPJJxUKcJkycELWV-ntJYnk8BbjSVvUdH7Ods5khAc2vwSkwLzMWlWensk0HTcx5bXxusGEpV2DYrwYuU4uJWKgTqY6lHG7Nmi43wXeB3JEwkrf-L6KApiqteBuBeQlabh4jXJQV39KnbgRvAU5TwghmOPeTn2cqnQfqDjkY5GZS0Hca98pXLgBvkFjzG6XR7k5XhIqo1CsFkMWu2tQSxnEBSKnUu_POQx7p2jaYFZCi0trH1rKj7vjBTTJu006LlzhHUepfk56t_fk_q9bcPVIJydgbwwJRcSrM0SSIcjQsBk9fs0Yg'
    # This is a TRIAL token. It will be expired at 31/12/2024.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|9d8dbf5046fa4448914c72e557c4fd7a6864dc049c1854177282796f2152be78'
    # This is a TRIAL API key to use Amplia. It will expire at 31/12/2024.
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
