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
    REST_PKI_ACCESS_TOKEN='WwrdKm_H663zZ-QuoJ_Ca7NCMTePczGfhcdnzNJcxKxu__tQWqkcOJasWgyDFv0n92vU-g7vii5mVQvMjFKqighrV5KI8uzwlrx479uS9MqMU07L1fu3PKcQEBdLt5OwgZpCQKyKVdDIGrowrEfOafkDCVX4vViEfk2gh4yn727mdNlJaraAjtq_w3UsFfQnh5Gl4tVPLZR2DYP1R1ZCFhSuMHa6IOjtA5L3njbE7KsCr3YGvkmLMLkyvP8DNZT3bmKuOHKN2GuAY71_NuS5ywKBR2-ns_UShRwaMxhNeC38VRPfWHYMSCetslQ21Fkt-r_Ugwk9JpUESmOsJ-sfSbeYC23oYQJ5E3pdEZtSTkrvoeV-UfTF9hyPAa9qT_2K0leRyNcLjJXUzxcWTS_tGrwfhi_sXMSBNUgUNehUKJaPT93rndTmq8MK2f1X-l3slshCgYfYYp-8He44lJ3m1sYRdeu01RlSszBBcUtHf958Tmk5I2KkzMEXbG5G36ZbpeXGYQ'
    # This is a TRIAL token. It will be expired at 31/03/2024.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|78ee7719f5842d4fb018ac1590e1a903dc8dc55a8003eb131806ab1b0093d9a1'
    # This is a TRIAL API key to use Amplia. It will expire at 31/03/2024.
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
