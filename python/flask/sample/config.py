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
    REST_PKI_ACCESS_TOKEN='gE_5kzruE8mFH2JAZwuudl1j07a3KfNk1EhPv8SQ0fljtqsyNxROCeU9kLgJjdYEClZIv8nbNXnGj2Q4gWSDqLmPF0tctbwxYq_hTV8jwVPiTkEQcf8nu2UI6qVQ37cMkR3Ti-eYgmUkjsJCDy92DzlAoBXZi5_qDbd7hsYHmIw_bRpSU7nPtbfW5zM3gYwHcDK4XXCY3vowtiu9Knq6ZMOUk5s_aVPHOvsYkvrKYyZYyDEdpcDrbcvR9k-WygtqMGSb_mmE955zjivf-Nnk2y2Kx_56vBwmvTyl3gSOXcUAtntDA9M8NRgRfKqQUWfDjIYBj0hD7BFNLWYW9cN5J4zuGl5Jx_M9MHWPP8XF6pih_UdFyt9zIwhunthcKCku2X-TIO1eL1vShat0jO4mBkr_H7pHtA81y8ftGPVDGrg0QUUgo_-y8LEvIvrOenaa2VIJbadtQhT59-PLL_AOVsSWETpXp3Lpy9nw4PzPevKCEYQY87aj-kZKL9x6Vo0G5vBQEg'
    # This is a TRIAL token. It will be expired at 30/06/2025.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|bcde1b050e8fce4e95166eec602254ed85ac10c27134df64f63128649f9b9d9d'
    # This is a TRIAL API key to use Amplia. It will expire at 30/06/2025.
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
