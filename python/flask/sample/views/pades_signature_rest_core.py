"""

This sample performs a PAdES signature in three steps using REST PKI Core and
Web PKI.

"""
import base64
import os
import uuid

from flask import render_template
from flask import request
from flask import current_app
from flask import Blueprint
from restpki_ng_python_client import CompleteSignatureRequestV2
from restpki_ng_python_client import PrepareSignatureRequest
from restpki_ng_python_client import SignatureApi

from sample.storage_mock import create_app_data
from sample.storage_mock import get_pdf_stamp_content
from sample.utils import get_rest_pki_core_client
from sample.utils import get_security_context_id

# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects),
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/pades-signature-rest-core')

# Web PKI identifies the digest algorithm by its OID or by a name such as
# 'SHA-256'. REST PKI Core returns names such as 'SHA256', so we convert them
# to OIDs.
DIGEST_ALGORITHM_OIDS = {
    'MD5': '1.2.840.113549.2.5',
    'SHA1': '1.3.14.3.2.26',
    'SHA256': '2.16.840.1.101.3.4.2.1',
    'SHA384': '2.16.840.1.101.3.4.2.2',
    'SHA512': '2.16.840.1.101.3.4.2.3',
    'SHA3_256': '2.16.840.1.101.3.4.2.8',
}


@blueprint.route('/<file_id>')
def index(file_id):
    """

    This method only renders the signature page.

    """
    # Verify if the provided userfile exists.
    file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)
    if not os.path.exists(file_path):
        return render_template('error.html', msg='File not found')

    return render_template('pades_signature_rest_core/index.html')


@blueprint.route('/start/<file_id>', methods=['POST'])
def start(file_id):
    """

    This method asks REST PKI Core to prepare the signature. In this sample, it
    will be called programatically after the user press the "Sign File" button
    (see method startSignature() on static/js/signature-start-form.js).

    """
    try:
        # Recover variables from the POST arguments to be used on this step.
        cert_thumb = request.form['certThumbField']
        cert_content = request.form['certContentField']

        # Read the PDF to be signed.
        file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)
        with open(file_path, 'rb') as f:
            file_content = f.read()

        # Build the request to prepare the signature. The dictionary below
        # follows the PrepareSignatureRequest model of the REST PKI Core API
        # (see https://core.pki.rest/swagger). Binary fields are passed
        # Base64-encoded.
        prepare_request = PrepareSignatureRequest.from_dict({

            # The PDF to be signed.
            'file': {
                'content': base64.b64encode(file_content).decode('ascii'),
                'contentType': 'application/pdf',
                'name': file_id,
            },

            # The signer's certificate, as read by Web PKI on the previous
            # page (already Base64-encoded).
            'certificate': {
                'content': cert_content,
            },

            'signatureType': 'Pdf',

            # The security context determines which root certification
            # authorities are trusted when REST PKI Core validates the signer's
            # certificate (see utils.py).
            'securityContextId': get_security_context_id(),

            'pdfSignatureOptions': {
                'visualRepresentation': {
                    'text': {
                        # For a full list of the supported tags, see:
                        # https://docs.lacunasoftware.com/articles/rest-pki/pades-tags.html
                        'text': 'Signed by {{name}} ({{national_id}})',
                        'fontSize': 13.0,
                        # Specify that the signing time should also be
                        # rendered.
                        'includeSigningTime': True,
                        # Optionally set the horizontal alignment of the text
                        # ('Left' or 'Right'), if not set the default is Left.
                        'horizontalAlign': 'Left',
                        # Optionally set the container within the signature
                        # rectangle on which to place the text. By default,
                        # the text can occupy the entire rectangle.
                        'container': {
                            'left': 0.2,
                            'top': 0.2,
                            'right': 0.2,
                            'bottom': 0.2,
                        },
                    },
                    'image': {
                        # We'll use as background the image
                        # static/PdfStamp.png.
                        'resource': {
                            'content': base64.b64encode(
                                get_pdf_stamp_content()).decode('ascii'),
                            'mimeType': 'image/png',
                        },
                        # Align the image to the right.
                        'horizontalAlign': 'Right',
                        # Align the image to the center.
                        'verticalAlign': 'Center',
                    },
                    # Position the signatures side by side at the bottom of
                    # the last page. These are the values of REST PKI Core's
                    # "footnote" preset, with a larger rectangle to fit the
                    # background image.
                    'position': {
                        'pageNumber': -1,
                        'measurementUnits': 'Centimeters',
                        'auto': {
                            'container': {
                                'left': 1.0,
                                'right': 1.0,
                                'bottom': 1.0,
                                'height': 4.94,
                            },
                            'signatureRectangleSize': {
                                'width': 8.0,
                                'height': 4.94,
                            },
                            'rowSpacing': 0.3,
                        },
                    },
                },
            },
        })

        # Call REST PKI Core to prepare the signature.
        signature_api = SignatureApi(get_rest_pki_core_client())
        response = signature_api.api_signature_post(
            prepare_signature_request=prepare_request)

        # REST PKI Core validates the signer's certificate before preparing the
        # signature. If the certificate is not valid or not trusted, "success"
        # is false and "validation_results" says why.
        if not response.success:
            details = ''
            errors = (response.validation_results.errors
                      if response.validation_results is not None else None)
            if errors:
                details = ': ' + '; '.join(item.message for item in errors)
            raise Exception('The signature could not be prepared (%s)%s'
                            % (response.failure.value, details))

        # Render the fields below as hidden fields, to be used on the
        # javascript or on the "complete" step:
        # - to_sign_hash:     The hash to be signed by Web PKI,
        #                     Base64-encoded.
        # - digest_algorithm: The OID of the digest algorithm, which Web PKI
        #                     needs to sign the hash.
        # - state:            Data that REST PKI Core needs to complete the
        #                     signature, which we pass back to it on the
        #                     "complete" step.
        to_sign_hash = response.to_sign_hash
        return render_template(
            'pades_signature_rest_core/start.html',
            cert_thumb=cert_thumb,
            to_sign_hash=to_sign_hash.value,
            digest_algorithm=DIGEST_ALGORITHM_OIDS[to_sign_hash.algorithm.value],
            state=response.state)

    except Exception as e:
        return render_template('error.html', msg=e)


