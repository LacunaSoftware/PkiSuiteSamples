import os
import uuid

from flask import render_template
from flask import make_response
from flask import request
from flask import current_app
from flask import Blueprint
from restpki_client import PadesSignatureStarter
from restpki_client import PadesSignatureFinisher
from restpki_client import StandardSignaturePolicies

from sample.pades_visual_elements_rest import PadesVisualElementsRest
from sample.storage_mock import create_app_data
from sample.utils import get_rest_pki_client
from sample.utils import get_expired_page_headers
from sample.utils import get_security_context_id


# 21-07-2022
# For some reason, Blueprint has stopped accepting names containing dots('.'),
# so the exception would be thrown at the blueprint instantiation. In order to 
# solve that we replaced all occurrences of dots with forward slash ('/'). This fix
# made the PkiSuiteSamples Flask example run normally again
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/pades-signature-rest')


@blueprint.route('/<file_to_sign>')
def index(file_to_sign=None):
    """

    This function initiates a PAdES signature using REST PKI and renders the
    signature page.

    Both PAdES signature examples, with a server file and with a file uploaded
    by the user, converge to this function. The difference is that, when the
    file is uploaded by the user, the function is called with a URL argument
    named "userfile".

    """

    try:

        # Get an instantiate of the PadesSignatureStarter class, responsible for
        # receiving the signature elements and start the signature process.
        signature_starter = PadesSignatureStarter(get_rest_pki_client())

        # Set the PDF to be signed.
        signature_starter.set_pdf_to_sign(
            '%s/%s' % (current_app.config['APPDATA_FOLDER'], file_to_sign))

        # Set the signature policy.
        signature_starter.signature_policy =\
            StandardSignaturePolicies.PADES_BASIC

        # Set a security context to be used to determine trust in the
        # certificate chain. We have encapsulated the security context choice on
        # util.py.
        signature_starter.security_context = get_security_context_id()

        # Set the visual representation for the signature. We have encapsulated
        # this code (on util-pades.py) to be used on various PAdES examples.
        signature_starter.visual_representation = \
            PadesVisualElementsRest.get_visual_representation()

        # Call the start_with_webpki() method, which initiates the signature.
        # This yields the token, a 43-character case-sensitive URL-safe string,
        # which identifies this signature process. We'll use this value to call
        # the signWithRestPki() method on the Web PKI component (see
        # signature-form.js javascript) and also to complete the signature after
        # the form is submitted (see method pades_signature_action()). This
        # should not be mistaken with the API access token.
        result = signature_starter.start_with_webpki()

        # The token acquired above can only be used for a single signature
        # attempt. In order to retry the signature it is necessary to get a new
        # token. This can be a problem if the user uses the back button of the
        # browser, since the browser might show a cached page that we rendered
        # previously, with a now stale token. To prevent this from happen, we
        # force page expiration through HTTP headers to prevent caching of the
        # page.
        response = make_response(
            render_template('pades_signature_rest/index.html',
                            token=result.token))
        get_expired_page_headers(response.headers)
        return response

    except Exception as e:
        return render_template('error.html', msg=e)


@blueprint.route('/', methods=['POST'])
def action():
    """

    This function receives the form submission from the template
    cades-signature/index.html. We'll call REST PKI to complete the signature.

    """

    try:

        # Get the token for this signature. (rendered in a hidden input field,
        # see pades-signature/index.html template)
        token = request.form['token']

        # Get an intance of the PadesSignatureFinisher class, responsible for
        # completing the signature process.
        signature_finisher = PadesSignatureFinisher(get_rest_pki_client())

        # Set the token.
        signature_finisher.token = token

        # Call the finish() method, which finalizes the signature process. The
        # return value is the signed PDF content.
        result = signature_finisher.finish()

        # Get information about the certificate used by the user to sign the
        # file. This method must only be called after calling the finish()
        # method.
        signer_cert = result.certificate

        # At this point, you'd typically store the signed PDF on your database.
        # For demonstration purposes, we'll store the PDF on a temporary folder
        # publicly accessible and render a link to it.

        create_app_data()  # Guarantees that "app data" folder exists.
        filename = '%s.pdf' % (str(uuid.uuid4()))
        result.write_to_file(
            os.path.join(current_app.config['APPDATA_FOLDER'], filename))

        return render_template('pades_signature_rest/complete.html',
                               signer_cert=signer_cert,
                               signed_pdf=filename)

    except Exception as e:
        return render_template('error.html', msg=e)
