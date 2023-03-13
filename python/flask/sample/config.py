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
    REST_PKI_ACCESS_TOKEN='wAYhZlI6FC52gTNLTbgb2XK8Ff9UohswNXvg_m7xXsm0zqL3gznc1YDARA5SJK9T3EJ0cRW-JOF2_fkj-tUdN684kHhDqLrdzkpq0KFnWC5UUnYZ3m2mrHw2ubRRKr8vyLpWzZNJlq-ljJzIBYH2B6msPS8pO0vXz8J_ee_tu2z6-oYm6ZapKgW8QgkhPDXnTEoWOp7pc6BQls_bUorELaexWJ2rLWVbC4zJ4RNsLjvXR4A9bafESgKBflV2ffrxjjj5PPdOnL3g7ASeGnyGE2Ne1H0ynKrrgZg8W7FHdmMw3nWli4ineGE86RYVMOYA-4zzmDCZ9PV0GJbpao_0SuYycYt21xVV3HPkQU8ToagZ2x98hVZCitbskorky4pR02xWO4NWHtNt3k7dYXcwg6tIgDM1LHFiuo0ucc3Xt3UQxOEsoFTz-8v6PcYZeXKjlQ25lqfuZsACHUVrlvClc_uxhmaLCWVkuYm7pOK0JW_hmjaipXYwO_NX525oi8Rb4MYYow'
    # This is a TRIAL token. It will be expired at 31/03/2023.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|9b1ec4792dca2e4eb466e0af196da31e1367def9b882edb0e10f5ac1b434cc12'
    # This is a TRIAL API key to use Amplia. It will expire at 31/03/2023.
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
