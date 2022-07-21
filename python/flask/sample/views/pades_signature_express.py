"""

This sample performs a PAdES signature in three steps using PKI Express and
Web PKI.

"""
import os
import uuid

from flask import render_template
from flask import request
from flask import current_app
from flask import Blueprint
from pkiexpress import standard_signature_policies
from pkiexpress import PadesSignatureStarter
from pkiexpress import SignatureFinisher

from sample.pades_visual_elements_express import PadesVisualElementsExpress
from sample.storage_mock import create_app_data
from sample.storage_mock import get_pdf_stamp_path
from sample.utils import set_pki_defaults

# 21-07-2022
# For some reason, Blueprint has stopped accepting names containing dots('.'),
# so the exception would be thrown at the blueprint instantiation. In order to 
# solve that we replaced all occurrences of dots with forward slash ('/'). This fix
# made the PkiSuiteSamples Flask example run normally again
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/pades-signature-express')


@blueprint.route('/<file_id>')
def index(file_id):
    """

    This method only renders the signature page.

    """
    # Verify if the provided userfile exists.
    file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)
    if not os.path.exists(file_path):
        return render_template('error.html', msg='File not found')

    return render_template('pades_signature_express/index.html')


@blueprint.route('/start/<file_id>', methods=['POST'])
def start(file_id):
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
        signature_starter = PadesSignatureStarter()

        # Set PKI default options (see utils.py).
        set_pki_defaults(signature_starter)

        # Set signature policy.
        signature_starter.signature_policy = \
            standard_signature_policies.PADES_BASIC

        # Set PDF to be signed
        signature_starter.set_pdf_to_sign_from_path(
            os.path.join(current_app.config['APPDATA_FOLDER'], file_id))

        # Set Base64-encoded certificate's content to signature starter.
        signature_starter.set_certificate_from_base64(cert_content)

        # Set a file reference for the stamp file. Note that this file can be
        # referenced later by "fref://{alias}" at the "url" field on the visual
        # representation (see static/vr.json or get_visual_representation()
        # method).
        signature_starter.add_file_reference('stamp', get_pdf_stamp_path())

        # Set the visual representation. We provided a dictionary that
        # represents the visual representation JSON model.
        signature_starter.set_visual_representation(
            PadesVisualElementsExpress.get_visual_representation())

        # Start the signature process. Receive as response the following fields:
        # - to_sign_hash:     The hash to be signed.
        # - digest_algorithm: The digest algorithm that will inform the Web PKI
        #                     component to compute the signature.
        # - transfer_file:    A temporary file to be passed to "complete" step.
        response = signature_starter.start()

        # Render the field from start() method as hidden field to be used on the
        # javascript or on the "complete" step.
        return render_template('pades_signature_express/start.html',
                               cert_thumb=cert_thumb,
                               transfer_file_id=response['transferFile'],
                               to_sign_hash=response['toSignHash'],
                               digest_algorithm=response['digestAlgorithm'])

    except Exception as e:
        return render_template('error.html', msg=e)


@blueprint.route('/complete/<file_id>', methods=['POST'])
def complete(file_id):
    """

    This function completes the signature, it will be called programatically
    after the Web PKI component perform the signature and submit the form (see
    method sign() on static/js/signature-complete-form.js).

    """
    try:

        # Recover variables form the POST arguments to be used on this step.
        transfer_file = request.form['transferFileIdField']
        signature = request.form['signatureField']

        # Get an instance of the SignatureFinisher class, responsible for
        # completing the signature process.
        signature_finisher = SignatureFinisher()

        # Set PKI default options (see utils.py).
        set_pki_defaults(signature_finisher)

        # Set PDF to be signed. It's the same file we used on "start" method.
        signature_finisher.set_file_to_sign_from_path(
            os.path.join(current_app.config['APPDATA_FOLDER'], file_id))

        # Set the transfer file.
        signature_finisher.set_transfer_file_from_path(transfer_file)

        # Set the signature file.
        signature_finisher.signature = signature

        # Generate path for output file and add to the signature finisher.
        create_app_data()  # Guarantees that "app data" folder exists.
        filename = '%s.pdf' % (str(uuid.uuid4()))
        signature_finisher.output_file = \
            os.path.join(current_app.config['APPDATA_FOLDER'], filename)

        # Complete the signature process.
        signer_cert = signature_finisher.complete(get_cert=True)

        return render_template('pades_signature_express/signature-info.html',
                               signer_cert=signer_cert,
                               signed_pdf=filename)

    except Exception as e:
        return render_template('error.html', msg=e)
