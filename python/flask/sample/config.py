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
    REST_PKI_ACCESS_TOKEN='so8X9JmE7zvHXy__MwY1aTVVN9ZfgJWottK7v5yXBGMV0wFyr4OJPsXov64rR-thwf8IVwJKhBrv9X51v1ebTHnFEg9i-Ai6-XqrCGwAsu0L5nGoqpBiLzSWw0nxOVbc8nsy9XclsyKQSsgCbsxvMiyTO-_KqD5lFo0IZRdXSQ-iqyXoKWXaVz9tUCCCDX7YNAQ5FlhIiW31QZKitZbnKi5aJQzQl5n-tEAtqIfbXDXwQLeMWtDpc2wk82yxaKtur41Jp4J0LjZyvAxMSCdaPn005b9AGhCdHrFJys5pwHJQZyd4i-r7YKUWYAStwNbxZnL_S41TtMR8ZyvqQpw9SLAVXNjLII8EkojkfUq23ey1h4kdCMGAGrZQcbaNUAvcGmyWNFD0INcrzN4PQ4VmRO8HqZW5AzqOGZP--gFA7JnYTbqXZ3MNc1ygpNf7-yciaqFHvMYl5dkhVhHJA_4zkNHOWC3V97HwzGgdE13GNPUOa4Iel49Am8TIZgpmdP-zIQHR_Q'
    # This is a TRIAL token. It will be expired at 30/06/2023.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|aa5151b62a2b364a921ce9129a8b9e18f74e9ee295ea54dd423e0c7fed3ddf33'
    # This is a TRIAL API key to use Amplia. It will expire at 30/06/2023.
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
