import os

from flask import current_app
from flask import Blueprint
from flask import render_template
from flask import redirect
from pkiexpress import Authentication
from pkiexpress import InstallationNotFoundError

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
        auth = Authentication()
        auth.start()
    except InstallationNotFoundError:
        return render_template('home/express-installation-not-found.html')

    if fwd is not None and len(fwd) > 0:
        if op is not None and len(op) > 0:
            return redirect('/%s/%s-express/%s' % (rc, fwd, op))
        return redirect('/%s/%s-express' % (rc, fwd))
    return redirect('/%s-express' % rc)


@blueprint.route('/check-rest-token/<rc>')
@blueprint.route('/check-rest-token/<rc>/<fwd>')
@blueprint.route('/check-rest-token/<rc>/<fwd>/<op>')
def check_rest_token(rc, fwd=None, op=None):
    """

    This function will check if the REST PKI token is set.

    """
    access_token = current_app.config['REST_PKI_ACCESS_TOKEN']
    if access_token is None or len(access_token) == 0:
        return render_template('home/rest-token-not-set.html')

    if fwd is not None and len(fwd) > 0:
        if op is not None and len(op) > 0:
            return redirect('/%s/%s-rest/%s' % (rc, fwd, op))
        return redirect('/%s/%s-rest' % (rc, fwd))
    return redirect('/%s-rest' % rc)
