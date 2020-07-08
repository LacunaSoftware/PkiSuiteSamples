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
    REST_PKI_ACCESS_TOKEN='NwwJCTbvLfr67RhLIeLd1Ut8S9itJDPBKXcF-CpRdoSkY4_nJrCuuKI3BDMgCqfwuNXfj3_aQP6keDMd8wxF5cEmptKmzTLdzvL7XGuYPNOcs7fjiipEWE1hL7AWsfFQdMVz8pYHPjpU9J7iO72WiHI2ELAqqhyNVrpT4MCR97b4FT3e43DBBqiF8nF_NK_oRuH50ycmVzme1zLPx-S-lmpXcfgjHl3lTLxjv36YD803dAF0gOgGD7L-rUqGEF80I_ATgXuEqCPhZw8dNdueTYDSN56kuATEWilYAzwwrd3eCeNq5qUyXVjiJg0s5OgNnsRe7pnGXQ6wu-zoIWLakIoPrhTYYnF85XzMM3SgKgGsxI9wxM3HvtgGgHfYXO4BRpACP_7kcqwwqP6e0P-u6Cp1skoOk_-vA4czbRW9DOf1cOelTLDLJbS0fnhgNXgW9_IycXxNC6EKZZWAI8rTDgw2jcTBQsvYNyCVKDtDSE4pOm6TQDxXzSHXMMdReZ4nyxvxjw'
    # This is a TRIAL token. It will be expired at 31/08/2020.
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
