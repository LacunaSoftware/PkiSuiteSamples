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
    REST_PKI_ACCESS_TOKEN='SX8qcIl0WorZg-hfm9dfUnith0u4gFihHbg0Tgqmw3KHKny3aamG9VQv1WYaAEyndZs2en57Nx6S2rwdP4Cf4kHztpojMnR9-Z5SPuL9QkytKdFa_18CmbQvpMtuQPQkdsb-Ln9RA8xckZChdtUOgRFBWT8b0vriAG_CANyPhESRVAzUTWorADNGGuPbNhilxXzXpGSBEo5l26pXGL67UgMQY8zvcs3cxxCxbR3Cb6UZTRfayAv6arsvYInPErmB_tyFbWKuIwKSEHbMeOcBfnrazAdHRLikMvdPeV8FDqZEuWXLMMnFhXZZlIyMvQJPPF2stnLSy6n6Ks82gXEWmP74NgFpMYzXb9qeCVz03gGCtUgBG6UsiZZzK0kzEJ5VxXnW0dqIEzOyj7GIrdJgz4wrbqs5DTRaC2V0aw-KhvTF8gFh03cQVdskaLNEWz_7PydXWIGljUGvB41_iR76Mno1T-ns30nDLqawIXZQrqzBG53fcEiGz7I5_PtciFnQSi15bg'
    # This is a TRIAL token. It will be expired at 31/01/2026.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|5a24add90510b142a7dfc7587f08ab90926472fa11af45aa4355f28fec5ad28b'
    # This is a TRIAL API key to use Amplia. It will expire at 31/01/2026.
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
