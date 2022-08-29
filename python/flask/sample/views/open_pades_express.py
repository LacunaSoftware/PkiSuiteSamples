import os

from flask import Blueprint
from flask import render_template
from flask import current_app
from pkiexpress import PadesSignatureExplorer

from sample.utils import set_pki_defaults

# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects), 
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer 
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/open-pades-express')


@blueprint.route('/<file_id>')
def index(file_id):

    # Verify if the provided userfile exists.
    file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)
    if not os.path.exists(file_path):
        return render_template('error.html', msg='File not found')

    # Get an instance of the PadesSignatureExplorer class, used to open/validate
    # PDF signatures.
    sig_explorer = PadesSignatureExplorer()

    # Set PKI default options (see utils.py)
    set_pki_defaults(sig_explorer)

    # Specify that we want to validate the signatures in the file, not only
    # inspect them.
    sig_explorer.validate = True

    # Set the PDF file to be inspected.
    sig_explorer.set_signature_file_from_path(file_path)

    # Call the open() method, which returns the signature file's information.
    signature = sig_explorer.open()

    # Render the signature opening page.
    return render_template('open_pades_express/index.html',
                           signature=signature)
