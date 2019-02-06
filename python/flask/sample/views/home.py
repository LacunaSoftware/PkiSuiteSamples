import os

from flask import current_app
from flask import Blueprint
from flask import render_template
from flask import redirect
from pkiexpress import InstallationNotFoundError
from pkiexpress import PadesSignatureStarter

from sample.storage_mock import get_sample_doc_path

blueprint = Blueprint(os.path.basename(__name__), __name__, url_prefix='/')


@blueprint.route('/')
def index():
    """

    This function will render the main page.

    """
    return render_template('home/index.html')

@blueprint.route('/check-pki-express/<rc>')
@blueprint.route('/check-pki-express/<rc>/<fwd>')
@blueprint.route('/check-pki-express/<rc>/<fwd>/<op>')
def check_pki_express(rc, fwd=None, op=None):
    """
    
    This function will check PKI Express installation.
    
    """
    try:
        starter = PadesSignatureStarter()
        starter.set_pdf_to_sign_from_path(get_sample_doc_path())
        starter.set_certificate_from_base64('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')
        starter.start()
    except InstallationNotFoundError:
        return render_template('home/express-installation-not-found.html')

    if fwd is not None and len(fwd) > 0:
        if op is not None and len(op) > 0:
            return redirect('/%s/%s-express/%s' % (rc, fwd, op))
        return redirect('/%s/%s-express' % (rc, fwd))
    return redirect('/%s-express' % rc)

@blueprint.route('/check-restpki-token/<rc>')
@blueprint.route('/check-restpki-token/<rc>/<fwd>')
@blueprint.route('/check-restpki-token/<rc>/<fwd>/<op>')
def check_restpki_token(rc, fwd=None, op=None):
    """

    This function will check if the REST PKI token is set.

    """
    access_token = current_app.config['REST_PKI_ACCESS_TOKEN']
    if access_token is None or len(access_token) == 0:
        return render_template('home/restpki-token-not-set.html')

    if fwd is not None and len(fwd) > 0:
        if op is not None and len(op) > 0:
            return redirect('/%s/%s-restpki/%s' % (rc, fwd, op))
        return redirect('/%s/%s-restpki' % (rc, fwd))
    return redirect('/%s-restpki' % rc)
