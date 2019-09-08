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
    REST_PKI_ACCESS_TOKEN='EgHO0LNnl8P8eYlE3gaXX32iiX7WxQ-rcuVv2piMtnwYLXvn6ENIYJzSpJ9k1J1y5nmaAhgPaaax3M1KYk1jCBHaqN8Lv7ip6jnvbTucDRZ-U-a99x-L1SBqVheeT_jTWvIWhGI5RPTXRa2NMxlCM7StaWOvYHWIykSJaM9dM8lgB1rzW_XR-NbPxKSIyk3Wp1k0Piw8KGEz2XrkKEfjElzSNmuTFd-FU4ltZUFtn8LL6tKaGE0iyC14PNk5maSmRKFWrN_LpFvzF7yoZLad5Z640diJHTpkYZ--O10CFScI1LvpMUXhAj60eeTnniq24vwkOwlD79DBwNrhWxKuQHWPpRq-ooxT0fO4iS3UySzh1EaNm8zjdDwvmL985fbFjuDDCLEHhenF_2g_YEB5CCJLq3_dSOsq1SwsoezqRidGGkG3mMpcCkAYibGvtUeRLt6RiEyUPSP80GgO5-Y2Rs-oE-GFirvrZ40LSjNAbvSJO0JZ5wudH586B1ZDtfHqPiWgBcWgATG3jKjWCieM_tk5VHY'
    # This is a TRIAL token. It will be expired at 31/10/2019.
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
