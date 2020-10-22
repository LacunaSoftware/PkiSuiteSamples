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
    REST_PKI_ACCESS_TOKEN='8bXgIzJomxB7LoSJIdlhVROpQFM8M9SicR1koKpAJNYZNyChPqkcu2LSWcTcEk0gZGXBiC7VZ94_NIeEBPTPbA86bJDNkENwqEtxqAKCWh3OwKV6kGa4e6BwsJ47M5hb4E6DPXCGGPfFthtrG-sLvpDKl7oFe7nn7J-7vT3CUdqGbu7cW9B1YzRMAt_OfDAt4BXpASNjgYoldiHdEGdDyTeVLFolnHYslChtYcswP18TUwGCl6rWp4aWNDe6wVevP6u_LdK7VzeFxRd7gIZ4YZs2noE4DVHFoVzBR-FyORlxUGATeWV_8lPAiHC1TBHBi-mZJp4tI4IL4imWJSLrQqWI0j2HgVl20kpdy4J_HLXM5iTk39kzDfyYAyihp8ssIbce4RjrhkxoYg9x-ZckuvlFuQYcDlYAPqu0In1gS3Mcp-Ip7ILae7DsokItO9ostUtuYhNCcGTL6c45zXT7lMmo9vTnlq-air9IcNITZa2g19Iwz9XzZMc5cr4dGwiaicTN6w'
    # This is a TRIAL token. It will be expired at 30/11/2020.
    # If the REST PKI sample doesn't work, please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on a "on premises' installation of REST PKI,
    # fill the field below with the URL address of your REST PKI installation
    # (with the trailing '/' character).
    REST_PKI_ENDPOINT = 'https://pki.rest/'

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
