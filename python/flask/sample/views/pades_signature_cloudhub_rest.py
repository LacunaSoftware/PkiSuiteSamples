import base64
import os
import uuid

from cloudhub_client import SessionCreateRequest
from cloudhub_client import SignHashRequest
from cloudhub_client import TrustServiceSessionTypes
from flask import Blueprint
from flask import current_app
from flask import render_template
from flask import request
from restpki_client import PadesMeasurementUnits
from restpki_client import PadesSignatureFinisher
from restpki_client import PadesSignatureStarter
from restpki_client import StandardSignaturePolicies

from sample.pades_visual_elements_rest import PadesVisualElementsRest
from sample.storage_mock import create_app_data
from sample.utils import get_cloudhub_sessions_api
from sample.utils import get_rest_pki_client
from sample.utils import get_security_context_id


# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects),
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".", "/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/pades-signature-cloudhub-rest')

# This sample signs a PDF with a cloud certificate, held by a PSC (Brazilian
# cloud certificate provider), using CloudHub. CloudHub discovers which PSCs
# hold a certificate for the user's CPF, the user authorizes the signature on
# the PSC's page, and CloudHub signs the hash of the PDF with that certificate.
# The PAdES signature itself is built with REST PKI:
#
#   1. index():    asks for the user's CPF.
#   2. discover(): creates a CloudHub session for the CPF and lists the PSCs.
#                  The user is redirected to the chosen PSC to authorize.
#   3. complete(): the PSC redirects the user back here, through CloudHub, with
#                  the session. We get the certificate from CloudHub, start the
#                  signature on REST PKI, sign its hash on CloudHub and finish
#                  the signature on REST PKI.
#
# All standard providers:
#    - BirdId
#    - ViDaaS
#    - NeoId
#    - RemoteId
#    - SafeId
#
# The providers will be listed according to the user's identifier (CPF).


@blueprint.route('/<file_id>')
def index(file_id):
    """

    This action renders a page that asks for the user's CPF. CloudHub uses it
    to discover which PSCs have a certificate for that CPF.

    """
    # Verify if the provided file exists.
    file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)
    if not os.path.exists(file_path):
        return render_template('error.html', msg='File not found')

    return render_template('pades_signature_cloudhub_rest/index.html',
                           file_id=file_id)


@blueprint.route('/discover/<file_id>', methods=['POST'])
def discover(file_id):
    """

    This action is called after the user presses the "Search" button on the
    index page. It creates a CloudHub session for the given CPF, which returns
    the PSCs that have a certificate for it, each one with the URL where the
    user authorizes the signature.

    """
    try:
        # Verify if the provided file exists.
        file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)
        if not os.path.exists(file_path):
            return render_template('error.html', msg='File not found')

        # Recover CPF from the POST arguments and remove its formatting.
        cpf = request.form['cpf']
        plain_cpf = cpf.replace('.', '').replace('-', '')

        # Get an instance of the SessionsApi class, responsible for
        # communicating with CloudHub (see utils.py).
        sessions_api = get_cloudhub_sessions_api()

        # The URL where CloudHub sends the user back after the user authorizes
        # the signature on the PSC. CloudHub appends the "session" query
        # parameter to it. This URL must be authorized for your CloudHub API
        # key, and in your application it must be a public URL.
        redirect_uri = 'http://localhost:5000/pades-signature-cloudhub-rest/complete/%s' % file_id

        # Create a session that allows a single signature. The response lists
        # the PSCs that have a certificate for the given CPF.
        session_request = SessionCreateRequest(
            identifier=plain_cpf,
            redirect_uri=redirect_uri,
            type=TrustServiceSessionTypes.SingleSignature)
        session = sessions_api.api_sessions_post(body=session_request)

        return render_template('pades_signature_cloudhub_rest/discover.html',
                               file_id=file_id,
                               services=session.services or [])

    except Exception as e:
        return render_template('error.html', msg=e)


