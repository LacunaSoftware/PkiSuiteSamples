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
    REST_PKI_ACCESS_TOKEN='P7ecKegwvF9jl2F2X-syRNW3FOVi3BxYGTZN0GSHZ6li9VuB5OTbj0a2aZUIr0UhYxxOjSzivVc31zXPvhqYlE1P0H0prFbJQ9sR3y1iljWiq7gTmi-5IIfvKJlZ113D3vTm68GpXkxlmlcZNsSO_mpv5MOuwoZtxeyzPjzH4YMUCuAvYjdHWg0-zke77LHyzebcXqpNAAHdHZkaRQ4IicUpogQrBBkcHG-WZGk-EW79SahdCymLHi4vKsOC2Q2vxs_sAP4iACFwjdSZgTohuXZsDM5p4rWAkEeFB0Aa_-Qb50fucCq---zAaVm3IWyp_J4IWBAzvLdbRz7jkAFc2OGpyulC54HNrwNsPsJWbVs2vECugqECDQEiSG47p3Yt5xZ2rJec0XyI2gVQVa0OxCEtXPyyNleajbbdNOz8c9n6aqreKqRQ1RRZTtU8WMNGY4w6riCRrtaX15ZhZ5TYxsxBlk-wOE57uG5dpnqGiYYX8Q0sX8aAx9PyUhhwbbfi8-68Og'
    # This is a TRIAL token. It will be expired at 31/01/2024.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|375a246b57b32a458e46a18607e6b1a2e33a89cce6764cf6210694bab963c9e5'
    # This is a TRIAL API key to use Amplia. It will expire at 31/01/2024.
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
