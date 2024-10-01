class Config(object):
    DEBUG = False
    TESTING = False

    # Trust in Lacuna Test PKI (for development purposes only!)
    TRUST_LACUNA_TEST_ROOT = True

    # --------------------------------------------------------------------------
    # REST PKI
    # --------------------------------------------------------------------------

    # ========================================================
    #    >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
    # ========================================================
    REST_PKI_ACCESS_TOKEN='Gz9nKOpmwWzA3nMQX8d4CuXOfPirK9gPkdXCSR6kvXqDCfNERH0rsy8kzahiSJWFSC1W4ntWYy6FcXh7hpp2pWO9NN60-CcRHvaCjlEIQpt13WAbrMYvGCDgJLmzK2PB5m41BCaOob2oTc-rz3awRcxiDFWApwjq91_RTqROnRYY2GTSoZcCr4Lu2X5Jvn8AkEszuOx-XPOTlFfDOXYQPOc9uacv1y7EDAzjZryUgTMbGORY2mH-JAw9wE-MHnDxfzR9X4l9KT4Kgedl9fiFj5EE30VtCBcU0ThF4xYhsazRv190rw9hyX9r9fQWzi97BIsRetXS9vZhYyc8w8kC7Q_LXuh4IvGSVL-eLZ8hUmITDyWxHyy3uEeFu6TxAg9FNcdrnmNSwGbO6uyd2iv36AbBxG2AEQviucMtX9uJPtebSx_jM33D6kEDPI_GWjsKVJBV9VkXejQs_F4bMXZ0b-JDTCPkB8KO7A8z5Fc424qENC2OcKVIk3R9HNETryDBnMFU3w'
    # This is a TRIAL token. It will be expired at 30/11/2024.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|75a8451c3f71b34396b10c9b2a7629af219efbeb0fdcac52e1e3b148eb380c20'
    # This is a TRIAL API key to use Amplia. It will expire at 30/11/2024.
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
