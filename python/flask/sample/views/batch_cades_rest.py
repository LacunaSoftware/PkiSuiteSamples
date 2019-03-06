import uuid

from os.path import basename
from os.path import join

from flask import Blueprint
from flask import current_app
from flask import jsonify
from flask import render_template
from restpki_client import CadesSignatureFinisher
from restpki_client import CadesSignatureStarter
from restpki_client import StandardSignaturePolicies


from sample.storage_mock import create_app_data
from sample.storage_mock import get_sample_batch_doc_path
from sample.utils import get_restpki_client
from sample.utils import get_security_context_id

blueprint = Blueprint(basename(__name__), __name__)


@blueprint.route('/batch-cades-restpki')
def index():
    # It is up to your application's business logic to determine which documents
    # will compose the batch.
    document_ids = list(range(1, 31))

    # Render the batch signature signature page.
    return render_template('batch_cades_rest/index.html',
                           document_ids=document_ids)


@blueprint.route('/api/batch-cades-restpki/start/<file_id>', methods=['POST'])
def start(file_id):
    # Get an instantiate of the CadesSignatureStarter class, responsible for
    # receiving the signature elements and start the signature process.
    signature_starter = CadesSignatureStarter(get_restpki_client())

    # Set the document to be signed based on its ID.
    signature_starter.set_file_to_sign_path(get_sample_batch_doc_path(file_id))

    # Set the signature policy.
    signature_starter.signature_policy = \
        StandardSignaturePolicies.PKI_BRAZIL_CADES_ADR_BASICA

    # Set a security context. We have encapsulated the security context
    # choice on util.py.
    signature_starter.security_context = get_security_context_id()

    # Optionally, set whether the content should be encapsulated in the
    # resulting CMS. If this parameter is ommitted, the following rules
    # apply:
    # - If no CmsToCoSign is given, the resulting CMS will include the
    # content.
    # - If a CmsToCoSign is given, the resulting CMS will include the
    # content if and only if the CmsToCoSign also includes the content.
    #
    signature_starter.encapsulate_content = True

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


@blueprint.route('/api/batch-cades-restpki/complete/<token>', methods=['POST'])
def complete(token):
    # Get an instance of the CadesSignatureFinisher class, responsible for
    # completing the signature process.
    signature_finisher = CadesSignatureFinisher(get_restpki_client())

    # Set the token.
    signature_finisher.token = token

    # Call the finish() method, which finalizes the signature process.The
    # return value is the CMS content.
    result = signature_finisher.finish()

    # At this point, you'd typically store the signed PDF on your database.
    # For demonstration purposes, we'll store the CMS on a temporary folder
    # publicly accessible and render a link to it.

    create_app_data()  # Guarantees that "app data" folder exists.
    filename = '%s.p7s' % (str(uuid.uuid4()))
    result.write_to_file(
        join(current_app.config['APPDATA_FOLDER'], filename))

    return jsonify(filename)
