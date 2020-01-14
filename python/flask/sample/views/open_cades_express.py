import os

from flask import Blueprint, current_app, render_template
from pkiexpress import CadesSignatureExplorer

from sample.utils import set_pki_defaults

blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/open-cades-express')


@blueprint.route('/<file_id>')
def index(file_id):

    # Verify if the provided userfile exists.
    file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)
    if not os.path.exists(file_path):
        return render_template('error.html', msg='File not found')

    # Get an instance of the CadesSignatureExplorer class, used to open/validate
    # PKCS #12 signatures.
    sig_explorer = CadesSignatureExplorer()

    # Set PKI default options (see utils.py)
    set_pki_defaults(sig_explorer)

    # Specify that we want to validate the signatures in the file, not only
    # inspect them.
    sig_explorer.validate = True

    # Set the file to be inspected.
    sig_explorer.set_signature_file_from_path(file_path)

    # Call the open() method, which returns the signature file's information.
    signature = sig_explorer.open()

    # Render the signature opening page.
    return render_template('/open_cades_express/index.html',
                           signature=signature)
