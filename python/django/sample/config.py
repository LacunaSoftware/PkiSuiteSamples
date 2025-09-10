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
    REST_PKI_ACCESS_TOKEN='HPCQBYJSiCevWo0M-h8UO1DUHdK-bTUMwnsf7vcw2CbaYcjZCfqGt3bnFnFhx7YgOVi_eaZS4TpuKVFcOi8NB5MCFILsnFSybYMTy8Kqo0QmlwzgaZfALYR1cJDx6VenxBmSSu9_9Wh_da2sR6RaKS-t6i8qGII2E0q8NIJ6iZcqh3IeQ0eIHr4ROISfx2B8m2kxzBOZaUPBh1W9AkLHxy5U8cO2j9ePw3a8bEvgEbrPEKO9_b2HTBLqU4LJgxiBkWXIq0V-yWlhnZWKna3C1t7JoQKuF-tgoHwwC_3_qZVKBKpCnPPEDmNgmyZSEeTvczaMXR-nxH-uQTh35o15SHg2b1I5z8xjKzDwV3NaOZg9Ig_-Bn3z-7kJk-_SANoTCQTDVycXP5NDNO9PRnkF94DVUWP6CdqZ2KcdeRw9EfxUsYUTX33FA8NcJEtQEF_hWFZSpg9JBJM14aLpw-_cYPrAK7FNU4uay_lK4QzrbkfZa-j6HR2Z3eW92R3pOwMPL31yWw'
    # This is a TRIAL token. It will be expired at 31/10/2025.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|2058a12561968c4b975c574fd83dc1bab558562b6042fdb8bfa1a6194230ce32'
    # This is a TRIAL API key to use Amplia. It will expire at 31/10/2025.
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
