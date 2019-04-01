class Config(object):
    DEBUG=False
    TESTING =False

    # Trust in Lacuna Test PKI (for development purposes only!)
    TRUST_LACUNA_TEST_ROOT=False

    # --------------------------------------------------------------------------
    # REST PKI
    # --------------------------------------------------------------------------

    # ========================================================
    #    >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
    # ========================================================
    REST_PKI_ACCESS_TOKEN='9nusF9Wh-lTYsVRbhkgjYwMqrz6nfZQzrJmcU8nQMapctnql8GUh4KA56YCnm_Ff-VKelhD3tE9zXfUzKOn1yL3h3h7uz-Vq0Eu2sb9rl393Vd53LuP5Hoza7cOlCMMJa598yu-bc9zPwU_sH81sn6T-vKSpBjdvXM16rk--im3RTA5brTHy1ggCO_oavmVUqn1zb6H6St13M8B0FdflSNxeRD6ThcABKeDFQhKqrgAGGLZrsoZDXh-hleatUzMp0kALb_f9VKVDwt4QGEoMS14bT4hbU9hY4kaGdaHsAE8Zio6Ja5LSIIKIkqIID-i-5vEg4R9cjrZ7tFaM5MwKVlvETRDqHUlK30HjzA4ngLwSSRYKtKYFFa1PRBJ9l6aU7J9MUlxogk1URxV0oveC83bI_oWVvB1Wzd1gUFPGpHILINNRkzfafabl5V--zReEoF-wDbo6KewBBU9nF6-UaFEGK-3ZkQ2Fa8K9KYMJGrW7ylTwPIpojBWBHzlyXO5X-jjF-A'
    # This is a TRIAL token. It will be expired at 30/05/2019.
    # If the REST PKI sample doesn't work, please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on a "on premises' installation of REST PKI,
    # fill the field below with the URL address of your REST PKI installation
    # (with the trailing '/' character).
    REST_PKI_ENDPOINT='https://pki.rest/'

    # --------------------------------------------------------------------------
    # PKI Express
    # --------------------------------------------------------------------------

    # List of custom trusted roots. In this sample, we will get the certificate
    # files on static/ folder.
    PKI_EXPRESS_TRUSTED_ROOTS=[]

    # Offline mode. Set this, if you want PKI Express to run on offline mode.
    # This mode is useful when there is no network available.
    PKI_EXPRESS_OFFLINE=False

    # --------------------------------------------------------------------------
    # Web PKI
    # --------------------------------------------------------------------------
    WEB_PKI_LICENSE=None

class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    DEBUG=True

    # THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!
    TRUST_LACUNA_TEST_ROOT=True

    # --------------------------------------------------------------------------
    # IMPORTANT NOTICE: in production code, you should use HTTPS to communicate
    # with REST PKI, otherwise your API access token, as well as the documents
    # you sign, will be sent to REST PKI unencrypted.
    # --------------------------------------------------------------------------
    REST_PKI_ENDPOINT='http://pki.rest/'

class TestingConfig(Config):
    TESTING=True