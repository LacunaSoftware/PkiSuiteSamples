import base64
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


# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects),
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".", "/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/pades-signature-wo-client')


@blueprint.route('/<file_id>', methods=['GET'])
def index(file_id=None):
    """
    This method only renders the signature page.
    """
    # Verify if the provided userfile exists.
    file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)
    if not os.path.exists(file_path):
        return render_template('error.html', msg='File not found')

    return render_template('pades_signature_wo_client/index.html')


@blueprint.route('/<file_to_sign>', methods=['POST'])
def start_signature(file_to_sign):
    # Handle form submission
    certThumb = request.form.get('certThumb')
    certContent = request.form.get('certContent')

    # signature_data = {
    #     'certThumb': certThumb,
    #     'certContent': certContent
    # }

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
    signature_starter.signer_certificate = certContent

    # Set the visual representation for the signature. We have encapsulated
    # this code (on util-pades.py) to be used on various PAdES examples.
    signature_starter.visual_representation = \
        PadesVisualElementsRest.get_visual_representation()

    result = signature_starter.start()

    signature_params = {
        'token': result.token,
        'cert_thumb': certThumb,
        'to_sign_hash': result.to_sign_hash,
        'digest_algorithm': result.digest_algorithm_oid,
        'file_id': file_to_sign
    }

    return render_template('pades_signature_wo_client/complete.html', **signature_params)


@blueprint.route('/complete/<file_id>', methods=['POST'])
def complete_signature(file_id):
    # Get the token for this signature. (rendered in a hidden input field,
    # see pades-signature/index.html template)
    token = request.form['tokenField']
    signature = request.form['signatureField']

    # Get an intance of the PadesSignatureFinisher class, responsible for
    # completing the signature process.
    signature_finisher = PadesSignatureFinisher(get_rest_pki_client())

    # Set PDF to be signed. It's the same file we used on "start" method.
    # Set the token.
    signature_finisher.token = token

    # Set the signature
    # Convert it to a byte object so the library can understand
    signature_finisher.signature = base64.b64decode(signature)

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

    return render_template('pades_signature_wo_client/signature-info.html',
                           signer_cert=signer_cert,
                           signed_pdf=filename)
