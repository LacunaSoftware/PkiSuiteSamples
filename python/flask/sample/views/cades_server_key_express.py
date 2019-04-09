import uuid

from os.path import basename
from os.path import exists
from os.path import join

from flask import Blueprint
from flask import current_app
from flask import make_response
from flask import render_template
from pkiexpress import CadesSigner
from pkiexpress import standard_signature_policies

from sample.storage_mock import create_app_data
from sample.utils import get_expired_page_headers
from sample.utils import set_pki_defaults

blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/cades-server-key-express')


@blueprint.route('/<file_id>')
def index(file_id=None):
    # Verify if the provided "file_id" exists.
    file_path = join(current_app.config['APPDATA_FOLDER'], file_id)
    if not exists(file_path):
        return render_template('error.html', msg='File not found')

    # Get an instance of the CadesSigner class, responsible for receiving
    # the signature elements and performing the local signature.
    signer = CadesSigner()

    # Set PKI default options (see utils.py).
    set_pki_defaults(signer)

    # Set signature policy.
    signer.signature_policy = \
        standard_signature_policies.PKI_BRAZIL_CADES_ADR_BASICA

    # Set file to be signed. If the file is a CSM, the PKI Express will
    # recognize that and will co-sign that file.
    signer.set_file_to_sign_from_path(file_path)

    # The PKCS #12 certificate path.
    signer.set_pkcs12_from_path(join(current_app.static_folder,
                                     'Pierre de Fermat.pfx'))
    # Set the certificate's PIN.
    signer.cert_password = '1234'

    # Set 'encapsulate content' option (default: True).
    signer.encapsulated_content = True

    # Generate path for output file and add to signer object.
    create_app_data()  # Guarantees that "app_data" folder exists.
    output_file = '%s.p7s' % (str(uuid.uuid4()))
    signer.output_file = join(current_app.config['APPDATA_FOLDER'], output_file)

    # Perform the signature.
    signer_cert = signer.sign(get_cert=True)

    response = make_response(render_template(
        'cades_server_key_express/index.html',
        signer_cert=signer_cert,
        cms_file=output_file))
    get_expired_page_headers(response.headers)

    return response
