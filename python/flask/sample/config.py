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
    REST_PKI_ACCESS_TOKEN='VZ2kllu4IQR7lFoMkRO0CCP9HYVJBc4fpmwA8qianigyzzMlEPrlLGYMGKXjv8PY-i0OVc6UHJxNr9GxxbFL6CdbE8bvhn7Z10XIvjL3YnE2_WzTWw4mqKH_dv1BaKwJ9uL6cj8WncXsavX4P9sAG3zxVv-iEAdKJjODRuuMKqLAeTJsQrxgbswSHMpMereQ1IjvyiSJvit09NCsgDoD-IcNqGWhwtHRnj2iri3122rLzUA_zZEW5RzNmDLWGSszf3WJvfNkqtpQ-GsUxtzmrhwu__qr9_8kBlg4GaeVidNsJ3kC5yAEyzpsWrMHi3FPNRqlkt6EWgXmaMju7ex8Fn2On_tWi4hqIcetzfQxR4Uc3XVf2JmEMa7DnCkjwDXXrWR4GP3ivkQDZlDprtZnl3vNTQmtAHqPkz2kB6jLxmDECAlV661dOLp72cLbC49S15k2gRFEfYDa6_T0hR0N0IoBDR2j-3_MeTbr2ToozNe7f_7ipUsfq3zNXJ8Z0hqvI1ZhAg'
    # This is a TRIAL token. It will be expired at 29/02/2019.
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
