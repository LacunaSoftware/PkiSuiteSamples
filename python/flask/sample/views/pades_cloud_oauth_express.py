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
from pkiexpress import PadesSigner
from pkiexpress import TrustServicesManager
from pkiexpress import standard_signature_policies
from pkiexpress import trust_service_session_types

from sample.pades_visual_elements_express import PadesVisualElementsExpress
from sample.storage_mock import create_app_data
from sample.storage_mock import get_pdf_stamp_path
from sample.utils import get_expired_page_headers
from sample.utils import set_pki_defaults

blueprint = Blueprint(basename(__name__), __name__, 
                      url_prefix='/pades-cloud-oauth-express')

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

@blueprint.route('/complete', methods=['GET'])
def complete():
    """

    This action will complete the authentication process and create a signature using a session
    token returned by user. Also, we recover the parameter "customState" containing the id of the
    file that will be signed.

    """
    try:
        # Recover variables from query parameters.
        code = request.args.get('code')
        state = request.args.get('state')

        # Get an instance of the TrustServiceManager class, responsible for communicating with 
        # PSCs and handling the OAuth flow.
        manager = TrustServicesManager()

        # Complete the authentication process, recovering the session info to be used on the
        # signature and the custom state (fileId).
        result = manager.complete_auth(code, state)

        # Recover file id on custom state parameter.
        file_id = result.custom_state

        # Verify if the provided file_id exists.
        file_path = join(current_app.config['APPDATA_FOLDER'], file_id)
        if not exists(file_path):
            return render_template('error.html', msg='File not found')

        # Get an instance of the PadesSigner class, responsible for receiving
        # the signature elements and performing the local signature.
        signer = PadesSigner()

        # Set PKI default options (see utils.py).
        set_pki_defaults(signer)

        # Set signature policy.
        signer.signature_policy = standard_signature_policies.PADES_BASIC_WITH_LTV

        # Set PDF to be signed.
        signer.set_pdf_to_sign_from_path(file_path)

        # Set trust session acquired on the following steps of this sample.
        signer.trust_service_session = result.session

        # Set a file reference for the stamp file. Note that this file can be
        # referenced later by "fref://{alias}" at the "url" field on the visual
        # representation (see content/vr.json or get_visual_representation()
        # method).
        signer.add_file_reference('stamp', get_pdf_stamp_path())

        # Set visual representation. We provide a dictionary that represents the
        # visual representation JSON model.
        signer.set_visual_representation(
            PadesVisualElementsExpress.get_visual_representation())

        # Generate path for output file and add to signer object.
        create_app_data()  # Guarantees that "app data" folder exists.
        output_file = '%s.pdf' % (str(uuid.uuid4()))
        signer.output_file = join(current_app.config['APPDATA_FOLDER'], output_file)

        # Perform the signature.
        signer_cert = signer.sign(get_cert=False)

        response = make_response(render_template(
            'pades_cloud_oauth_express/signature-info.html',
            signed_pdf=output_file))
        get_expired_page_headers(response.headers)

        return response

    except Exception as e:
        return render_template('error.html', msg=e)


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

    return render_template('pades_cloud_oauth_express/index.html')


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
        # Recover CPF from the POST argument.
        cpf = request.form['cpf']

        # Process cpf, removing all formatting.
        plainCpf = cpf.replace(".", "").replace("-", "")

        # Get an instance of the TrustServiceManager class, responsible for communicating with 
        # PSCs and handling the OAuth flow.
        manager = TrustServicesManager()

        # Discover PSCs and receive a URL to redirect the user to perform the OAuth authentication
        # page. As mentioned before, we pass the id of the file to be signed as the last parameter
        # of the following method. The next action will recover this information.
        services = manager.discover_by_cpf_and_start_auth(plainCpf, 
            "http://localhost:5000/pades-cloud-oauth-express/complete", 
            trust_service_session_types.SIGNATURE_SESSION,
            file_id)

        # Render complete page.
        return render_template('pades_cloud_oauth_express/discover.html', cpf = cpf, services = services)

    except Exception as e:
        return render_template('error.html', msg=e)