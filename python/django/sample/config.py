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
    REST_PKI_ACCESS_TOKEN='rG6c0v-b05TNE0yPA12q7ovoPQx_iiKrh7tuEdSptMQ-NnrEwNU3rI2TVh4gXJXNSRU1DIaf8mdwgHHXaeysAJO2BtbMdq_jU4SNwBIDaPB7_C1_XUFbeR900MCu-aT4DmTnLQ7feWWFAGOUAF3Uxgs3BBJ4b0OG3Y50ucODr4c3MjZJFe6G_08UzvlzqWf7eI4eHTNK7NYH0d7Z0dWaPs5XiElOgWKJdCUuJCIFpmzs43Li-jZzYJR0vCml4oZZzo8TH1zScXXEpGGxZsUKxZ8Pi8XX4jxdUlaf7Y99DcyG-SIZ1UpoE_N0P72eqf7A42SJBNabIkhB5WrzcKN5jWza1Eba67OMqRYEtqLnfHT2AznqLojKFPbn5KPgO1_r2Ecfn_fM2b_cqp2mtzEuJtIDGZ791ke7jmQHARs0K2MLV41fHmprYMMg2NahDqvQeCGbX4LKBzHqcEw640CRAa_aAsFV67fQ2fe2PAPE8G__C90cJ_j7Z4fxcRyogA2WPa1I2w'
    # This is a TRIAL token. It will be expired at 30/04/2026.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|498704d2c6788e44b0ccc7b639bf19753cf97ad90c4fca9222799d370d93f93f'
    # This is a TRIAL API key to use Amplia. It will expire at 30/04/2026.
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
