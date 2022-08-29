import uuid

from os.path import basename
from os.path import join

from flask import Blueprint
from flask import current_app
from flask import make_response
from flask import render_template
from flask import request
from restpki_client import StandardSignaturePolicies
from restpki_client import XmlElementSignatureStarter
from restpki_client import XmlSignatureFinisher

from sample.storage_mock import create_app_data
from sample.storage_mock import get_sample_nfe_path
from sample.utils import get_expired_page_headers
from sample.utils import get_rest_pki_client
from sample.utils import get_security_context_id

# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects), 
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer 
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/xml-nfe-signature-rest')


@blueprint.route('/')
def index():
    # Instantiate the XmlElementSignatureStarter class, responsible for
    # receiving the signature elements and start the signature process.
    signature_starter = XmlElementSignatureStarter(get_rest_pki_client())

    # Set the XML to be signed, a sample XML Document.
    signature_starter.set_xml_to_sign(get_sample_nfe_path())

    # Set the ID of the element to be signed.
    signature_starter.to_sign_element_id = \
        'NFe35141214314050000662550010001084271182362300'

    # Set the signature policy.
    signature_starter.signature_policy = \
        StandardSignaturePolicies.NFE_PADRAO_NACIONAL

    # Set a security context to be used to determine trust in the
    # certificate chain. We have encapsulated the security context choice on
    # util.py.
    signature_starter.security_context = get_security_context_id()

    # Call the start_with_webpki() method, which initiates the signature.
    # This yields the token, a 43-character case-sensitive URL-safe string,
    # which identifies this signature process. We'll use this value to call
    # the signWithRestPki() method on the Web PKI component (see
    # signature-form.js javascript) and also to complete the signature after
    # the form is submitted (see method action()). This should not be
    # mistaken with the API access token.
    result = signature_starter.start_with_webpki()

    # The token acquired above can only be used for a single signature
    # attempt. In order to retry the signature it is necessary to get a new
    # token. This can be a problem if the user uses the back button of the
    # browser, since the browser might show a cached page that we rendered
    # previously, with a now stale token. We force page expiration through
    # HTTP headers to prevent caching of the page.
    response = make_response(
        render_template('xml_nfe_signature_rest/index.html',
                        token=result.token))
    get_expired_page_headers(response.headers)
    return response


@blueprint.route('/', methods=['POST'])
def action():
    # Get the token for this signature. (rendered in a hidden input field, see
    # xml-signature/index.html template)
    token = request.form['token']

    # Instantiate the XmlSignatureFinisher class, responsible for completing
    # the signature process.
    signature_finisher = XmlSignatureFinisher(get_rest_pki_client())

    # Set the token.
    signature_finisher.token = token

    # Call the finish() method, which finalizes the signature process and
    # returns the signed XML.
    result = signature_finisher.finish()

    # Get information about the certificate used by the user to sign the file.
    # This method must only be called after calling the finish() method.
    signer_cert = result.certificate

    # At this point, you'd typically store the signed PDF on your database. For
    # demonstration purposes, we'll store the XML on a temporary folder publicly
    # accessible and render a link to it.

    create_app_data()  # Guarantees that "app data" folder exists.
    filename = '%s.xml' % (str(uuid.uuid4()))
    result.write_to_file(join(current_app.config['APPDATA_FOLDER'], filename))

    return render_template('xml_nfe_signature_rest/complete.html',
                           signed_xml=filename,
                           signer_cert=signer_cert)
