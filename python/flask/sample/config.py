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
    REST_PKI_ACCESS_TOKEN='zF1ozzyD_Vw67x3kKrdgbN9OjqgEvDrApbJogKtjfNxqvnQpS6jRfUPONGFhIZMDnLrR_Hp_vRWIk6LrzwrxLkOmGOFUyhTh2SC0FFCQuCE-Jv2KjL556IMOPxkQwncCxcFkQHdxVDpslFIezY29CGp0rWLCLXuPJp9EVkUlR48BofZE7J0XFvMx-TkZtg1bCsQWKdLtyMgQJxsLz1OQJ-XbPnWN-lEpp2tfJmSRQXLvIYnSAe5oSr-s89C6T_CmIYpZBRJsAjHYgky7Vk5lSDPZHs99F7NAoBZ8TdDUs7DenfTJ23ONmSqyHHPEKoXgqAb5-rQZ3S0YDDzAqPFwAJ84bXaHNMueDjvIWwgcIjfHvzEVf0RpvRvNirnUsDaMsy2ipgO_uT1npKnAuVAPV0tJM6Ci8jTmIVk4BBb_Ju6dxKJdpEyyCzDNFfokks2txcMSkpOAxQmlTJsqyIY8K8JRWULjujW4rjGNpFcr_QuY_919WKm-ouTzLoS8eUctnFIUcg'
    # This is a TRIAL token. It will be expired at 30/04/2019.
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