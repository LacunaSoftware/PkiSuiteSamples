import os
import uuid

from os.path import basename

from flask import Blueprint
from flask import current_app
from flask import make_response
from flask import render_template
from flask import request
from restpki_client import PadesMeasurementUnits
from restpki_client import PadesSignatureFinisher
from restpki_client import PadesSignatureStarter
from restpki_client import StandardSignaturePolicies
import base64

from cloudhub_client import TrustServiceSessionTypes, SessionCreateRequest, \
    SignHashRequest

from sample.pades_visual_elements_rest import PadesVisualElementsRest
from sample.storage_mock import create_app_data
from sample.utils import get_cloudhub_client
from sample.utils import get_expired_page_headers
from sample.utils import get_rest_pki_client
from sample.utils import get_security_context_id


# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects),
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".", "/")
blueprint = Blueprint(
    basename(__name__),
    __name__,
    url_prefix="/pades-signature-cloudhub-rest",
)


def _get_appdata_path(file_id):
    return os.path.join(current_app.config["APPDATA_FOLDER"], file_id)


@blueprint.route("/<file_id>")
def index(file_id):
    """

    This action initiates a PAdES signature using Cloudhub API service
    to retrieve the PSCs, which, in turn, will return a certificate.

    It renders a page that asks for the user's CPF, which is used to
    discover which PSCs have a certificate containing that CPF.

    """

    file_path = _get_appdata_path(file_id)
    if not os.path.exists(file_path):
        return render_template("error.html", msg="File not found")

    return render_template(
        "pades_signature_cloudhub_rest/index.html",
        file_id=file_id,
    )


@blueprint.route("/discover/<file_id>", methods=["POST"])
def discover(file_id):
    """

    This action is called after the user presses the "Search" button on
    the index page. It searches for all PSCs that have a certificate with
    the provided CPF, starts the authentication process and returns a list
    of available services so the user can choose one provider.

    """

    file_path = _get_appdata_path(file_id)
    if not os.path.exists(file_path):
        return render_template("error.html", msg="File not found")

    try:
        cpf = request.form["cpf"]

        # Process cpf, removing all formatting.
        plain_cpf = cpf.replace(".", "").replace("-", "")

        client = get_cloudhub_client()

        redirect_url = (
            "http://localhost:5000/pades-signature-cloudhub-rest/complete/"
            f"{file_id}"
        )

        # Discover PSCs and receive a URL to redirect the user to perform
        # the OAuth authentication page.
        session_request = SessionCreateRequest(
            identifier=plain_cpf,
            redirect_uri=redirect_url,
            type=TrustServiceSessionTypes.SingleSignature,
        )

        session_result = client.api_sessions_post(body=session_request)

        services = session_result.services or []

        return render_template(
            "pades_signature_cloudhub_rest/discover.html",
            cpf=cpf,
            services=services,
            file_id=file_id,
        )

    except Exception as e:
        return render_template("error.html", msg=e)


@blueprint.route("/complete/<file_id>")
def complete(file_id):
    """

    This action completes the authentication process and creates a PAdES
    signature using a session token returned by Cloudhub. It also recovers
    the id of the file that will be signed.

    """

    file_path = _get_appdata_path(file_id)
    if not os.path.exists(file_path):
        return render_template("error.html", msg="File not found")

    session = request.args.get("session")
    if not session:
        return render_template(
            "error.html",
            msg="Session parameter was not informed by Cloudhub",
        )

    try:
        client = get_cloudhub_client()

        # Get the certificate associated with the Cloudhub session.
        certificate = client.api_sessions_certificate_get(session=session)
        # print certificate in flask run terminal
        print("--------------------------------")
        print("certificate", certificate) #debug, to be removed
        print("--------------------------------")

        # Get an instance of the PadesSignatureStarter class, responsible
        # for receiving the signature elements and starting the signature
        # process.
        signature_starter = PadesSignatureStarter(get_rest_pki_client())

        # Set the unit of measurement used to edit the PDF marks and visual
        # representations.
        signature_starter.measurement_units = PadesMeasurementUnits.CENTIMETERS

        # Set certificate obtained from the cloud provider.
        signature_starter.signer_certificate = certificate

        # Set the signature policy.
        signature_starter.signature_policy = (
            StandardSignaturePolicies.PADES_BASIC
        )

        # Set the security context to be used to determine trust in the
        # certificate chain.
        signature_starter.security_context = get_security_context_id()

        # Create a visual representation for the signature.
        signature_starter.visual_representation = (
            PadesVisualElementsRest.get_visual_representation()
        )

        # Set the PDF to be signed.
        signature_starter.set_pdf_to_sign(file_path)

        start_result = signature_starter.start()

        # Request Cloudhub to sign the hash calculated by REST PKI.
        sign_hash_request = SignHashRequest(
            session=session,
            hash=start_result.to_sign_hash,
            digest_algorithm_oid=start_result.digest_algorithm_oid,
        )
        sign_hash_response = client.api_sessions_sign_hash_post(
            body=sign_hash_request
        )

        # Get an instance of the PadesSignatureFinisher class, responsible
        # for completing the signature process.
        signature_finisher = PadesSignatureFinisher(get_rest_pki_client())

        # Set the token for this signature.
        signature_finisher.token = start_result.token

        # Set the signature returned by Cloudhub.
        # Since the client lib expects a base64 decoded value, we need to decode it.
        signature_finisher.signature = base64.b64decode(sign_hash_response)

        # Call the finish() method, which finalizes the signature process
        # and returns a SignatureResult object.
        result = signature_finisher.finish()

        signer_cert = result.certificate

        # At this point, you'd typically store the signed PDF on your
        # database. For demonstration purposes, we'll store the PDF on our
        # app_data folder.
        create_app_data()  # Guarantees that "app data" folder exists.
        filename = "%s.pdf" % str(uuid.uuid4())
        result.write_to_file(
            os.path.join(current_app.config["APPDATA_FOLDER"], filename)
        )

        response = make_response(
            render_template(
                "pades_signature_cloudhub_rest/signature-info.html",
                signer_cert=signer_cert,
                signed_pdf=filename,
            )
        )
        get_expired_page_headers(response.headers)
        return response

    except Exception as e:
        return render_template("error.html", msg=e)

