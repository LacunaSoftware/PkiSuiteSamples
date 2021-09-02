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
    REST_PKI_ACCESS_TOKEN='-n3Qz-rC_hrwva8ERfbIyCfTbem-XnUN9yxstku7pzVOOWEhOjNn9fQ0IywG1qTa3f0wMmgbHzT1wHGC8Ht1geO9wqI3_mu3UDBngOCwVaU5QO1qqYhc0_3y5dJIVXAw_hR2DSMj-yDvy934pRhH1OsHHmEr0JfcLgERD-vEnI8SMHR9WcLHlUF6q6WITTfQ6mDenbCHY3daUvvS_LphoIGJ-rE48VOKrOU5EG-2ydDebewnETVd-7jgavAh3o23QDaqHzOPeqoyFWY0pnosfF1U5XQTK4sHKOyJeUeKlW2Z1YxPThkgCDqQNnPyffjkktpUi1mTzkI2HSHnwkTmMCfESKC3X51K-6CP8k6lKO8WqMi0oHC0Pbka5DK_5ivcZxyFqFJNO5USazk9JG9eUcCojUVVRVm5Kc_SoKoget9o2ygx_TbLs9Cu_hqh2xWwCAzhLZ250pDrEE3-WgCZZri76XWRxMMN-jFBHvAlYhlCQMa2_8NSq14yPDgNf4KelkH3qw'
    # This is a TRIAL token. It will be expired at 31/08/2021.
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
    AMPLIA_API_KEY = 'pki-suite-samples-01|233e08e642b83840a8fcec5ed73c6bf16e559124dfe010891b9ff8c98d9fb506'
    # This is a TRIAL API key to use Amplia. It will expire at 31/08/2021.
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
