import os
import uuid
import base64

from flask import render_template
from flask import request
from flask import current_app
from flask import Blueprint
from flask import jsonify
from restpki_client import PadesSignatureStarter
from restpki_client import PadesSignatureFinisher
from restpki_client import StandardSignaturePolicies

from sample.pades_visual_elements_rest import PadesVisualElementsRest
from sample.storage_mock import create_app_data
from sample.storage_mock import get_sample_batch_doc_path
from sample.utils import get_rest_pki_client
from sample.utils import get_security_context_id

# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects),
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".", "/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='')


@blueprint.route('/batch-pades-rest-start')
def index():
    """

    This function renders the batch signature page.

    Notice that the only thing we'll do on the server-side at this point is
    determine the IDs of the documents to be signed. The page will handle each
    document one by one and will call the server asynchronously to start and
    complete each signature.

    """

    # It is up to your application's business logic to determine which documents
    # will compose the batch.
    document_ids = list(range(1, 31))

    # Render the batch signature page.
    return render_template('batch_pades_rest_start/index.html',
                           document_ids=document_ids)


@blueprint.route('/api/batch-pades-rest-start/start/<file_id>', methods=['POST'])
def start(file_id=None):
    """

    This function is called asynchronously via AJAX by the batch signature page
    for each document being signed. It receives the ID of the document and the
    certificate content, initiates a PAdES signature using REST PKI's start()
    method and returns a JSON with the hash data and token needed for the next
    signature steps (see batch-signature-restpki-start-form.js).

    """

    # Recover variables from the POST arguments to be used in this step.
    cert_content = request.form['certContent']

    # Get an instantiate of the PadesSignatureStarter class, responsible for
    # receiving the signature elements and start the signature process.
    signature_starter = PadesSignatureStarter(get_rest_pki_client())

    # Set the document to be signed based on its ID.
    signature_starter.set_pdf_to_sign(get_sample_batch_doc_path(file_id))

    # Set the signature policy.
    signature_starter.signature_policy = \
        StandardSignaturePolicies.PADES_BASIC

    # Set a security context to determine trust in the certificate chain. We
    # have encapsulated the security context choice on util.py.
    signature_starter.security_context = get_security_context_id()

    # Set the visual representation for the signature. We have encapsulated
    # this code (on util-pades.py) to be used on various PAdES examples.
    signature_starter.visual_representation = \
        PadesVisualElementsRest.get_visual_representation()

    # Set Base64-encoded certificate's content to signature starter.
    signature_starter.signer_certificate = cert_content

    # Call the start() method, which initiates the signature.
    # This yields a SignatureStartResult containing:
    # - to_sign_hash:     The hash to be signed.
    # - digest_algorithm: The digest algorithm that will inform the Web PKI
    #                     component to compute the signature.
    # - token:            A token to be used in the complete step.
    result = signature_starter.start()

    # Return a JSON with the hash data and token obtained from REST PKI
    # (the page will use jQuery to decode this value).
    return jsonify({
        'toSignHash': result.to_sign_hash,
        'digestAlgorithm': result.digest_algorithm.name if result.digest_algorithm is not None else None,
        'token': result.token
    })


@blueprint.route('/api/batch-pades-rest-start/complete/<token>', methods=['POST'])
def complete(token=None):
    """

    This function is called asynchronously via AJAX by the batch signature page
    for each document being signed. It receives the token that identifies the
    signature process and the signature. We'll call REST PKI to complete this
    signature and return a JSON with the saved filename so that the page can
    render a link to it.

    """

    # Recover variables from the POST arguments to be used on this step.
    signature_base64 = request.form['signature']

    # Get an instance of the PadesSignatureFinisher class, responsible for
    # completing the signature process.
    signature_finisher = PadesSignatureFinisher(get_rest_pki_client())

    # Set the token.
    signature_finisher.token = token

    # Web PKI's signHash() returns a base64-encoded string, but REST PKI's
    # finish() method expects raw bytes (which it will encode internally).
    # So we need to decode the base64 string to get the raw signature bytes.
    signature_bytes = base64.standard_b64decode(signature_base64)
    signature_finisher.signature = signature_bytes

    # Call the finish() method, which finalizes the signature process. The
    # return value is the signed PDF content.
    result = signature_finisher.finish()

    # At this point, you'd typically store the signed PDF on your database.
    # For demonstration purposes, we'll store the PDF on a temporary folder
    # publicly accessible and render a link to it.

    create_app_data()  # Guarantees that "app data" folder exists.
    filename = '%s.pdf' % (str(uuid.uuid4()))
    result.write_to_file(
        os.path.join(current_app.config['APPDATA_FOLDER'], filename))

    return jsonify(filename)