@blueprint.route('/complete/<file_id>', methods=['POST'])
def complete(file_id):
    """

    This function asks REST PKI Core to complete the signature, it will be
    called programatically after the Web PKI component perform the signature
    and submit the form (see method sign() on
    static/js/signature-complete-form.js).

    """
    try:

        # Recover variables form the POST arguments to be used on this step.
        state = request.form['stateField']
        signature = request.form['signatureField']

        # Call REST PKI Core to complete the signature, passing the state
        # returned on the "start" step and the signature value computed by Web
        # PKI. The response is a DocumentModel.
        client = get_rest_pki_core_client()
        document = SignatureApi(client).api_signature_completion_post(
            complete_signature_request_v2=CompleteSignatureRequestV2(
                state=state, signature=signature))

        # At this point, you'd typically store the signed PDF on your
        # database. The "url" field of "signed_file" holds a temporary link to
        # it. For demonstration purposes, we'll download the signed PDF and
        # store it on the "app_data" folder.
        download = client.call_api('GET', document.signed_file.url)
        download.read()
        if download.status != 200:
            raise Exception('The signed PDF could not be downloaded (HTTP %d)'
                            % download.status)

        create_app_data()  # Guarantees that "app data" folder exists.
        filename = '%s.pdf' % (str(uuid.uuid4()))
        with open(os.path.join(current_app.config['APPDATA_FOLDER'],
                               filename), 'wb') as f:
            f.write(download.data)

        return render_template('pades_signature_rest_core/signature-info.html',
                               signed_pdf=filename)

    except Exception as e:
        return render_template('error.html', msg=e)
