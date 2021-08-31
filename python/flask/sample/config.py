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
    REST_PKI_ACCESS_TOKEN='270JN8vXFPZEaUO5ndH7XZZB5M4ebLjdffXJEJyNGOqb38tH0WC8i2F_3obpnRPrO2qaLXi8GjKHNYHlinAyqL-m-HbutQWSksW-0_bHh5c_tX5TW_WLqxRFXmHkHTYG7alTgTB2eo_VGJrbAWgzXRYDvjyTrwX7YRrK8F-l7ZG6NupNJAwd81xjBEdGTa0CbJT3cUF7K9qm38beLVrLN9Ve5jwEaJiSTOX7BA5_aOGzN0u75YIVukmMrrHqDGUbe1QbJE92InOrbChYygGrxp_zG7JOVSHGnChmsK85DyBbnIuJ_HwrRj4tAKG5gFgYk_dsuB3CPn5In8cNugnzP_QpvMAOJLjWGNanlsanz2ZnU1IV2YJdoWRMKMyRifmlQd7-6xtHeP5rS88ZsPB49QO1rsNWs-VK5rk2egntrwnKlgdDRINuRVjldPQKfMfbFZc40J1IgSusX3lQTJxcoZeqiV62uNjkbQnFUUbyFQsV5wWCWFz68NXHn38rRISquswkCA'
    # This is a TRIAL token. It will be expired at 30/09/2021.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|e94d954b2d619449addbc7c9607c6605cb2924ab2efc758915e241baabb828ae'
    # This is a TRIAL API key to use Amplia. It will expire at 30/09/2021.
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
