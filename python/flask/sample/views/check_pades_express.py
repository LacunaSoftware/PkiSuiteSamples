import os

from time import sleep
from flask import Blueprint
from flask import render_template
from flask import current_app
from pkiexpress import PadesSignatureExplorer

from sample.storage_mock import lookup_verification_code
from sample.utils import set_pki_defaults
from sample.utils import parse_verification_code

# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects), 
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer 
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/check-pades-express')


@blueprint.route('/<code>')
def index(code):

    # On printer_version_pades_express, we stored the unformatted version of the
    # verification code (without hyphens), but used the formatted version (with
    # hyphens) on the printer-friendly PDF. Now, we remove the hyphens before
    # looking it up.
    verification_code = parse_verification_code(code)

    # Get document associated with verification code.
    file_id = lookup_verification_code(verification_code)
    if file_id is None:
        # Invalid code given!
        # Small delay to slow down brute-force attacks (if you want to be extra
        # careful you might want to add a CAPTCHA to the process)
        sleep(2)
        # Return "Not Found" page.
        return render_template('error.html', msg='File not found')

    # Locate document from storage.
    file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)

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
    return render_template('check_pades_express/index.html',
                           signature=signature,
                           file_id=file_id)
