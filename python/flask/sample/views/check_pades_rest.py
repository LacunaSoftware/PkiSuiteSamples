from os.path import basename, join
from time import sleep

from flask import Blueprint, render_template, current_app
from restpki_client import PadesSignatureExplorer, StandardSignaturePolicies

from sample.storage_mock import lookup_verification_code
from sample.utils import parse_verification_code, get_rest_pki_client, \
    get_security_context_id

from restpki_ng_python_client import *

# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects), 
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer 
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/check-pades-rest')


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
    file_path = join(current_app.config['APPDATA_FOLDER'], file_id)

    rest_pki_ng_client = RestPkiClient(api_key="dev-support|c40706850488334bbdbc2741df0202088ba66e5224af49f9852777230b211345",
        endpoint="https://homolog.core.pki.rest")

    # Get an instance of PadesSignatureExplorer class, used to open/validate PDF
    # signatures.
    # sig_explorer = PadesSignatureExplorer(get_rest_pki_client())
    blob_token = rest_pki_ng_client._perform_plain_uploads(file_path, open(file_path, 'rb'))

    # Open Signature
    signature = rest_pki_ng_client.open_pades_signature(
        OpenSignatureRequestModel(
            file=FileModel(
                blobToken=blob_token.blob_token,
                mimeType="application/pdf"
            ),
            validate=True,
            defaultSignaturePolicyId=StandardSignaturePolicies.PADES_BASIC, # Pades Basic
            securityContextId=get_security_context_id(), 
        )
    )

    # # Specify that we want to validate the signatures in the file, not only
    # # inspect them.
    # sig_explorer.validate = True

    # # Set the PDF file.
    # sig_explorer.signature_file_path = file_path

    # # Specify the parameters for the signature validation:
    # # Accept any PAdES signature as long as the signer has an ICP-Brasil
    # # certificate.
    # sig_explorer.default_signature_policy_id = \
    #     StandardSignaturePolicies.PADES_BASIC
    # # Specify the security context to be used to determine trust in the
    # # certificate chain. We have encapsulated the security context on utils.py.
    # sig_explorer.security_context_id = get_security_context_id()

    # # Call the open() method, which returns the signature file's information.
    # signature = sig_explorer.open()

    # Render the signature opening page.
    return render_template('check_pades_rest/index.html',
                           signature=signature,
                           file_id=file_id)
