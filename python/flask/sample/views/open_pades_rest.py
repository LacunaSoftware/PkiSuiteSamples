from os.path import exists
from os.path import basename
from os.path import join
from flask import Blueprint
from flask import current_app
from flask import render_template
from restpki_client import PadesSignatureExplorer
from restpki_client import StandardSignaturePolicies

from sample.utils import get_rest_pki_client
from sample.utils import get_security_context_id

blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/open-pades-rest')


@blueprint.route('/<file_id>')
def index(file_id):

    # Verify if the provided userfile exists.
    file_path = join(current_app.config['APPDATA_FOLDER'], file_id)
    if not exists(file_path):
        return render_template('error.html', msg='File not found')

    # Get an instance of PadesSignatureExplorer class, used to open/validate PDF
    # signatures.
    sig_explorer = PadesSignatureExplorer(get_rest_pki_client())

    # Specify that we want to validate the signatures in the file, not only
    # inspect them.
    sig_explorer.validate = True

    # Set the PDF file.
    sig_explorer.signature_file_path = file_path

    # Specify the parameters for the signature validation:
    # Accept any PAdES signature as long as the signer has an ICP-Brasil
    # certificate.
    sig_explorer.default_signature_policy_id = \
        StandardSignaturePolicies.PADES_BASIC
    # Specify the security context to be used to determine trust in the
    # certificate chain. We have encapsulated the security context on utils.py.
    sig_explorer.security_context_id = get_security_context_id()

    # Call the open() method, which returns the signature file's information.
    signature = sig_explorer.open()

    # Render the information (see file templates/open_pades_rest/index.html for
    # more information on the information returned)
    return render_template('open_pades_rest/index.html',
                           signature=signature)
