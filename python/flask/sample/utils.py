import binascii
import os
import re

from datetime import datetime
from datetime import timedelta
from os.path import join

from amplia_client import AmpliaClient
from flask import current_app
from pkiexpress import TimestampAuthority
from restpki_client import RestPkiClient
from restpki_ng_python_client import RestPkiClient as RestPkiClientNG
from restpki_client import StandardSecurityContexts
import restpki_ng_python_client


# region REST PKI

def get_rest_pki_client():
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
            'The API access token was not set! Hint: to run this sample you must generate an API access token on the REST PKI website and paste it on sample/config.py file.')

    if endpoint is None or len(endpoint) == 0:
        endpoint = 'https://pki.rest/'

    return RestPkiClient(endpoint, access_token)


def get_rest_pki_core_client():
    """

    Creates an instance of the RestPkiClient class, use to connect to REST PKI Core
    on every sample using the REST PKI client library.

    """

    # Get your token and endpoint values from the "config.py" configuration
    # file.
    access_token = current_app.config['REST_PKI_CORE_ACCESS_TOKEN']
    endpoint = current_app.config['REST_PKI_CORE_ENDPOINT']

    # Throw exception if token is not set (this check is here just for the sake
    # of newcomers, you can remove it)
    if access_token is None:
        raise Exception(
            'The API access token was not set! Hint: to run this sample you must generate an API access token on the REST PKI website and paste it on sample/config.py file.')

    if endpoint is None or len(endpoint) == 0:
        endpoint = 'https://core.pki.rest/'

    return RestPkiClientNG(endpoint, access_token)


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

# endregion


# region Amplia

def get_amplia_client():
    # Get Amplia API key to be used on the requests authentication.
    api_key = current_app.config['AMPLIA_API_KEY']

    # Throw exception if token is not set (this check is here just for the sake
    # of newcomers, you can remove it)
    if api_key is None:
        raise Exception(
            'The Amplia\'s API key was not set! Hint: to run this sample'
            ' you must generate an API access token on the REST PKI website'
            ' and paste it on sample/config.py file.')

    # Get Amplia's endpoint.
    endpoint = current_app.config['AMPLIA_ENDPOINT']

    # Return an instance of AmpliaClient class, passing the endpoint and
    # the API key.
    return AmpliaClient(endpoint, api_key)

# endregion


# region PKI Express

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
        operator.add_trusted_root(join(current_app.static_folder, root))

    # Set the operator to "OFFLINE MODE" (default: false):
    operator.offline = current_app.config['PKI_EXPRESS_OFFLINE']

    # Set the operator to use a timestamp authority when performing an timestamp
    # operation. In this sample, we will use the REST PKI by default to emit a
    # timestamp. It only be filled if the REST PKI token was provided.
    if current_app.config['REST_PKI_ACCESS_TOKEN'] is not None:

        # Get an instance of the TimestampAuthority class, responsible to inform
        # the URL and authentication parameters to be used when contacting the
        # timestamp authority.
        authority = TimestampAuthority(
            'https://pki.rest/tsp/a402df41-8559-47b2-a05c-be555bf66310')

        # Set authentication strategy. In the case of REST PKI, is using a
        # bearer token.
        authority.set_oauth_token_authentication(
            current_app.config['REST_PKI_ACCESS_TOKEN'])

        # Add authority to be used on operator.
        operator.timestamp_authority = authority

    # Trust Lacuna Test Root (for development purposes only!). Use this to
    # accept the test certificate provided by Lacuna Software.
    operator.trust_lacuna_test_root = current_app.config['TRUST_LACUNA_TEST_ROOT']
    # THIS SHOULD NEVER BE USED ON PRODUCTION ENVIRONMENT!

# endregion


def format_date(date):
    return date.strftime("%m-%d-%Y")


def get_two_years_from_now_date():
    two_years_from_now = datetime.now() + timedelta(days=2*365)
    return format_date(two_years_from_now)


def get_expired_page_headers(headers):
    now = datetime.utcnow()
    expires = now - timedelta(seconds=3600)

    headers['Expires'] = expires.strftime("%a, %d %b %Y %H:%M:%S GMT")
    headers['Last-Modified'] = now.strftime("%a, %d %b %Y %H:%M:%S GMT")
    headers['Cache-Control'] = 'private, no-store, max-age=0, no-cache,' \
                               ' must-revalidate, post-check=0, pre-check=0'
    headers['Pragma'] = 'no-cache'
    return headers


def join_strings_pt(strings):
    text = ''
    size = len(strings)
    index = 0
    for s in strings:
        if index > 0:
            if index < size - 1:
                text += ', '
            else:
                text += ' and '
        text += s
        index += 1
    return text


def get_description(c):
    text = get_display_name(c)
    if c.pki_brazil.cpf is not None:
        text += " (CPF %s)" % c.pki_brazil.cpf_formatted
    if c.pki_brazil.cnpj is not None:
        text += ", company %s (CNPJ %s)" % (c.pki_brazil.company_name,
                                            c.pki_brazil.cnpj_formatted)
    return text


def get_display_name(c):
    if c.pki_brazil.responsavel is not None:
        return c.pki_brazil.responsavel
    return c.subject_name.common_name


# ------------------------------------
# Configuration of the code generation
#
# - CodeSize   : size of the code in characters
# - CodeGroups : number of groups to separate the code (must be a proper divisor
#                of the code size)
#
# Examples
# --------
#
# - CodeSize = 12, CodeGroups = 3 : XXXX-XXXX-XXXX
# - CodeSize = 12, CodeGroups = 4 : XXX-XXX-XXX-XXX
# - CodeSize = 16, CodeGroups = 4 : XXXX-XXXX-XXXX-XXXX
# - CodeSize = 20, CodeGroups = 4 : XXXXX-XXXXX-XXXXX-XXXXX
# - CodeSize = 20, CodeGroups = 5 : XXXX-XXXX-XXXX-XXXX-XXXX
# - CodeSize = 25, CodeGroups = 5 : XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
#
# Entropy
# -------
#
# The resulting entropy of the code in bits in the size of the code times 5.
# Here are some suggestions:
#
# - 12 characters = 60 bits
# - 16 characters = 80 bits
# - 20 characters = 100 bits
# - 25 characters = 125 bits
VERIFICATION_CODE_SIZE = 16
VERIFICATION_CODE_GROUPS = 4


def generate_verification_code():
    """

    This method generates a verification code, without dashes.

    """
    rnd_value = os.urandom(int(VERIFICATION_CODE_SIZE / 2))
    hex_value = binascii.hexlify(rnd_value).upper()
    if type(hex_value) is bytes:
        return hex_value.decode('ascii')
    return hex_value


def format_verification_code(code):
    # Return the code separated in groups.
    chars_per_group = VERIFICATION_CODE_SIZE / VERIFICATION_CODE_GROUPS
    groups = []
    for i in range(VERIFICATION_CODE_GROUPS):
        groups.append(code[int(i * chars_per_group)                      :int((i + 1) * chars_per_group)])
    return '-'.join(groups)


def parse_verification_code(formatted_code):
    if formatted_code is None or len(formatted_code) == 0:
        return formatted_code
    return re.sub(r'[^A-Za-z0-9]', lambda x: '', formatted_code)
