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
    REST_PKI_ACCESS_TOKEN='5KP92YmlwXjSdKtKYaAw4BlBpfFdt3dZw6R0omkuAX24ygyQMqscDu3RpEC4Db85FhoB1y-IV9ltx2NidpG1ScW0Hpt5YD4NKzod_zZw5uzdgybGZASR2bgC-lNseHVZUo5EcthdKjqp3Jon0KnA1xffNHZWp5OO3dfsHKVDWNwPFcsiLwlc94YS_-23t60vzywWI1Ph1LFb8HgH0SCVAyljNQGuWWL1HwbZbSsD4Z6vEyrp1NRXepMeBDIVuZwZhgi69bltBJ17CEWlVwIRpdjvsu3tY9eDY9mEFU5Gss4NmNA2xKhxNCTq2QWOvaqDoUQxJWmcmNMJBGUOO-vzXILJfzVaarKMNh--thKiCthDPpvatALdTAKNyNMH_ZGNNCiYqnZAqwzmDaoC6dgIxQNQ0k97NQiGeNpFJBMm97xoiwJsutVwcY8aiwtakTsujqfvfFQDKbk7W9ZeHHH_xjR3FFHOPIqX-sFNMgHVVNy1OYqOexsf0eqyfOnBTpro4kek9g'
    # This is a TRIAL token. It will be expired at 30/11/2023.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|9a3883362fae234eb571191061f608b78877a870912ca36810cf2fbc72d1e1aa'
    # This is a TRIAL API key to use Amplia. It will expire at 30/11/2023.
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
