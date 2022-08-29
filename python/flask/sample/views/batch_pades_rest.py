import os
import uuid

from flask import render_template
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
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='')


@blueprint.route('/batch-pades-rest')
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
    return render_template('batch_pades_rest/index.html',
                           document_ids=document_ids)


@blueprint.route('/api/batch-pades-rest/start/<file_id>', methods=['POST'])
def start(file_id=None):
    """

    This function is called asynchronously via AJAX by the batch signature page
    for each document being signed. It receives the ID of the document and
    initiates a PAdES signature using REST PKI and returns a JSON with the
    token, which identifies this signature process, to be used in the next
    signature steps (see batch-signature-form.js).

    """

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

    # Call the start_with_webpki() method, which initiates the signature.
    # This yields the token, a 43-character case-sensitive URL-safe string,
    # which identifies this signature process. We'll use this value to call
    # the signWithRestPki() method on the Web PKI component (see
    # signature-form.js) and also to complete the signature after
    # the form is submitted (see method action()). This should not be
    # mistaken with the API access token.
    result = signature_starter.start_with_webpki()

    # Return a JSON with the token obtained from REST PKI (the page will use
    # jQuery to decode this value).
    return jsonify(result.token)


@blueprint.route('/api/batch-pades-rest/complete/<token>', methods=['POST'])
def complete(token=None):
    """

    This function is called asynchornously via AJAX by the batch signature page
    for each document being signed. It receives the tokne, that identifies the
    signature process. We'll call REST PKI to complete this signature and return
    a JSON with the saved filename so that the page can render a link to it.

    """

    # Get an intance of the PadesSignatureFinisher class, responsible for
    # completing the signature process.
    signature_finisher = PadesSignatureFinisher(get_rest_pki_client())

    # Set the token.
    signature_finisher.token = token

    # Call the finish() method, which finalizes the signature process.The
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
