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
    REST_PKI_ACCESS_TOKEN='192Z_JVBKZsC3lNp03LYL1YHXRgni5axl1YpbYbrgxJmQoKlj4u6yM2zB1CfjijX-cAeV75tiIvymVLUrlw2nw2tyP9B_fdbJ8xlu4ctkwNAjIIXCyjAQLxIPQOgCYv2eSkZcIE4cd0LexUUeNZ692qBGFSYKv7U9I1lEWXPKrTp314W0zASb0ir_iGvvs1BDdDbE2A_MbTIP7Y_09vlCBHB10TcmhIJzkYC_B-x5FEbLvK9FqWKzJ1LuueS-wNCZsR-CB4Icr1hmRpqgxeUiGs7roPnNtP5uthVy9nzxFkr5VUWci7puaOdW5WQwx9yK2TLCKI8ShGp-HDEVFPMW4o9YrJeXazDpIsWiwPkShImfbLVnhwZeTZMZuItVIxVuBmaso3SvEEvw4xIkjioEX0jiB9m2ep5xOHdQsmC7zmB4BOGhwPEkI7lXozD7h5crvsDDHLVSps7xZ25fV5nEChYNMELM3fAohCDofyJo-Bp24LkyZSGYDNShJEqgJAxoO51hA'
    # This is a TRIAL token. It will be expired at 31/07/2021.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|dccd702f5909d64a89168e97c02b56631a0e00aea6b1a171ca65e61003c69001'
    # This is a TRIAL API key to use Amplia. It will expire at 31/08/2021.
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
