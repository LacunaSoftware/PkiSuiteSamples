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
    REST_PKI_ACCESS_TOKEN='PmFZl-vOhi4AD79_QTU0fPSVTiuX1of4TVE9631OHttO3o5ayF4Rjw5aiVvoF6Fs-_YHSXb5KDcQhQ1XeA7EHgywALWsfIoOTe66srDIqTemxLvEKg0_FzQwBogpWLQfg-C-WgSsQMx0c_MfVleIV6qce5Cqg8G0ZJ1GQlFQLL9yRH4xDMwJ6rk8hQacEROI22szWsN8LyEaQ9Deh-K8GcbVZzgF4M5WPCpjZLdsdrCOU9qGfXBYGWs42XqrI8Ld12G1Hp8P2vp3p6BN0DU8iVQfMOkXqAGUKSnYsGku3iDn0wiPX5fNOMNsXrI03pkhc-tL6cUjK3RaidsZfOK1At6XAYvn4dFEPpihyqJLlISk3Cfua3e8JWDdVs8sbER8U4fgozDnNXV9xSeo2ogdRwsHuzjRQUhGIvLS8XIg5oWU9tmV-8NpBM38GK165CVIl0EJlQymA_RXWqdEw2F-HDCa3ojHF14fDcA9jTcPm3EdpzKs_HX81pGYSBRRH3xDbgrE4w'
    # This is a TRIAL token. It will be expired at 30/06/2021.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|99022048c3adf9498db86660ccebc6407f6cad2a5f48259fe7cf9c10dcebafe6'
    # This is a TRIAL API key to use Amplia. It will expire at 30/06/2021.
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
