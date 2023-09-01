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
    REST_PKI_ACCESS_TOKEN='7Y75Ryx77N1CAADjIq2HNfNHlTzDJsNeuMOjO-9tuYG_alEtTD7SMHWxByIqR0JWYdPXC6K1KpWi3SPsTH-NQhLKPa3X9hbAW6TbrTrkmoAjUYhC_HEMYkD6x5Du7LlkMJUSDX30uA0wdihVnGwqEZt1iPaB4Uh7dnBfFtQ3j2wjFhDiKxMlYz_IeC6haoYv7cCk783GHp43LFvxVt3CNWw22So8B6IjvBhHmor3tqEVXHBV10_Ro0fVNwyJXSV4UksSHaL23FeQPE6DRXHplDVHl3PneXluPOoZgU8YLt0xkyRbAYmQptj2uce5U4TabJdynVZtkgRF8pk1j2Mob0priNWQ1MqhebdxVM5aZjkLFBt5C_IEKVga-rxmrJOORKXui4RTFAUITma-xr2Z9ezJcypZxHU8vjHvY6HYDNZA7vr40334-5EmD-nXNkxu4tnBfBi2D4Q1d2ntA8gPCgjUvFDFkEiM2YIX5MF2eVULjWexJALwfAmlEMkvEIN0pa4puQ'
    # This is a TRIAL token. It will be expired at 31/10/2023.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|774cd7dbd92b684fa97b51752659e2057a159ef2e207311f23d2cd723294ebee'
    # This is a TRIAL API key to use Amplia. It will expire at 31/10/2023.
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
