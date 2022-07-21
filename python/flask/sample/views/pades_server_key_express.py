import uuid

from os.path import basename
from os.path import exists
from os.path import join

from flask import Blueprint, request
from flask import current_app
from flask import make_response
from flask import render_template
from pkiexpress import PadesSigner
from pkiexpress import standard_signature_policies

from sample.pades_visual_elements_express import PadesVisualElementsExpress
from sample.storage_mock import create_app_data
from sample.storage_mock import get_pdf_stamp_path
from sample.utils import get_expired_page_headers
from sample.utils import set_pki_defaults

# 21-07-2022
# For some reason, Blueprint has stopped accepting names containing dots('.'),
# so the exception would be thrown at the blueprint instantiation. In order to 
# solve that we replaced all occurrences of dots with forward slash ('/'). This fix
# made the PkiSuiteSamples Flask example run normally again
__name__ = __name__.replace(".","/")
blueprint = Blueprint(basename(__name__), __name__, 
                      url_prefix='/pades-server-key-express')


@blueprint.route('/<file_id>')
def index(file_id):
    
    # Verify if the provided "file_id" exists.
    file_path = join(current_app.config['APPDATA_FOLDER'], file_id)
    if not exists(file_path):
        return render_template('error.html', msg='File not found')

    # Get an instance of the PadesSigner class, responsible for receiving
    # the signature elements and performing the local signature.
    signer = PadesSigner()

    # Set PKI default options (see utils.py).
    set_pki_defaults(signer)

    # Set signature policy.
    signer.signature_policy = standard_signature_policies.PADES_BASIC_WITH_LTV

    # Set PDF to be signed.
    signer.set_pdf_to_sign_from_path(file_path)

    # Set the PKCS #12 certificate path. There is a logic for choosing the generate the PKCS #12
    # from "issue certificate" samples or a sample PKCS #12. If no "certId" parameter is passed,
    # this example will use a default PFX file "Pierre de Fermat.pfx" stored at static/ folder.
    if request.args.get('certId', None) is None:
        # The PKCS #12 certificate path.
        signer.set_pkcs12_from_path(join(current_app.static_folder,
                                         'Pierre de Fermat.pfx'))
        # Set the certificate's PIN.
        signer.cert_password = '1234'
    else:
        # Verify if the provided certId refers to an existing certificate file and key.
        cert_id = request.args.get('certId', None)
        if not exists(join(current_app.config['APPDATA_FOLDER'], cert_id)):
            return render_template('error.html', msg='File not found')

        # Set generate PKCS #12 and its password
        signer.set_pkcs12_from_path(join(current_app.config['APPDATA_FOLDER'], cert_id))
        signer.cert_password = '1234'

    # Set a file reference for the stamp file. Note that this file can be
    # referenced later by "fref://{alias}" at the "url" field on the visual
    # representation (see content/vr.json or get_visual_representation()
    # method).
    signer.add_file_reference('stamp', get_pdf_stamp_path())

    # Set visual representation. We provide a dictionary that represents the
    # visual representation JSON model.
    signer.set_visual_representation(
        PadesVisualElementsExpress.get_visual_representation())

    # Generate path for output file and add to signer object.
    create_app_data()  # Guarantees that "app data" folder exists.
    output_file = '%s.pdf' % (str(uuid.uuid4()))
    signer.output_file = join(current_app.config['APPDATA_FOLDER'], output_file)

    # Perform the signature.
    signer_cert = signer.sign(get_cert=True)

    response = make_response(render_template(
        'pades_server_key_express/index.html',
        signer_cert=signer_cert,
        signed_pdf=output_file))
    get_expired_page_headers(response.headers)

    return response
