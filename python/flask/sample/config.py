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
    REST_PKI_ACCESS_TOKEN='VyB9CP2mKdGYWdsCYiG0Mwdq-JvvQWn71IVSDW1r0_jG8E4v_wENj-keX4bqN1xma0D8Sop68DmZRODs1WbT41q3--9s2jPe_gZahf4_5Y0yprqi3BLOUWk9DT0_K9jmHp5r4WIbBZad-nNxZjfvB5UBwJPkmFhfrzzC52hAjj2DmH79mHvABZjnf8Hjn41tT922emz8edX1gdGS11QjUmxWrTM6kE9yJzLNb1KgeaR8Cdsm7c7s2j6Je-WzwFXFk2ot_AqAGDmSV687vPb397UjvcmzUpeie2VzI8zCUCF9CN1mtuBvtRo5DxUnHSuY6BhoKtqKr6DQgqcI9EfJ2XgiaJ7z7pM2pNB8ega7p_MAj4AcANroAhcVudUADck_NlmpGCFa2spWbS9hjVnPKYn_2ShIkYU2fgtq6q3kuDzpjUQ80wL8cDVKxrj2k_Z9NLLovwm6RURbLBjVCve96GFyiT0jeyJrwybiay1x1iUJOhfVZrTzyTh5Gdywvo84guNUMQ'
    # This is a TRIAL token. It will be expired at 30/09/2025.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|1a439003d97ee04fa3f855d39ee123cc57a163c1e07e1990e503c499aa8ab9f4'
    # This is a TRIAL API key to use Amplia. It will expire at 30/09/2025.
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
