"""

This sample performs a batch of PAdES signatures using PKI Express and Web PKI.

"""
import os
import uuid

from flask import Blueprint
from flask import current_app
from flask import jsonify
from flask import request
from flask import render_template
from pkiexpress import PadesSignatureStarter
from pkiexpress import SignatureFinisher
from pkiexpress import standard_signature_policies

from sample.pades_visual_elements_express import PadesVisualElementsExpress
from sample.storage_mock import create_app_data
from sample.storage_mock import get_pdf_stamp_path
from sample.storage_mock import get_sample_batch_doc_path
from sample.utils import set_pki_defaults


blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/batch-pades-signature-express')

@blueprint.route('/')
def index():
    """

    This method renders the batch signature page.

    Notice that the only thing we'll do on the server-side at this point is
    determine the IDs of the documents to be signed. The page will handle each
    document one by one and will call the server asynchronously to start and
    complete each signature.

    """
    # It is up to your application's business logic to determine which documents
    # will compose the batch.
    document_ids = list(range(1, 31))

    # Render the batch signature signature page.
    return render_template('batch_pades_signature_express/index.html',
                           document_ids=document_ids)

@blueprint.route('/start', methods=['POST'])
def start():
    """

    This method is called asynchronously via AJAX by the batch signature page
    for each document being signed. It receives the ID of the document and
    initiates a PAdES signature using PKI Express and returns a JSON with the
    data needed in the next signature steps (see batch-signature-form.js).

    """

    # Recover variables from the POST arguments to be used in this step.
    file_id = request.form['id']
    cert_content = request.form['certContent']

    # Get an instance of the PadesSignatureStarter, responsible for receiving
    # the signature elements and start the signature process.
    signature_starter = PadesSignatureStarter()

    # Set PKI default options (see utils.py).
    set_pki_defaults(signature_starter)

    # Set signature policy.
    signature_starter.signature_policy = \
        standard_signature_policies.PADES_BASIC_WITH_LTV

    # Set PDF to be signed based on its ID.
    signature_starter.set_pdf_to_sign_from_path(
        get_sample_batch_doc_path(file_id))

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

    return jsonify(response)


@blueprint.route('/complete', methods=['POST'])
def complete():
    """

    This method is called asynchronously via AJAX by the batch signature page
    for each document being signed. We'll cal PKI Express to complete this
    signature and return a JSOn with the save filename so that the page a link
    to it.

    """

    # Recover variables from the POST arguments to be used on this step.
    file_id = request.form['id']
    transfer_file = request.form['transferFile']
    signature = request.form['signature']

    # Get an instance of the SignatureFinisher class, responsible for completing
    # the signature process.
    signature_finisher = SignatureFinisher()

    # Set PKI default options (see utils.py).
    set_pki_defaults(signature_finisher)

    # Set PDF to be signed. It's the same file we used on "start" method.
    signature_finisher.set_file_to_sign_from_path(
        get_sample_batch_doc_path(file_id))

    # Set the transfer file.
    signature_finisher.set_transfer_file_from_path(transfer_file)

    # Set the signature file.
    signature_finisher.signature = signature

    # Generate path for output file and add to the signature finisher.
    create_app_data() # Guarantees that "app data" folder exists.
    filename = '%s.pdf' % (str(uuid.uuid4()))
    signature_finisher.output_file = \
        os.path.join(current_app.config['APPDATA_FOLDER'], filename)

    # Complete the signature process.
    signature_finisher.complete()

    return jsonify(filename)
