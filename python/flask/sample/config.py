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
    REST_PKI_ACCESS_TOKEN='0IYXNpevGWB_5BNxDAVtZQ3-Jp8tNTVDZ9L5jNYJLnadW0Xon6HCibbHCWFyTlR1AHXxA_z_ItAz9t0DtjivOt7ON-ERljXukzWIiMftcJJuGrLijsL-kr2ciPMA2xCOtG9OZEAwQQPwOBMaf78Yq0XRkHZ0ceoQuISIZoX740wXiRFDBh2DKZhf6E5DEnQXSZj_KoaPx5h9KzbTyeAdVyJu6lZqy_iEnIecae1p5WLQqxR1NU2tXc8fuvAuE4EQ_KXlbSjuiyVHVRTe-NTuNUycJb_sQ5jW51rNoxDCgcrIa_pcnUdmqWsYugOHRLegTFmNyo7dJPsKDmQyQ3C391VNv9j9LtncJOiexkWlDgxaGs2159cButhSwvUxRMAjNRiF7uzUIe2h1Lvo6-5QY6NidbPd7Zo4IzcWiWkAGhgEtkuvEpH04qhIT8GJ2Wk8Na_1IW0CbVCSghu8a_IpWF-AM1oN0xzUq999418Mhv_naeen81JS0X3eEZOCWlpaTz9YcA'
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
