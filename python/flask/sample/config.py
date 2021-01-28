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
    REST_PKI_ACCESS_TOKEN='mMSYnnHBv16Ot9wnyxvWnP0DvWU7EBocqgkFmLKLJJP-AxXg4v2Y8zRUq_cwjHSZ3limpYAWoanT8_24Bg6tLs90_Pw61ikaew-IFVPBa_aFb_GRMuUPxoNtzujyy_Jd8s5vFWGgPE_0PLrsuLmJ-DKQPD15TWYZOyjdt6xTAq1SBUtdvzGjzpsxvTJXxGl7tgTpqO2L9_4AG2K2WR1AR3s4xHhKbeL3TKDZEAXmjCQ2CtmCBeALQdR8oQ1Jf_ypPg5_Ssxrs223TSN4vEo4iD2hxd9ydEl7vEKuj6PUA71XWThWLOiP6p-PRI-piW1E5tBJ_z4IlE47SogmgHQE_vereiKCDxbsjrAxQXWxzMheHpS6o3tJbP5M4NjtdKhtOa083X9L9QNfLw8O0zrczMeO3HAvR8dC9SDnot7b6am1JRtdpFSCgkSq7RtFyTDX2G7o15uJXeYqGfQDWFkqiKbPRXEbG_y-vLHG-OaZU3hDNvf9wuLCatDm6dgEF51InMHkBw'
    # This is a TRIAL token. It will be expired at 31/03/2021.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|3dbde2afd93c2d4392c8e16ae03e37aab050ed9b08b81b517beaf6a3d56dc2a0'
    # This is a TRIAL API key to use Amplia. It will expire at 31/03/2021.
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
