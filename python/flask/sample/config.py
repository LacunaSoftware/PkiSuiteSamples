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
    REST_PKI_ACCESS_TOKEN='0r1aAYYJhLaSJ93fphOrvFMKHNR_ivw9tIujNrl6_KEgSUHBrnTAey1sIHMWBjVBsGnoY7GHOOQwDxI98sTmEcD0qCquk5Ci7xf-GmI0XUzUQM3jDcqzn5pvdDjhQ4IlOh1xOf8K4G2vRbU3AVNQSu60Fmv4Zy63lkY-UMZ_zlB0bKJVD4sELSugHZhNnAEyTcVwqPKCbqv3gc-YukPcWv9Sp65woPXT1sg-8tzXIhi8kqofr22UWfzMtPMXooCWRI2QYGuta-psXlDzxpZNS6jRQ0T_qSk5NG2JlB9MIfBLm7Qn6yUasYizryxEg_km9FF6CZjwKZiczKts_taGl5Z14J--bGKVybvY7OxZqNDbAd1VTyKUZBULOonHuVmECBm2YJla6ek8IC2pTSqTEKpuEcXLVNjoGEV0de_4zo3LM46CozYSDBxvym0bPCdKV3sr_GU-tB1PDa6GOlcTP6IpiBchOiWsqnlM2Kvnj-Cgzm2Larkn8eWbahGZUdCCTiXFXg'
    # This is a TRIAL token. It will be expired at 31/05/2019.
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
