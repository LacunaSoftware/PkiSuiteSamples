import os

from datetime import datetime
from datetime import timedelta
from flask import current_app
from restpki_client import RestPkiClient
from restpki_client import StandardSecurityContexts

#region REST PKI

def get_restpki_client():
    # ==========================================================================
    #                    >>> PASTE YOUR ACCESS TOKEN BELOW <<<
    # ==========================================================================
    restpki_access_token = 'PLACE YOUR API ACCESS TOKEN HERE'

    # Throw exception if token is not set (this check is here just for the sake
    # of newcomers, you can remove it)
    if ' API ' in restpki_access_token:
        raise Exception(
            'The API access token was not set! Hint: to run this sample you'
            'must generate an API access token on the REST PKI website and'
            'paste it on the file restpki/utils.py'
        )

    restpki_url = 'https://pki.rest/'
    return RestPkiClient(restpki_url, restpki_access_token)


def get_security_context_id():
    """

    This method is called by all pages to determine the security context to
    be used.

    Security contexts dictate which root certification authorities are
    trusted during certificate validation. In your API calls, you can see
    one of the standard security contexts or reference one of your custom
    contexts.

    :return: StandardSecurityContexts

    """
    if current_app.env == 'development':
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
    # If you want to operator to trust in a custom trusted root, you need to
    # inform the operator class. You can trust on more than one roots by
    # uncommenting the following lines:
    # operator.add_trusted_root(path_one)
    # operator.add_trusted_root(path_two)
    # operator.add_trusted_root(path_three)

    # If you want the operator to trust on Lacuna Test Root (default: false),
    # uncomment the following line:
    # operator.trust_lacuna_test_root = True

    # If you want the operator to perform its action on "OFFLINE MODE"
    # (default: False), uncomment the following line:
    # operator.offline = True

    # If you want to perform a signature with timestamp, set the timestamp
    # authority. You can use REST PKI to do this (acquire access token on
    # https://pki.rest), by commenting the following lines:
    # tsa = TimestampAuthority('https://pki.rest/tsp/a402df41-8559-47b2-a05c-be555bf66310')
    # tsa.set_oauth_token_authentication('SET YOU ACCESS TOKEN HERE')
    # operator.timestamp_authority = tsa
    pass

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
