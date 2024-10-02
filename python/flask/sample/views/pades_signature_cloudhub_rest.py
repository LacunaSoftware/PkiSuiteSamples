import base64
import os
import uuid

from os.path import basename
from os.path import exists
from os.path import join

from flask import request
from flask import Blueprint
from flask import current_app
from flask import make_response
from flask import render_template
from flask import redirect



from sample.pades_visual_elements_express import PadesVisualElementsExpress
from sample.storage_mock import create_app_data
from sample.storage_mock import get_pdf_stamp_path
from sample.utils import get_expired_page_headers, get_security_context_id
from sample.utils import get_cloudhub_client_api

from sample.pades_visual_elements_rest import PadesVisualElementsRest
from restpki_client import PadesSignatureStarter
from restpki_client import PadesSignatureFinisher
from restpki_client import StandardSignaturePolicies

from cloudhub_client import SessionCreateRequest, TrustServiceSessionTypes, SignHashRequest

from sample.utils import get_rest_pki_client

# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects),
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".", "/")
blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/pades-signature-cloudhub-rest')

# This sample is responsible to perform a OAuth flow to communicate with PSCs to perform a
# signature. To perform this sample it's necessary to configure PKI Express with the credentials of
# the services by executing the following sample:
#
#    pkie config --set trustServices:<provider>:<configuration>
#
# All standard providers:
#    - BirdId
#    - ViDaaS
#    - NeoId
#    - RemoteId
#    - SafeId
# It's possible to create a custom provider if necessary.
#
# All configuration available:
#    - clientId
#    - clientSecret
#    - endpoint
#    - provider
#    - badgeUrl
#    - protocolVariant (error handling, normally it depends on the used provider)
#
# This sample will only show the PSCs that are configured.



@blueprint.route('/<file_id>')
def index(file_id):
    """

    This action will render a page that request a CPF to the user. This CPF is used to discover 
    which PSCs have a certificate containing that CPF.

    """
    # Verify if the provided userfile exists.
    file_path = join(current_app.config['APPDATA_FOLDER'], file_id)
    if not exists(file_path):
        return render_template('error.html', msg='File not found')

    return render_template('pades_signature_cloudhub_rest/index.html')


@blueprint.route('/discover/<file_id>', methods=['POST'])
def discover(file_id):
    """

    This action will be called after the user press the button "Search" on index page. It will
    search for all PSCs that have a certificate with the provided CPF. Thus, it will start the
    authentication process and return a URL to redirect the user to perform the authentication.

    After this action the user will be redirected, and to store the local data (fileId) to be user
    after the user returns to your application. We use the parameter "customState", the last
    parameter of the method discoverByCpfAndStartAuth(). This parameter will be recovered in the
    next action.

    """
    try:
        # Call cloudhub client library and start a session to retrieve the user's certificate
        sessions_api = get_cloudhub_client_api()
        # Recover CPF from the POST argument.
        cpf = request.form['cpf']

        # Process cpf, removing all formatting.
        plainCpf = cpf.replace(".", "").replace("-", "")

        # create an instance of the API class
        create_session_request = SessionCreateRequest(
            identifier=plainCpf,
            type=TrustServiceSessionTypes.SingleSignature,
            redirect_uri=f"http://localhost:5000/pades-signature-cloudhub-rest/complete/fileId={file_id}"
        )
        api_response = sessions_api.api_sessions_post(
            body=create_session_request)

        # Render complete page.
        return render_template('pades_signature_cloudhub_rest/discover.html', cpf=cpf, services=api_response)

    except Exception as e:
        return render_template('error.html', msg=e)


@blueprint.route('/complete/fileId=<file_id>', methods=['GET'])
def complete(file_id):
    """

    This action will complete the authentication process and create a signature using a session
    token returned by user. Also, we recover the parameter "customState" containing the id of the
    file that will be signed.

    """
    try:
        # Call cloudhub client library
        sessions_api = get_cloudhub_client_api()
        # Extract fileId and session from query parameters
        session = request.args.get('session')

        if not file_id or not session:
            return render_template('error.html', msg='FileId or session parameter is missing')

        # Verify if the provided file_id exists.
        file_path = join(current_app.config['APPDATA_FOLDER'], file_id)
        if not exists(file_path):
            return render_template('error.html', msg='File not found')

        # Recover variables from query parameters.
        session = request.args.get('session')

        # Get the certificate from the Sessions API
        cert = sessions_api.api_sessions_certificate_get(session=session)

        # Start the signature process

        # Get an instantiate of the PadesSignatureStarter class, responsible for
        # receiving the signature elements and start the signature process.
        signature_starter = PadesSignatureStarter(get_rest_pki_client())

        # Set the PDF to be signed.
        signature_starter.set_pdf_to_sign(
            '%s/%s' % (current_app.config['APPDATA_FOLDER'], file_id))

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

        signature_starter.signer_certificate = cert

        # Call the start() method, which initiates the signature.
        # This yields the token, a 43-character case-sensitive URL-safe string,
        # which identifies this signature process. We'll use this value to call
        # the signWithRestPki() method on the Web PKI component (see
        # signature-form.js javascript) and also to complete the signature after
        # the form is submitted (see method pades_signature_action()). This
        # should not be mistaken with the API access token.
        result = signature_starter.start()

        # Perform the hash signature
        sign_hash_request = SignHashRequest(
            session=session,
            hash=result.to_sign_hash,
            digest_algorithm_oid=result.digest_algorithm_oid
        )
        signed_hash = sessions_api.api_sessions_sign_hash_post(body=sign_hash_request)

        # Finish the signature process

        # Get an intance of the PadesSignatureFinisher class, responsible for
        # completing the signature process.
        signature_finisher = PadesSignatureFinisher(get_rest_pki_client())

        # Set the token.
        signature_finisher.token = result.token
        signed_hash_bytes = base64.b64decode(signed_hash)

        # Set the signed hash previously signed by cloudhub
        signature_finisher.signature = signed_hash_bytes

        signature_finisher.force_blob_result = False
        # Call the finish() method, which finalizes the signature process. The
        # return value is the signed PDF content.
        sig_result = signature_finisher.finish()

        # At this point, you'd typically store the signed PDF on your database.
        # For demonstration purposes, we'll store the PDF on a temporary folder
        # publicly accessible and render a link to it.

        create_app_data()  # Guarantees that "app data" folder exists.
        filename = '%s.pdf' % (str(uuid.uuid4()))
        sig_result.write_to_file(os.path.join(
            current_app.config['APPDATA_FOLDER'], filename))

        # Perform the signature.
        # signer_cert = signer.sign(get_cert=False)

        response = make_response(render_template(
            'pades_signature_cloudhub_rest/signature-info.html',
            signed_pdf=filename))

        return response

    except Exception as e:
        return render_template('error.html', msg=e)
