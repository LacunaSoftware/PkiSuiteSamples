"""

This sample performs a PAdES signature in three steps using PKI Express and
Web PKI.

"""
from base64 import b64decode, b64encode
import os
import uuid

from flask import render_template
from flask import request
from flask import current_app
from flask import Blueprint
from restpki_client import StandardSignaturePolicies
from restpki_client import PadesSignatureStarter
from restpki_client import PadesSignatureFinisher

from sample.pades_visual_elements_rest import PadesVisualElementsRest, PadesVisualPositioningPresets
from sample.storage_mock import create_app_data
from sample.storage_mock import get_pdf_stamp_path
from sample.utils import get_rest_pki_client, get_security_context_id, set_pki_defaults


# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects), 
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer 
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/pades-signature-wo-comm-rest')


@blueprint.route('/<file_to_sign>')
def index(file_to_sign=None):
    """

    This method only renders the signature page.

    """
    # Verify if the provided userfile exists.
    file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_to_sign)
    if not os.path.exists(file_path):
        return render_template('error.html', msg='File not found')

    return render_template('pades_signature_wo_comm_rest/index.html')


@blueprint.route('/start/<file_to_sign>', methods=['POST'])
def start(file_to_sign):
    """

    This method starts the signature. In this sample, it will be called
    programatically after the user press the "Sign File" button (see method
    readCertificate() on static/js/signature-start-form.js).

    """
    try:
        # Recover variables from the POST arguments to be used on this step.
        cert_thumb = request.form['certThumbField']
        cert_content = request.form['certContentField']

        # Get an instance of the PadesSignatureStarter class, responsible for
        # receiving the signature elements and start the signature process.
        signature_starter = PadesSignatureStarter(get_rest_pki_client())

        # Set signature policy.
        signature_starter.signature_policy = \
            StandardSignaturePolicies.PADES_BASIC

        # Set PDF to be signed
        signature_starter.set_pdf_to_sign_from_path(
            os.path.join(current_app.config['APPDATA_FOLDER'], file_to_sign))

        # Set Base64-encoded certificate's content to signature starter.
        signature_starter.signer_certificate = cert_content

        # Set a security context to be used to determine trust in the
        # certificate chain. We have encapsulated the security context choice on
        # util.py.
        signature_starter.security_context = get_security_context_id()

        # Set the visual representation. We provided a dictionary that
        # represents the visual representation JSON model.
        signature_starter.visual_representation = \
            PadesVisualElementsRest.get_visual_representation()

        # Start the signature process. Receive as response the following fields:
        # - to_sign_hash:     The hash to be signed.
        # - digest_algorithm: The digest algorithm that will inform the Web PKI
        #                     component to compute the signature.
        # - token:    A token to be passed to the signing process step.
        response = signature_starter.start()

        # Render the field from start() method as hidden field to be used on the
        # javascript or on the "complete" step.
        return render_template('pades_signature_wo_comm_rest/start.html',
                               cert_thumb=cert_thumb,
                               token=response.token,
                               to_sign_hash=response.to_sign_hash,
                               digest_algorithm=response.digest_algorithm_oid)

    except Exception as e:
        return render_template('error.html', msg=e)


@blueprint.route('/complete/<file_to_sign>', methods=['POST'])
def complete(file_to_sign):
    """

    This function completes the signature, it will be called programatically
    after the Web PKI component perform the signature and submit the form (see
    method sign() on static/js/signature-complete-form.js).

    """
    try:

        # Recover variables form the POST arguments to be used on this step.
        token = request.form['tokenField']
        signature = request.form['signatureField']

        # Get an instance of the SignatureFinisher class, responsible for
        # completing the signature process.
        signature_finisher = PadesSignatureFinisher(get_rest_pki_client())

        # Set PKI default options (see utils.py).
        set_pki_defaults(signature_finisher)

        # Set the transfer file.
        signature_finisher.token = token

        # Set the signature file.
        signature_finisher.signature = b64decode(signature) # encode to byte array

        # Generate path for output file and add to the signature finisher.
        create_app_data()  # Guarantees that "app data" folder exists.
        filename = '%s.pdf' % (str(uuid.uuid4()))
        signature_finisher.output_file = \
            os.path.join(current_app.config['APPDATA_FOLDER'], filename)

        # Call the finish() method, which finalizes the signature process. The
        # return value is the signed PDF content.
        result = signature_finisher.finish()

        # Get information about the certificate used by the user to sign the
        # file. This method must only be called after calling the finish()
        # method.
        signer_cert = result.certificate

        return render_template('pades_signature_wo_comm_rest/signature-info.html',
                               signer_cert=signer_cert,
                               signed_pdf=filename)

    except Exception as e:
        return render_template('error.html', msg=e)
