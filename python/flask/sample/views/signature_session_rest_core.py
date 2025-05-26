import os
import uuid
from flask import render_template, request, Blueprint, current_app, redirect
from restpki_ng_python_client import CreateSignatureSessionRequest

from sample.utils import get_rest_pki_core_client

# Create Flask Blueprint
__name__ = __name__.replace(".", "/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/signature-session-rest-core')


@blueprint.route('/')
def index():
    """
    This function initiates a Signature Session using REST PKI Core.
    It creates a signature session and redirects the user to REST PKI.
    """
    try:
        # Get REST PKI client
        rest_pki_client = get_rest_pki_core_client()

        # Create a CreateSignatureSessionRequest
        signature_session_request = CreateSignatureSessionRequest(
            return_url=f"http://localhost:5000/signature-session-rest-core/callback",
            # If you want to disable downloads, uncomment the line below
            # 'disableDownloads': True,
        )

        # Create a signature session
        response = rest_pki_client.create_signature_session(
            signature_session_request)

        return render_template('signature_session_rest_core/index.html',
                               redirect_url=response.redirect_url)

    except Exception as e:
        return render_template('error.html', msg=e)


@blueprint.route('/callback')
def callback():
    """
    This function handles the callback from REST PKI Core after the signature session is complete.
    """
    try:
        # Get session ID from query string
        signature_session_id = request.args.get('signatureSessionId')

        if not signature_session_id:
            return redirect('/')

        # Get REST PKI client
        rest_pki_client = get_rest_pki_core_client()

        # Get signature session
        session = rest_pki_client.retrieve_signature_session_details_by_id(
            signature_session_id)

        if session.status != 'Completed':
            return redirect('/')

        return render_template('signature_session_rest_core/callback.html', session=session)

    except Exception as e:
        return render_template('error.html', msg=e)


@blueprint.route('/using-webhook')
def using_webhook():
    """
    This function initiates a Signature Session using REST PKI Core with webhook flow.
    """
    try:
        # Get REST PKI client
        rest_pki_client = get_rest_pki_core_client()

        # Create a signature session with webhook flow
        response = rest_pki_client.create_signature_session({  # TODO: implement create_signature_session()
            'returnUrl': None,  # Keep returnUrl null for webhook flow
            'enableBackgroundProcessing': True,
        })

        return render_template('signature_session_rest_core/using_webhook.html',
                               redirect_url=response.redirect_url)

    except Exception as e:
        return render_template('error.html', msg=e)
