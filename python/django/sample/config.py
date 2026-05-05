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
    REST_PKI_ACCESS_TOKEN='1xH6I6YpLDvkmeVyxxYsMYyfJ1GW1fRVJtAKHVhLwM1ePfmhKqeBPBaouEQ6PADURuYG5UDkoNchSw2D6vziKp9FdYJxfm_LmNQ4OJFIUOxqq2iRBIkm2aHhMHRGzoDxVRYSwLuXeJ0mcxLYy5XRFiw8mYBdiSnr47RSz9aWTq5QZQ3tykWooywUlW-TW18m7GokZO8Rgl4JYFsyLwiuwBNjqmbRf2X8fA6P26ydLSaI5kCFOi-MksPmMtySbineMdq85rObC2hOcQZnTR-DCfcteTr7cd4rqxA0hqIKKl__XGFo52ebgc6etO97zyak2NN-hlitZwAa_IymsqBjuRraBSbAwOc63tIVx9sZL1vXKZ1RlVxBMNLDpyEjIFOu60uOk0yq5oECK0cNlFlcLt288eGTyMQFOAkMoH347IHuLSgPvem4BoLxSdL-l8W03UYICenJ5pB5t6IbYSJeNMhaU5Fda90PjoYOo6YzY9ORHqLLaw1Ulx3Lcbto23l4DQ9-3g'
    # This is a TRIAL token. It will be expired at 01/06/2026.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|7f2e800cfb03ae43bf3380099f30a517995687298eac2105a3230d54fa59ea22'
    # This is a TRIAL API key to use Amplia. It will expire at 01/06/2026.
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
