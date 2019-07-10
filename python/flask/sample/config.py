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
    REST_PKI_ACCESS_TOKEN='qCzaYvkfrNEuSPSZ08wDidgmg5MBGCjwU2-A0D8l0DOUaWOqR_OVfZhbSNJ44dthx8uF3Wekj-MlHiMaBabziwK87JpXJXwFAlY8v_ccAkBzVq21d_UBPD4ZZH7P71j-rsPfBSilLk6fpUpMWGB-OwUlnW6j6OIR3FX90VXW1WgN2OI8HfnFZjLF2U-nvJyO5yt4dab2cS9B9m821u5JFGLLvlukDU_xg1wquLkxFEJEBppw_ESQNuWSJnILe1UYcdMdHVF9D-322cLkr7BoV0ZqZ2PsfEkqm9IGAjmfZSddPVRocIdQ9c4lB4d-PThF9QYoOdMoFZXwHHgjrlIjazQ_KfsEd2VaUuuqQPnVpnGBKnafqQiNC9C6FypEpAcn643RV-pcO7iDMi8XjCRelDlCMxrS08Rh4arf4Y-19SUfIGqcJL66iH7Phzs5ME2tFly1yG8UNJ6bxjzNfPOTIRXyy9058KpHUPs39W3ydt5I3Fme2ptwtczYmqzbh-nwPZSWig'
    # This is a TRIAL token. It will be expired at 30/08/2019.
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
