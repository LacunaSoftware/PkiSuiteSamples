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
    REST_PKI_ACCESS_TOKEN='mlUvIL-kRUclDo86QBG22W8KWhdQcZzuqnjemEmyFD4zrqMiL_swVH9GL5criPhMB9zjps8qko_63E61IuGTEG51gQd65wJVblf_ldYhQsGFhBhj3KV5EqTmtL8uAwD0SWJ2sqiqJK5Fbln2n5vMscaSPDvNqpXymxClWARLp_mO86P43z7IluyOZPKycJJW1fxmAppVBxWDzga_ctZOn6x0zzA2DIJWGsVM00Tds45-qlye6uY1BTgnx2i7lGMeFvaagN3aVB6p5j2Tted5OQDgCpiAC19osq_ybVN9N8MysNjhRzRftu_LZpU35BkLc736r1NJRbISuH-c5Y0upDIOZSTtmicXYTVtWBP9E2bWZmCkeFcWdCDLy-B8y2boFgsX-mFvgQmLIxaZYH9qE4jcjvTFcGZZ_n60dZE_R4ViHi8-VI_ORBT6YrCwwWESqP3SuiY1l8l39jR7XMEKQbxTaXc7f42NZZp664Heb_TGuyOogMmWb7zJLCRTsTUt0Us6Fw'
    # This is a TRIAL token. It will be expired at 31/01/2021.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|6ad0c0c4a610b540bcf7dd4187ea1ee83f189c6d347ed6de74daca6ca3c70335'
    # This is a TRIAL API key to use Amplia. It will expire at 31/01/2021.
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
