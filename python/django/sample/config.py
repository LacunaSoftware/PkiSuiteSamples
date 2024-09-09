class Config(object):
    DEBUG = False
    TESTING = False

    # Trust in Lacuna Test PKI (for development purposes only!)
    TRUST_LACUNA_TEST_ROOT = True

    # --------------------------------------------------------------------------
    # REST PKI
    # --------------------------------------------------------------------------

    # ========================================================
    #    >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
    # ========================================================
    REST_PKI_ACCESS_TOKEN='OuhyHKIXb9XCTnNYzyI9dQ08KGs4v0u_oHqDhWt44afx7td-_EsIc8NXhUlwxZZOp9EW2yTaWZQYg1014S0-LQr7gmMHtuQiqlWz-kNIRj0gqO6CI43333Cz8qx_jUm2cNLn7op4wYtw0Qq5JrWt_zpaWUZh8WPN-EpLto3m1taH654GRdvpyhc6EgiXi2clLXHheW1YwNCBRW5sa1QnY57O87EVE-bQ8q6iAcahIfDjazTwyVavlgPKyMLhWgL7LsnKBx9tzimjQK1WRLWb-amo6_5LEFTt3Mx1riCim6qmQscKAXwvgC6Usy1OEqQ2avBLWuQ8NJwlELwcGB1Pm86WtJJZOWYMKILlPmeegGwmkdT2oHtXuZ2vqMWFjqU_eofq4ygVPSdu5tBgFU7NCuozj217DFQCJUMvZNksmyafaGax6n3kYBR2F41I4INv90wuCGgkmZhLnviGn4YnP00z1DS7p45sMqrXcRg_uXw51pfpwy4Pkitz6B_6SLtTpVWhTQ'
    # This is a TRIAL token. It will be expired at 31/10/2024.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|270a2ec65f4d8c4393d3e8d4ad7605b96440b858e53642e5d05ceff3359cf470'
    # This is a TRIAL API key to use Amplia. It will expire at 31/10/2024.
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
