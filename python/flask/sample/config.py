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
    REST_PKI_ACCESS_TOKEN='KQR4RVFQVFxrDRQroO1TvZ2NY04RmRCud8OPNxk1OJCVFuyRxM35QlCd82BV7JlWHZvokJ0iAhkbV3HqiYAH5X6Zsf7R9DqhGngQ2vUrQVH4zTNzqCbj65nx5O_mp9PNebnwpPGT7rdLIT9Jvn2qCIUfh4JCHIJZC6bBLM-Rz6PJsRHT9Kl5V_tuyOp99XSwJWg1waoZVJ1wGSIl2-XCikVLv7K3UhaPkth-leWWHXxFXbLTIcwc5KFhPpja9EwI6i078LKcsS7CoiUSWFLnePBpCdwuMFJDtKDMEYoNeIwr2mR46PPM-mYfy1halWBYlx6dga6ChSvTJ6YT7-6rRSZRL4e68uN27kPPGDJ_-1Su4xZjlT9nQUxI_4ih97_IzozLDKPHSYaq3x_yWWgIzUcoLOZ93RVqOvh_0DWc9MsagC-P_hwqr-jZLK6ircs-WQXq7SZMaY3dEYm4AsdYiR8h2Bwa0QmoX30cwfZTrXVYNzxFZrubg7ibAgKqaUo4FzkJww'
    # This is a TRIAL token. It will be expired at 30/04/2022.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|ea06fd79c7f9fe43b0eac8cbcdc979a3a77e3c0743f70cdebb39081f39342c37'
    # This is a TRIAL API key to use Amplia. It will expire at 30/04/2022.
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
