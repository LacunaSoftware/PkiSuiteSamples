"""

This sample performs a CAdES signature in three steps using PKI Express and
Web PKI.

"""
import os
import uuid

from flask import Blueprint
from flask import current_app
from flask import render_template
from flask import flash
from flask import redirect
from flask import url_for
from flask import request
from pkiexpress import CadesSignatureStarter
from pkiexpress import SignatureFinisher
from pkiexpress import standard_signature_policies

from sample.storage_mock import create_app_data
from sample.storage_mock import get_sample_doc_path
from sample.utils import set_pki_defaults

blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/cades-signature-express')


@blueprint.route('/<file_id>')
def index(file_id):
    """

    This method only renders the signature page.

    """
    # Verify if the provided userfile exists.
    file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)
    if not os.path.exists(file_path):
        return render_template('error.html', msg='File not found')

    return render_template('cades_signature_express/index.html')


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

        # Get an instance of the CadesSignatureStarter class, responsible for
        # receiving the signature elements and start the signature process.
        signature_starter = CadesSignatureStarter()

        # Set PKI default options (see utils.py).
        set_pki_defaults(signature_starter)

        # Set signature policy.
        signature_starter.signature_policy = \
            standard_signature_policies.PKI_BRAZIL_CADES_ADR_BASICA

        # Set file to be signed. If the file is a CMS, PKI Express will
        # recognize that and will co-sign that file.
        signature_starter.set_file_to_sign_from_path(
            os.path.join(current_app.config['APPDATA_FOLDER'], file_id))

        # Set Base64-encoded certificate's content to signature starter.
        signature_starter.set_certificate_from_base64(cert_content)

        # Set 'encapsulated content' option (default: True).
        signature_starter.encapsulated_content = True

        # Start the signature process. Receive as response the following fields:
        # - to_sign_hash:     The hash to be signed.
        # - digest_algorithm: The digest algorithm that will inform the Web PKI
        #                     component to compute the signature.
        # - transfer_file:    A temporary file to be passed to "complete" step.
        response = signature_starter.start()

        # Render the field from start() method as hidden fields to be used on
        # the javascript or on the "complete" step.
        return render_template('cades_signature_express/start.html',
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

        # Recover variables from the POST arguments to be used on this step.
        transfer_file_id = request.form['transferFileIdField']
        signature = request.form['signatureField']

        # Get an instance of the SignatureFinisher class, responsible for
        # completing the signature process.
        signature_finisher = SignatureFinisher()

        # Set PKI default options (see utils.py).
        set_pki_defaults(signature_finisher)

        # Set the file to be signed. It's the same file we used on "start"
        # method.
        signature_finisher.set_file_to_sign_from_path(
            os.path.join(current_app.config['APPDATA_FOLDER'], file_id))

        # Set the transfer file.
        signature_finisher.set_transfer_file_from_path(transfer_file_id)

        # Set the signature file.
        signature_finisher.signature = signature

        # Generate path for output file and add to the signature finisher.
        create_app_data()  # Guarantees that "app data" folder exists.
        output_file = '%s.p7s' % (str(uuid.uuid4()))
        signature_finisher.output_file = \
            os.path.join(current_app.config['APPDATA_FOLDER'], output_file)

        # Complete the signature process.
        signer_cert = signature_finisher.complete(get_cert=True)

        return render_template('cades_signature_express/signature-info.html',
                               signer_cert=signer_cert,
                               cms_file=output_file)

    except Exception as e:
        return render_template('error.html', msg=e)
