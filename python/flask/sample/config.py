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
    REST_PKI_ACCESS_TOKEN='V6V19GddqPJPGSyXNEB-uINnDX4z2IW0Iao9izlxIJ9S_y1KjciY4DXJTvj0BQPHjsYdvtgsJCFlmtEbWvuGDZ3X5Bw57JWG3kTDBU6U2yBDr-37tkDvs6oMTQNKkfkx-Sx9vz6_XPB9tyKcDAOK7YPHdvwNl8ixaWPUcnonn-etvbsGCngnOd8VIo-KPvZuzS3L76pMNbIDBwA3cvMUn97m_Nw0KMRhI1BIdy1qE_jjFuBU1yCiQvwXvZp5XOn_mtVPaPJvtfmvQcT8AsOSMF7wrCJBDW5HQL1uEG96yoUKrqe6SYbB60VudJzf-gFLDn_ZvSAJK3sGciQo_aOOQrX4IievfU_VuzCDlJoh71Y23CBsNUFrhYpJpqWaViswh0DCKqW6rCrsY1n_1XJUCn5qOiHl5Tj7QfsBFlV8ThaCn-FpJwRN3mL3bP3cMHurPmiq9DON6GFngC6wDxmV1r-OeqLqnU1xFNFacmbKsf1BEZyW-UOIJ2218_u-arkK2EsIgg'
    # This is a TRIAL token. It will be expired at 31/05/2023.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|f0009dca9564904680836f83012e0910459a5670249c8543b9fb11a78e851921'
    # This is a TRIAL API key to use Amplia. It will expire at 31/05/2023.
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
