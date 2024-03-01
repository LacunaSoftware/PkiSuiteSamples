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
    REST_PKI_ACCESS_TOKEN='MDjm_nhGdugiCJmYRJW0q3NykmHlmS_v1wkvh6XBAkFHDGW7f5ErJxFZ5yLm7mubEJyAYScWWjDuVjP1hQasEkTCt4suHygyOum6dbfwZMtYWjwN7SulXg6-jRwUq2PTLgNVUaRjuCMq2VuqK8cgV5bsQYGLWBknTTUIYrLrrWldgDoWib8BNirwirf8iWnNGeGna4qSO1l5Ri-5w2qy__0Jayiv7uP08ZYP2SlV-ohsNk0otZ9FffA2Ib5iTEf3t8wsfeT7tHngCbd99GkHlg0jBLmyXSdixglREms03Rbz_hOY3n1GEIf-rvCkjQqak8SVqP9GHziiOTSmZNEh2z0Aldu1E-EAA6qj4mGELbpt4QTiIhqt_ltJdJJEYfaR2qsU1Jl0_MpG628nYd1gywZmRNX--nyr7ShrMxeUTEPBzQsR9Y83OE36PRV5Ow2mqzI39vr4hmm6P87ftXJxnHjVEnvGVK1551eAno46s0uA4UfC3ONe2rRqA1F0E9q2RmVFTQ'
    # This is a TRIAL token. It will be expired at 30/04/2024.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|f0ff3e0f51f69448b20fea5165af06a89a047a9f5970b721162854f56daa9420'
    # This is a TRIAL API key to use Amplia. It will expire at 30/04/2024.
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
