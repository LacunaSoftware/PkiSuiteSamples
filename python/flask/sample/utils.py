import os

from datetime import datetime
from datetime import timedelta
from flask import current_app
from pkiexpress import TimestampAuthority
from restpki_client import RestPkiClient
from restpki_client import StandardSecurityContexts

#region REST PKI

def get_restpki_client():
    """

    Creates an instance of the RestPkiClient class, use to connect to REST PKI
    on every sample using the REST PKI client library.

    """

    # Get your token and endpoint values from the "config.py" configuration
    # file.
    access_token = current_app.config['REST_PKI_ACCESS_TOKEN']
    endpoint = current_app.config['REST_PKI_ENDPOINT']

    # Throw exception if token is not set (this check is here just for the sake
    # of newcomers, you can remove it)
    if access_token is None:
        raise Exception(
            'The API access token was not set! Hint: to run this sample you'
            'must generate an API access token on the REST PKI website and'
            'paste it on sample/config.py file.'
        )

    if endpoint is None or len(endpoint) == 0:
        endpoint = 'https://pki.rest/'

    return RestPkiClient(endpoint, access_token)


def get_security_context_id():
    """

    This method is called by REST PKI samples to determine the security context
    to be used.

    Security contexts dictate which root certification authorities are
    trusted during certificate validation. In your API calls, you can see
    one of the standard security contexts or reference one of your custom
    contexts.

    :return: StandardSecurityContexts

    """
    if current_app.config['TRUST_LACUNA_TEST_ROOT']:
        # Lacuna Text PKI (for development purposes only!)
        #
        # This security context trusts ICP-Brasil certificates as well as
        # certificates on Lacuna Software's test PKI. Use it to accept the test
        # certificates provided by Lacuna Software.
        #
        # THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!
        return StandardSecurityContexts.LACUNA_TEST
        # Notice for On Premises users: This security context might not exist on
        # your installation, if you encounter an error please contact developer
        # support.

    else:
        # In production, accepting only certificates from ICP-Brasil
        return StandardSecurityContexts.PKI_BRAZIL

#endregion

#region PKI Express

def set_pki_defaults(operator):
    """

    Sets the default configuration to any PKI Express operator.

    """

    # Set the operator to trust in a custom trusted root, you need to inform
    # the operator class. We will add each trusted root form configuration file.
    # In this sample, we assumed that all trusted roots are in the static/
    # folder. You are free to pass any path.
    trusted_roots = current_app.config['PKI_EXPRESS_TRUSTED_ROOTS']
    for root in trusted_roots:
        operator.add_trusted_root(os.path.join(current_app.static_folder, root))

    # Set the operator to "OFFLINE MODE" (default: false):
    operator.offline = current_app.config['PKI_EXPRESS_OFFLINE']

    # Set the operator to use a timestamp authority when performing an timestamp
    # operation. In this sample, we will use the REST PKI by default to emit a
    # timestamp. It only be filled if the REST PKI token was provided.
    if current_app.config['REST_PKI_ACCESS_TOKEN'] is not None:

        # Get an instance of the TimestampAuthority class, responsible to inform
        # the URL and authentication parameters to be used when contacting the
        # timestamp authority.
        authority = TimestampAuthority('https://pki.rest/tsp/a402df41-8559-47b2-a05c-be555bf66310')

        # Set authentication strategy. In the case of REST PKI, is using a
        # bearer token.
        authority.set_oauth_token_authentication(current_app.config['REST_PKI_ACCESS_TOKEN'])

        # Add authority to be used on operator.
        operator.timestamp_authority = authority

    # Trust Lacuna Test Root (for development purposes only!). Use this to
    # accept the test certificate provided by Lacuna Software.
    operator.trust_lacuna_test_root = current_app.config['TRUST_LACUNA_TEST_ROOT']
    # THIS SHOULD NEVER BE USED ON PRODUCTION ENVIRONMENT!

#endregion


def get_expired_page_headers():
    headers = dict()
    now = datetime.utcnow()
    expires = now - timedelta(seconds=3600)

    headers['Expires'] = expires.strftime("%a, %d %b %Y %H:%M:%S GMT")
    headers['Last-Modified'] = now.strftime("%a, %d %b %Y %H:%M:%S GMT")
    headers['Cache-Control'] = 'private, no-store, max-age=0, no-cache,' \
                               ' must-revalidate, post-check=0, pre-check=0'
    headers['Pragma'] = 'no-cache'
    return headers
