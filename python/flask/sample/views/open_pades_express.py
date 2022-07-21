import os

from flask import Blueprint
from flask import render_template
from flask import current_app
from pkiexpress import PadesSignatureExplorer

from sample.utils import set_pki_defaults

# 21-07-2022
# For some reason, Blueprint has stopped accepting names containing dots('.'),
# so the exception would be thrown at the blueprint instantiation. In order to 
# solve that we replaced all occurrences of dots with forward slash ('/'). This fix
# made the PkiSuiteSamples Flask example run normally again
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
