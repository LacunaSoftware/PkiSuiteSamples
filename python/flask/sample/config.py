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
    REST_PKI_ACCESS_TOKEN='_R5vcAVgl1ISp3-rOjJ5HDAzuQnnGDWoVJonKeq_wzLjYecaXL9yHY3ylms_iG-rk2nR1uQ2BoZnEV7o6aPZPoqOi3-Ddn5AL6BQpyoC-uvK9LGhm5ISR1qlstGtlVKWMyr5O-yZDzkNzDR-5rqx76mhBrQ1-oLKzXkM9Rw6D07s-HAKY81241lldK398vnae1RdPRQZiq2LOkW_wBvP0hdlaV1jcaqiw1L7thWb5FqN2j-lTuzshSMEuR-JaMcKa6djvTsECrLh9Krl8MiGKmTjfI8ZoRf2bQPIDDLFKL11ZeZHOTlGF9n533hWSLIMik_6M5LUFAmlWUu8yKTqNHwWjYo9gAlqjyGxaduijfWmh7dqvYjnRH7Yy64SpdV1s1eVlcdVC8VnYD2bOQwbE20zeBikuMN_Nr6Im6t0vz2-leSHmB64OVLMBlpTCW0IrxApOBt6VMe1FedPpkuoXeChGsLoEp8NCR0xJg4td9bhHaT1catpe1VA76u_8DOL2f_RSQ'
    # This is a TRIAL token. It will be expired at 31/07/2026.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|623ac767c466414893d3d03e2988cfa514cca0f75c60a2f8bca2f1250bd35307'
    # This is a TRIAL API key to use Amplia. It will expire at 31/07/2026.
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
