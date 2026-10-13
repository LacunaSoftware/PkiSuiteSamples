"""

This sample adds a document timestamp to a PDF using REST PKI Core. It is a
server-only operation: no signature is made and Web PKI is not involved.

"""
import base64
import os
import uuid

from flask import render_template
from flask import current_app
from flask import Blueprint
from restpki_ng_python_client import PdfApi
from restpki_ng_python_client import StampPdfRequest

from sample.storage_mock import create_app_data
from sample.utils import get_rest_pki_core_client

# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects),
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/timestamp-pdf-rest-core')

# The timestamp tier that REST PKI Core uses to timestamp the PDF, passed by
# its ID or name (the Python client has no constants for the tiers). This is
# the ID of the "Lacuna Test" tier, which trial API keys can use (for
# development purposes only!). In production, use the "PKI Brazil" tier
# ('a402df41-8559-47b2-a05c-be555bf66310', the tier of the "Timestamp a PDF"
# Demo) or your account's own tier, which need an API key with access to
# them.
TIMESTAMP_TIER = '9e5b9ccd-1916-49e7-bb99-9eb259ab00f8'


@blueprint.route('/<file_id>')
def index(file_id):
    """

    This method asks REST PKI Core to add a timestamp to the PDF uploaded by
    the user, then stores the timestamped PDF and renders a page with a link
    to download it.

    """
    try:
        # Verify if the provided userfile exists.
        file_path = os.path.join(current_app.config['APPDATA_FOLDER'], file_id)
        if not os.path.exists(file_path):
            return render_template('error.html', msg='File not found')

        # Read the PDF to be timestamped.
        with open(file_path, 'rb') as f:
            file_content = f.read()

        # Build the request to timestamp the PDF. The dictionary below follows
        # the StampPdfRequest model of the REST PKI Core API (see
        # https://core.pki.rest/swagger). Binary fields are passed
        # Base64-encoded.
        stamp_request = StampPdfRequest.from_dict({

            # The PDF to be timestamped.
            'file': {
                'content': base64.b64encode(file_content).decode('ascii'),
                'contentType': 'application/pdf',
                'name': file_id,
            },

            # The timestamp tier (see TIMESTAMP_TIER above).
            'timestampTier': TIMESTAMP_TIER,
        })

        # Call REST PKI Core to timestamp the PDF. The response's "file" field
        # references the timestamped PDF.
        client = get_rest_pki_core_client()
        response = PdfApi(client).api_pdf_stamp_post(
            stamp_pdf_request=stamp_request)

        # At this point, you'd typically store the timestamped PDF on your
        # database. REST PKI Core returns the timestamped PDF inline,
        # Base64-encoded on the "content" field of "file". If it returns a
        # temporary link on the "url" field instead, we download the file from
        # it. For demonstration purposes, we'll store the timestamped PDF on
        # the "app_data" folder.
        if response.file.content:
            timestamped_content = base64.b64decode(response.file.content)
        elif response.file.url:
            download = client.call_api('GET', response.file.url)
            download.read()
            if download.status != 200:
                raise Exception('The timestamped PDF could not be downloaded '
                                '(HTTP %d)' % download.status)
            timestamped_content = download.data
        else:
            raise Exception('REST PKI Core returned no timestamped PDF')

        create_app_data()  # Guarantees that "app data" folder exists.
        filename = '%s.pdf' % (str(uuid.uuid4()))
        with open(os.path.join(current_app.config['APPDATA_FOLDER'],
                               filename), 'wb') as f:
            f.write(timestamped_content)

        return render_template('timestamp_pdf_rest_core/timestamp-info.html',
                               timestamped_pdf=filename)

    except Exception as e:
        return render_template('error.html', msg=e)
