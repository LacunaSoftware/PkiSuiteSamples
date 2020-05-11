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
    REST_PKI_ACCESS_TOKEN='lDCLovY8pwRh855mO-nbgZVlWWAny0q5RHZD6e6Ax4wpthscmWF6nfBswGO_JqoAYlvDX6ku8FaJcTstDF4WZadT28Ek7ohWvQoEug2WynuT9pfRNx5x6WgjLNDjZfvL3ASaei3FBc-raOiPOpGfEVMznO6bUMu1FlDPKl4qn1HcpuNv7FoRRHjXkFMFslrmgwEnzrVV3wvElHDE8W_UuMp0FKDKYXiiX11STghkLtONPiJNGcvypcnVfOD-Bpscvl3g2S_RFda81KHyqBjR4UffafqbyEvtbqiXr-OHCTwcd5v_562O298PAgRaaNtDiisjo-F5kFA79H46gp7QQVcq8VIUhPl7Y_fIkl-mDNvlAS6JoO1fMqzMihVAPQB-mUaUenw23QqRS62KhVW6VRqc0NUBuflhmP8YbTHE3dG8huQte4bPztDKO9RsKyN2ayIeA2OosxCATd-ZzALJCFinL-10O84Cxqv87oAyryk1qCAr1Mya6rLg3Vr3Xv3GXb1gaA'
    # This is a TRIAL token. It will be expired at 30/06/2019.
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
