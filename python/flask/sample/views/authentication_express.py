import os

from flask import Blueprint
from flask import request
from flask import make_response
from flask import render_template
from pkiexpress import Authentication

from sample.utils import set_pki_defaults
from sample.utils import get_expired_page_headers

# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects), 
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer 
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/authentication-express')


@blueprint.route('/')
def index():

    # Get an instance of the Authentication class.
    auth = Authentication()

    # Set PKI default options (see utils.py).
    set_pki_defaults(auth)

    # Start the authentication. Receive as response a AuthStartResult instance
    # containing the following fields:
    # - nonce: The nonce to be signed. This value is also used on "complete"
    #          action.
    # - digest_algorithm: The digest algorithm that will inform the Web PKI
    #                     component to compute the signature.
    result = auth.start()

    # Render the fields received form start() method as hidden field to be used
    # on the javascript and on the "complete" step. We pass the nonce as base64
    # to be rendered on page.
    response = make_response(
        render_template('authentication_express/index.html',
                        nonce=result.nonce,
                        digest_algorithm=result.digest_algorithm))

    # The nonce acquired above can only be used for a single authentication
    # attempt. In order to retry the signature it is necessary to get a new
    # token. This can be a problem if the user uses the back button of the
    # browser, since the browser might show a cached page that we rendered
    # previously, with a now stale token. To prevent this from happening, we
    # call the method set_no_cache_headers(), which sets HTTP headers to prevent
    # caching of the page.
    get_expired_page_headers(response.headers)

    return response


@blueprint.route('/', methods=['POST'])
def action():

    # Retrieve the values necessary to complete the authentication (rendered in
    # hidden inputs, see authentication/index.html template):
    # - nonce: The cryptographic nonce encoded as Base64.
    # - certContent: The content of the certificate, which is being
    #                 authenticated encoded as Base64.
    # - signature: The computed signature encoded as Base64.
    nonce_base64 = request.form['nonce']
    cert_content_base64 = request.form['certContent']
    signature_base64 = request.form['signature']

    # Get an instance of the Authentication class.
    auth = Authentication()

    # Set PKI default options (see utils.py).
    set_pki_defaults(auth)

    # Set the nonce. This value is generate on "start" action and passed by a
    # hidden field.
    auth.nonce_base64 = nonce_base64

    # Set the Base64-encoded certificate content.
    auth.certificate_base64 = cert_content_base64

    # Set the signature.
    auth.signature_base64 = signature_base64

    # Complete the authentication. Receive as response a AuthCompleteResult
    # instance containing the following fields:
    # - The certificate information;
    # - The validation results.
    result = auth.complete()

    # Check the authentication result.
    vr = result.validation_results
    if not vr.is_valid:

        # If the Authentication was not successful, we render a page showing
        # that what went wrong.

        # The __str__() method of the ValidationResults object can be used to
        # obtain the checks performed, but the string contains tabs and new line
        # characters for formatting, which we'll convert to <br>'s and &nbsp;'s.
        vr_html = str(vr)\
            .replace('\n', '<br>')\
            .replace('\t', '&nbsp;&nbsp;&nbsp;&nbsp;')

        # Render the authentication failed page
        # (templates/authentication_express/failed.html)
        return render_template('authentication_express/failed.html',
                               vr_html=vr_html)

    # At this point, you have assurance that the certificate is valid. Now,
    # you'd typically query your database for a user that matches one of the
    # certificate's fields, such as user_cert.email_address or
    # user_cert.pki_brazil.cpf (the actual field to be used as key depends on
    # your application's business logic) and set the user as authenticated
    # with whatever web security framework your application uses. For
    # demonstration purposes. we'll just render the user's certificate
    # information.
    user_cert = result.certificate

    # Render the authentication succeeded page
    # (templates/authentication_express/success.html).
    return render_template('authentication_express/success.html',
                           user_cert=user_cert)
