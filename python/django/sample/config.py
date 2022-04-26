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
    REST_PKI_ACCESS_TOKEN='DuSD8tuUGVbrlmoZmRc_kOwJky6C5MxsB17IyUd3MXn_otd4gjtGqAT0oNYt9_GHfwqDoal3Tz0fr_FuR4kGcgpu73XaFuApNBIqIb1H4UOGPoiRHcpwvneXvGzhBue29MVk2UtGF5PJN4HzSy-Ry7S3MD6p7QfSKeUgXk-BgDqoca_Ah3WkrAJezyyXLZiiH9Ui3yAqm-6Z5TsqqcHW1CtSb-mUVGB8zUKTxLMnyQrO4ROfX0Ft_f6CCWOqaHLnUJ3THz4GuruItJEFHO4rBxQely_GkksdojO6VEYDP3auBJDQNm6pHKdbeGNsi5iDGQICvFT-FTwJuESJ4Or9zST_v8Fuf_Y6hZ55q_I_QDxvisl0-Xcu3Nfx4Iey-Mhla0u_-DY1o1la5F3OI38RsE4qTgYD3sJbAPdb0dZvglaJtkfihemaRE-1F-uSJp_VxswI0Dm8TUgNri-1hgAyEzLb2OHXGNx3PGPVXfYIsl9yIUkjDSuw4VYn3BPXQOXp8sOG3A'
    # This is a TRIAL token. It will be expired at 31/05/2022.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|d077131ed431af4a8dd45232cc5c0c6371bcffd61e156ffbaf4095e26b4fe428'
    # This is a TRIAL API key to use Amplia. It will expire at 31/05/2022.
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
