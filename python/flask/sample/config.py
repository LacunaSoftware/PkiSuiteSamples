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
    REST_PKI_ACCESS_TOKEN='AxAAi2WCn/4pfkW7OdAnb19JahEAUEtJIFN1aXRlIFNhbXBsZXMIAACQdcY7OtgICAAAuPgVtmXYCAAAAAAAAAQAfwAAAAABZTaBXQKUcZxT4ATV37uSHkg+n+XJ2XSxDVXkgQrKsN3B79g2IyeLr4iQwOW6ECs/cY+Sybre212JPf7A7hj72MC9gA06X+k7CpKqRV2MENtKk/4bnc9NDPiVRVzybHYtAO5PadB5ANfW4Ay66Bzv+TecPRsYMW1vRtG8QQI2BUazmfzSyRrRb7Wa9f6HKb3tnlUjdh/y+C5Oyx6r4nl3O6JX1d/hp7KaAPRlVI6/fvMZR8BATdiFQWTe4xikXfx3sDyGmJGthxHsYvWVVkxxa905OUyzccuMEFOPgmCSDT2JPvm5Jz2lE+nKKSFm6HfyFggtd1jxwR0FpKHpDXa+pA=='
    # This is a TRIAL token. It will be expired at 30/09/2020.
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
