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
    REST_PKI_ACCESS_TOKEN='tLPpp5bbW9BQcKhm5uHi4GeMWS2iFIfv-X5nDAcraGd3_1zrskuZ7oa2VA5YqypADkMHSKFtxEUT6_0PTNwa6Ur6Y--8OwXO9EQI_qj3d3jNYE5mpdAvt5zNEN61QJsQqvJRoNic41mzAILXm3qnGDyQzB5-FL5LGhpYWzwOWfvpUbddDZFOLNmn620JVURmEIi_VR-62rSoQGT9MTZGJoZ_KC9dsUutL_AU8uJDM3XBQO0r2nKWZ1FveNK9nbowUEDiSjC41VlUSs90eceqLd71NBzbZ6QrruI3zX-W6pjn9I0sRRadDLOFqNQS2LuS2vbrbTf1B0GXEuADGr4BQCY7oo7bPvdlmLzJ1POcGOtQJ-R75pz4gR9tDMdD3Y6yG2HOdY01eaMb6ooIDKuAZB65ohftluhbixpcti07trRajhvcwER7E1hPdn9xYlTmnfoXrSS6ivR4dWd2_zB3IrTlTO8ycfCKd2fI-5od01MtsK6YbJdV3ntGQP72xurP8KVcbQ'
    # This is a TRIAL token. It will be expired at 30/09/2026.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|7084ea12b971234e83bc139c835f7c03a5ee0484259e010bddb900fee518611c'
    # This is a TRIAL API key to use Amplia. It will expire at 30/09/2026.
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
