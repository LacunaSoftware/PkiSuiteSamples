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
    REST_PKI_ACCESS_TOKEN='WUQCtCiUrKGLs1z6DBcBUrMw0WySo7lQg1TqYohvUb5-kWtqMFoW_eXnWObKVgmhUtfo2CsJEoDZmk5Xc4rQ67XYFLkZCsC_hduCprpb9_edtJDInmOMRk9wJb3TfwQnmYpfFXAuDKZbLzxCl-ng2Qu6RrP0UiYrzrRaN2trbnCNM4rBhR3h-EyQDIKiz1b_sVo4htP5Gr3RYDfSH6uGTmm-2jQksI4tieI6sC7ePNuODlE20vMCb58eBgLZcWxih0uTXLcISw8s5-6WwFESMAqD7PxsJE1Zh0I99Bt4TcBPAkGtl2v8mTE_mcCewrhodHQykweArVdOVOqyr2YPkpkTa9WLm6wcximlvFp776817vNsG5W0haWWji6Byvo5wR1XJHgGcZ-lNpUyLjvvhv1j2b1gIvoBwZk2ZZzFxASqpc4FHtvvvF6bxgoNWyEjt628uIYV00gPzLu6IFOTCe3bzvHGY07JdyWoHUM_DeLm1a0hlLzOfs2Yge8QlP2Br0xDxA'
    # This is a TRIAL token. It will be expired at 30/09/2024.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|621c62f21078da45aed0dc2ef21593456f1cd2470ba5634cfa8e01bb8180522c'
    # This is a TRIAL API key to use Amplia. It will expire at 30/09/2024.
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
