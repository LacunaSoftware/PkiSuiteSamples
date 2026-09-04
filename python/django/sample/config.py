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
    REST_PKI_ACCESS_TOKEN='i5sHjjspESuhjXrpWy3H2De1GT3aQ0LpZN8JDeAa8yNDXwO4lcOOoOsLIxeEhgSTOI7Q_tp1P-5yK0vy8fnRuP-I6R7kvQQO04xveGeEjEEgwpFKZ7xQdGfX0ZxsKXEPcDLYtzd7skqtWg9Z1SB8v6-m2YzdWzV_S4eEx2IjI-LjfEJalXVvkcKC03lpR9AqC6DnPOE88yH4RB-vw9Fn2pp3DdCH1Zvxw4cTWAsI87uxfNRK4wS1vcrbHihrWGoZCu8DCla1diZhzqlfe9pT5z8yIMswt7D7YXU4GHYEcjlJYCmZY6ITzhapTJ11OPgkSMHkjcmcsyOMFxXqFnvwrr69vhD6Rz5GrwCSzYTW_W1F77OkspORdH1lsf3qIqhSz4NH-5zZdmhHWSqRQ__Aj4cP_Yn6IZr5MGQkB70XnTpZ6tBVE1a3D1zMYgLZ-TnYC_Xdlp6hVuzwveBhVsDd3CF3ySl2IgRVpdK1sdyaonWHkzGkbq6VsQ42UBMvKVQCC2bfOQ'
    # This is a TRIAL token. It will be expired at 30/09/2026.
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
    AMPLIA_API_KEY = 'pkisuitesamples01|3c64fc6788f5ab479fd00914f8a512c9c9c9d31f9b81d13de97c559f0123c44a'
    # This is a TRIAL API key to use Amplia. It will expire at 30/09/2026.
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
