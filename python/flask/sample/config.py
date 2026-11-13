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
    REST_PKI_ACCESS_TOKEN='jVKhLLbskhYRYo4G-Wufun4yhmCj_gzW2WfbDWBZ8MVBdiI4uIdXQ3n5BVF__M24Y2DbMuWbUdXLD9i7nb37v0Lwz3LRbkCJqAiUlxvm2FO4Rp2VdbGg4_K64LXdQoYl-GbKjr2ZQK898WdaXl2Z7-_sGV8aOrdHmyaDiceacHXbxOEY6BAj2WmQw2y73WDG2H1s-wuOoRHFyMMhii_99DKqq_fsEDPTRZlH_xh5j0YnbLwTXkHxzQS2fe3mji7T5IA3RvStUkQpS2BGUZpv-tIE2Blo-mCs4u4_QwrytP58Ik3F1Ckp4xk8zcFkiHtrgk9WmqmK0j8jXumD81GszY8S9ZNNJqF1DfhEL0qqTuCiZ-UrCMtf43VWKXRWlQ32j1kcO91pJ73BX47DY4AGu7fXY-Kw_urgnvF4eAPB0dkZg_trC1KooVo6oG7VdSseZwWsYenxHG7HELIBAO-SOBvZ2iCCxy84e1yyNOFhRU2F1JMI6UY_qkxd7X7hxrRlcETo6A'
    # This is a TRIAL token. It will be expired at 31/12/2026.
    # If the REST PKI sample doesn't work, please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on an "on premises" installation of REST PKI,
    # fill the field below with the URL address of your REST PKI installation
    # (with the trailing '/' character).
    REST_PKI_ENDPOINT = 'https://pki.rest/'

    # --------------------------------------------------------------------------
    # REST PKI Core
    # --------------------------------------------------------------------------

    # ========================================================
    #    >>>> PASTE YOUR REST PKI CORE API KEY BELOW <<<<
    # ========================================================
    REST_PKI_CORE_API_KEY = 'pkisuitesamples01|aefd6b6a4aafd744bbf3818effca3a7c4a326bc5641bb450df7a4797ab967a77'

    # In order to use this sample on an "on premises" installation of REST PKI
    # Core, fill the field below with the URL address of your REST PKI Core
    # installation (with the trailing '/' character).
    REST_PKI_CORE_ENDPOINT = 'https://core.pki.rest/'

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
    AMPLIA_API_KEY = 'pkisuitesamples01|df8c6d65a6f3944eacb9acf56ae9ddb1dbfa4cf528c69280260a71bb941959c2'
    # This is a TRIAL API key to use Amplia. It will expire at 31/12/2026.
    # If the Amplia's samples do not work please contact our support by email:
    # suporte@lacunasoftware.com

    # In order to use this sample on an "on premises" installation of
    # Amplia, fill the field below with the URL address of your Amplia
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


class TestingConfig(Config):
    TESTING = True
