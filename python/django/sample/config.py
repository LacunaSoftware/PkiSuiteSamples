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
    REST_PKI_ACCESS_TOKEN='53JHoj0eBexCQNoigRNFR0bFpRir1ArwSSWrX-nwEnL477Kvfp3OodmaJ-q0w5t1R8xPVTpNdKqOftqlaE6t7vsqtbGxA7pkHODO7Lna3_mAZKdhobvBtmroHjxYzG_JQn-9PEm1SIpYXBhk5oTfUag_De8rzxYWebwSwuG8_HcspN1MEUbZ8WrMNZZhEcCj3NWHFG7hw_vEBvN0fEVqyx7l5ifqFUrKk1I8s3SrlUSKJ1a1S4b7XplU7vFv8iMJiQ3B0Nq5mJS84UhVE-UtU8aRTq6UnVGAG3rh3UjfucanIimO_D0ZLFpQAhnIkq4_Y2WH9w7LxOGYONN-f4XPuNOutVtLPFwMkPUx5f-Yg6nOxisGa9rdBFpdOziyZoqsBaC-n7y9Xv3mI7FVXMpWnTLODSNz8jolDu8Rhk6AZWC0NXnPOa9JWhRa0l1pzw--PKoB9v9VPxXTpWaa6WvWV8sphRvWE1hjx93TBOIyYvv6k3DVgTsve2DFqOaZ7hpjcaWoaw'
    # This is a TRIAL token. It will be expired at 31/12/2021.
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
    AMPLIA_API_KEY = 'pki-suite-samples-02|bbed7617a60ae14eb172df172352b3320659c2b3525c488e653362890cd50fd8'
    # This is a TRIAL API key to use Amplia. It will expire at 31/12/2021.
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
