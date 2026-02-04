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
    REST_PKI_ACCESS_TOKEN='uaWtaFA3BIioiduXVFGzcDfMqeZmr4bHppGeNuqQcycWY40tySeNzFxIBQzHvL9cnvV_-5q80BbkL2-ZsKTM3SfFmyNa7VHdhUx8l0fj7UiqpmtmPTJtmvSbhKt6nLX6edEcCSh8epA-IfMovaTkDzGeHtwOtZaJz2Yq2rlxmUTZBSHIadT0FhfuMvUD8ze5HFiEGrh34wkoBavrBbVPphSVwM2nQ11EupCYn_iWROpbFQPgCnqrZAmgTsIR7E48PKdy9BB645Fr_ZY1baojT3qoPBr6XDICea-GYx2emJmrmMCzJLi2iv3fbYdv0aVBCQdnkSFdsiNim5BHvix8RaHXXleNkintJqLVyhrCXGqC08GFA11XwctDvpzn-5ilVjb4ldBi6Fwinj3KepBv89hPsZZiDx7NULaA_se68wUB4_1k0Snde2WX1AuC_bZ3Ls3AYfgmgz_EYIiPG9AzKLhzmOMNapWoV5zroL2wEr7jxVzTD8CGWMxTgJltnoM6i6rONg'
    # This is a TRIAL token. It will be expired at 31/03/2026.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|39fad4b91c4cf943b35d51d6cef63dd106befd206d147ce0de271a1f3f592b41'
    # This is a TRIAL API key to use Amplia. It will expire at 31/03/2026.
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
