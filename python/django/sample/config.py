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
    REST_PKI_ACCESS_TOKEN='uT9CxxKrRFfCLvzjNwLIJZ6JCgbDs1982wYEFo87fHwC1_PwtaZIqkKvb4AWX_CAag1f-DJGn--oL8hSYy4ospgG5povjINEhS1wsdSAPhc8XqltzyYtdmNXhCfyFt7OzpKoqqMltKCR-R9i6VcMxl0GGPXTBB4X0hlqydI45fcV100N4eTcYCxd2O1u5GJ-bxiQdt75FTi6Wl2sjKKsG-qL3DjliF-uRDUuHIorLOEW774_am9lkNXEQz3gI9BWKxiv7bQOmOvVAUw3Y_Z6LLLdWx6aj3iU8xhVk2zWrD6AQNpREu07gFS4BvA0Ma2OuqJ438ClHtrTkV5BnCVTDD7ZyrUZSfSZLeCDg5fM9s-FWA-N-UIkg6eSjtyMUhgFN_YFU1-YX_Nd668foCjioU47WB_LL5FdbfpKSA3AYb8AYZGYxu3arKMMfoc2aq7I00G8glijwZXVVM5kC__K2vafnYrTwd8kksH4WxUd56uz9lFlANv2OqCYL2vID3xG2kARGg'
    # This is a TRIAL token. It will be expired at 31/12/2025.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|becf137552f17840ace15ee8b0261c9e5543cce8e9b69d1470a73a01475cc3c6'
    # This is a TRIAL API key to use Amplia. It will expire at 31/12/2025.
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
