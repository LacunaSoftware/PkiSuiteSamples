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
    REST_PKI_ACCESS_TOKEN='FfiUxjbt67LvNN8sEoULrQxKdTa5gH9RK6ubZV40vMm6OcZ2A6xj7N9uUpuaR66wXDVhIOwDLJ5BrG9VbecB9nqaNBh-qwP6JeI8c3G4PHLTXsOY5oLyTXcwtjWfZRPs71-43E98kG9NHljvwCC_3ytZZbdNUkk2cU-NaZvI_e9G7GXlgW3uRZKa3FFiHDedhn89sWcfAnZ_G-mnn8k_2eJ48bWVBexqzeOzPic7IJc1NsjtVP2evc7GPNZIepS7tRMMD87KR-YZNTzBnokLNZpSUTSYH8sM6FkBdnkgzcUt9QS-ZMt9ri9IEvJFLF9jG9mvUoucgd8QFFFoqWou4i7p-ihutqKqI3GTOXAAgVIiRJuANf6sCwOfiE7Eh3ldQoEN4fayL-ZBP1Qkr9WZvK_Va1PI-CKbpk1pcmIAlgTGamVmgqK8XOQ4wc8vmFax2h_ShZeUH6ozvkTUVTwOvcbDjZ6dYW4VGQ2A9xWiE4U7w1PtHqtTrwnfM84iGG9AW6b7HA'
    # This is a TRIAL token. It will be expired at 31/05/2024.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|297eeae9c0e396479965a2f031c24594f1ceb335823e6a571405e032cb2a4e31'
    # This is a TRIAL API key to use Amplia. It will expire at 31/05/2024.
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
