import uuid

from flask import Blueprint
from flask import current_app
from flask import jsonify
from flask import render_template
from flask import request
from os.path import basename
from os.path import join

from pkiexpress import CadesSignatureStarter
from pkiexpress import SignatureFinisher
from pkiexpress import standard_signature_policies

from sample.storage_mock import create_app_data
from sample.storage_mock import get_sample_batch_doc_path
from sample.utils import set_pki_defaults

blueprint = Blueprint(basename(__name__), __name__)


@blueprint.route('/batch-cades-express')
def index():
    # It is up to your application's business logic to determine which documents
    # will compose the batch.
    document_ids = list(range(1, 31))

    # Render the batch signature signature page.
    return render_template('batch_cades_express/index.html',
                           document_ids=document_ids)


@blueprint.route('/api/batch-cades-express/start', methods=['POST'])
def start():
    # Recover variables from the POST arguments to be used in this step.
    file_id = request.form['id']
    cert_content = request.form['certContent']

    # Get an instance of the CadesSignatureStarter class, responsible for
    # receiving the signature elements and start the signature process.
    signature_starter = CadesSignatureStarter()

    # Set PKI default options (see utils.py).
    set_pki_defaults(signature_starter)

    # Set signature policy.
    signature_starter.signature_policy = \
        standard_signature_policies.PKI_BRAZIL_CADES_ADR_BASICA

    # Set file to be signed based on its ID.
    signature_starter.set_file_to_sign_from_path(
        get_sample_batch_doc_path(file_id))

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

    return jsonify(response)


@blueprint.route('/api/batch-cades-express/complete', methods=['POST'])
def complete():
    # Recover variables from the POST arguments to be used on this step.
    file_id = request.form['id']
    transfer_file = request.form['transferFile']
    signature = request.form['signature']

    # Get an instance of the SignatureFinisher class, responsible for completing
    # the signature process.
    signature_finisher = SignatureFinisher()

    # Set PKI default options (see utils.py).
    set_pki_defaults(signature_finisher)

    # Set the file to be signed. It's the same file we use don "start" method.
    signature_finisher.set_file_to_sign_from_path(
        get_sample_batch_doc_path(file_id))

    # Set the transfer file.
    signature_finisher.set_transfer_file_from_path(transfer_file)

    # Set the signature file.
    signature_finisher.signature = signature

    # Generate path for output file and add to the signature finisher.
    create_app_data()  # Guarantees that "app data" folder exists.
    filename = '%s.p7s' % (str(uuid.uuid4()))
    signature_finisher.output_file = \
        join(current_app.config['APPDATA_FOLDER'], filename)

    # Complete the signature process.
    signature_finisher.complete()

    return jsonify(filename)
