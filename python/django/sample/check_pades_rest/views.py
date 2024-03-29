from os.path import join
from time import sleep

from django.http import HttpResponseNotFound
from django.shortcuts import render

from restpki_client import StandardSignaturePolicies
from restpki_client import PadesSignatureExplorer

from storage_mock import MEDIA_STORAGE_PATH
from storage_mock import lookup_verification_code
from utils import get_rest_pki_client, get_security_context_id
from utils import parse_verification_code

def index(request, code):
    if request.method == 'GET':
        # On printer_version_pades_express, we stored the unformatted version of the
        # verification code (without hyphens), but used the formatted version (with
        # hyphens) on the printer-friendly PDF. Now, we remove the hyphens before
        # looking it up.
        verification_code = parse_verification_code(code)
        # Get document associated with verification code.
        file_id = lookup_verification_code(request.session, verification_code)
        if file_id is None:
            # Invalid code given!
            # Small delay to slow down brute-force attacks (if you want to be extra
            # careful you might want to add a CAPTCHA to the process)
            sleep(2)
            # Return "Not Found" page.
            return HttpResponseNotFound()

        # Locate document from storage.
        file_path = join(MEDIA_STORAGE_PATH, file_id)

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
        sig_explorer.default_signature_policy_id =  StandardSignaturePolicies.PADES_BASIC
        # Specify the security context to be used to determine trust in the
        # certificate chain. We have encapsulated the security context on utils.py.
        sig_explorer.security_context_id = get_security_context_id()

        # Call the open() method, which returns the signature file's information.
        signature = sig_explorer.open()
        # Render the signature opening page.
        return render(request, 'check_pades_rest/index.html', {'signature': signature, 'file_id': file_id})
    else:
        return HttpResponseNotFound()