@blueprint.route('/complete/<file_id>')
def complete(file_id):
    """

    This action is called by the PSC, through CloudHub, after the user
    authorizes the signature. It receives the CloudHub session on the "session"
    query parameter and uses it to get the user's certificate and to sign the
    hash of the PDF.

    """
    try:
        # Verify if the provided file exists.
        file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)
        if not os.path.exists(file_path):
            return render_template('error.html', msg='File not found')

        # Recover the CloudHub session from the query parameters.
        session = request.args.get('session')
        if not session:
            return render_template('error.html',
                                   msg='The CloudHub session was not received')

        sessions_api = get_cloudhub_sessions_api()

        # Get the user's certificate (Base64-encoded) from CloudHub.
        certificate = sessions_api.api_sessions_certificate_get(session=session)

        # Get an instance of the PadesSignatureStarter class, responsible for
        # receiving the signature elements and start the signature process.
        signature_starter = PadesSignatureStarter(get_rest_pki_client())

        # Set the user's certificate. Since the signature is not done by Web PKI,
        # REST PKI needs the certificate to compute the hash to be signed.
        signature_starter.signer_certificate = certificate

        # Set the PDF to be signed.
        signature_starter.set_pdf_to_sign_from_path(file_path)

        # Set the signature policy.
        signature_starter.signature_policy = \
            StandardSignaturePolicies.PADES_BASIC

        # Set a security context to be used to determine trust in the
        # certificate chain. We have encapsulated the security context choice on
        # utils.py.
        signature_starter.security_context = get_security_context_id()

        # Set the unit of measurement used to edit the PDF marks and visual
        # representations.
        signature_starter.measurement_units = PadesMeasurementUnits.CENTIMETERS

        # Set the visual representation for the signature. We have encapsulated
        # this code (on pades_visual_elements_rest.py) to be used on various
        # PAdES examples.
        signature_starter.visual_representation = \
            PadesVisualElementsRest.get_visual_representation()

        # Call the start() method, which initiates the signature. This yields
        # the hash to be signed (Base64-encoded), the OID of the digest
        # algorithm used to compute it and the token, which identifies this
        # signature process on REST PKI. The token should not be mistaken with
        # the API access token.
        result = signature_starter.start()

        # Ask CloudHub to sign the hash with the user's cloud certificate. It
        # returns the signature value, Base64-encoded.
        sign_hash_request = SignHashRequest(
            session=session,
            hash=result.to_sign_hash,
            digest_algorithm_oid=result.digest_algorithm_oid)
        signature = sessions_api.api_sessions_sign_hash_post(
            body=sign_hash_request)

        # Get an instance of the PadesSignatureFinisher class, responsible for
        # completing the signature process.
        signature_finisher = PadesSignatureFinisher(get_rest_pki_client())

        # Set the token and the signature value (the finisher expects the raw
        # bytes of the signature value).
        signature_finisher.token = result.token
        signature_finisher.signature = base64.b64decode(signature)

        # Call the finish() method, which finalizes the signature process. The
        # return value is the signed PDF content.
        signature_result = signature_finisher.finish()

        # Get information about the certificate used by the user to sign the
        # file. This method must only be called after calling the finish()
        # method.
        signer_cert = signature_result.certificate

        # At this point, you'd typically store the signed PDF on your database.
        # For demonstration purposes, we'll store the PDF on a temporary folder
        # publicly accessible and render a link to it.
        create_app_data()  # Guarantees that "app data" folder exists.
        filename = '%s.pdf' % (str(uuid.uuid4()))
        signature_result.write_to_file(
            os.path.join(current_app.config['APPDATA_FOLDER'], filename))

        return render_template('pades_signature_cloudhub_rest/complete.html',
                               signer_cert=signer_cert,
                               signed_pdf=filename)

    except Exception as e:
        return render_template('error.html', msg=e)
