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
    REST_PKI_ACCESS_TOKEN='6RXZ5Cz6Y1qThhktybAC3di1xVh-pWkIX2PQr25_ALBD1vQqdD7_w8ccduHDd2Ajq2qj5cRwyvnWllfyxdY-fxnHJf7Rna7EaX-9Aeq6oG1a8r1x4iSlaWaUzMNM2Cn38HaRTcJ5-cTA4pI70kexYYX_nYBDdFNUqH7b38c5dfW-qAj2x6IIrx-KUeuoFXZ6ln1mo70E-rT1F5_VYu0QyUzs_f0I6jJtPHeTl6YZ2H7SG9Xp0UuqZliQaS8Q5BMchZFRbzlM7ilSE2K9N8S807fsM7pfFKcegn1fbRDq_XjLrq5AwKcXrhGrwDTtAEcR25kn5Y-2Ef0v0LocJHHV8ZuL4ngOvpykDnQe4i8vcorvRjGWkAQaf58ZK0S54jGjEaMn8EgTaWjwMsdX2NwsEUP1jIzqbPA7iXnC6_iY2oMhUIZtl5nBtOxuFpfzP_h49ENfU-zLlbGrnMOHrq7gNjJRGtvTRHSD4Kaeuq5s4NQbPry4m5p7C8vJiRAolbhN6y-m3w'
    # This is a TRIAL token. It will be expired at 31/08/2023.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|330a3396472b5045827c21e2cf927e1c173c8fcc8b0452e992eab91b98e8ba16'
    # This is a TRIAL API key to use Amplia. It will expire at 31/08/2023.
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
