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
    REST_PKI_ACCESS_TOKEN='s_r-p0jjF0zdMxr7K5c4_IRgkgYb02JfZgxTEvuR0oubEtfhwf5Yza-R0vUgBGdaItwylFUx5BKAc5j_9SSzYkDrNAS1a-uOOdl-oPzEu7NDcAm1gcpKgw910rNl0I3GPPcXvoBF0z_fN_M70ZU5_2m9W_nZUc-SSN0z_HMhuzBr2NiC0OWhEUlecqnbeqah6S6QD7f2Ziau_7oQSI8XamA9v3nhuI6CYoo8Yp4XC1NLxHBVdXcBeWrVob3YhKCyC1Ak3d-guHp0OE29ToiiRzUylsQeJ44hMdFll7Z0jVJvNvCQXUV7A7MQIGAmMKpkVfPfNFpSlPA0HITsL1jHdmGFgBM5B4nCC_FbT7dNOVSDsM6K8uMAkX6pVvn7tc82ALqXrG9ei5XtWSqgnannSjkTVwEaaU_ONiEwZxlcs9ufHSDLXoQxDy9xuoUaC7CMM_zUOKpy7cM7JaHW30hPOFrAHasQZVDO9ai02KRN5HEKWzOMmLh47pJz62XoKubSlHz9Cw'
    # This is a TRIAL token. It will be expired at 31/05/2026.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|aa4e283341a0ae45b547763c22f88f0a46277bd6115c4dba375353dbcdd9e8bf'
    # This is a TRIAL API key to use Amplia. It will expire at 31/05/2026.
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
    # --------------------------------------------------------------------------
    # Cloudhub
    # --------------------------------------------------------------------------
    CLOUDHUB_API_KEY = 'mR1j0v7L12lBHnxpgxVkIdikCN9Gm89rn8I9qet3UHo='


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
