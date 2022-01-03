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
    REST_PKI_ACCESS_TOKEN='2UwpOvmto7dUebYbacnOUflxdL3MrbEWEhMcans6CnZkfUXdTHvIXfVgXSZa3KYU0Fpgr4hbfkWfuoYlLc_lSVzYafW1p8IfdaxyaLdXMI_jrLAF5_rpWcwWy_A-BPMTV37QuDUn3kphBN25vzQbCcBAKy62wcsAQhXhwgl-K0MJjAiaMysPtVhUXvXAzQv_yQNvguqc48YexpqVAbrGVFTXlCcPzyGDu8pxrFLayTw99POEIlbN6JAko97fwpaNa_UHn-hbgIHfJEgL47inK0bnfu8jU6Z7iHmivL1UGMFkPTmwNhYQ1842imUUh-Huvuwq8fjeMKO1KQrAUca1OdYVacNZwqDlDds04Ii05sWeL5_pC3uNRRNCiKN5wGf6zWFqXIQdZMXTgZa0Y-fFSWRVRusNTWT_t-KmKptRqw_L0hUvH_PK2ENAbX7V-xz2A-FnhBiteG-9g0JXEzDkaB036wPgMw4S3XlOLq2r444z10HM-nS5Ko41cM8PIQVxqEwskQ'
    # This is a TRIAL token. It will be expired at 31/03/2021.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|ad6e27c5ab1dce4da7b7a484ac889f7972c5b93b3265236f64a6f7c2978eb636'
    # This is a TRIAL API key to use Amplia. It will expire at 31/03/2022.
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
