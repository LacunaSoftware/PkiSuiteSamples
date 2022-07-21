import uuid

from os.path import basename
from os.path import join

from flask import Blueprint
from flask import current_app
from flask import make_response
from flask import render_template
from flask import request

from restpki_client import FullXmlSignatureStarter
from restpki_client import NamespaceManager
from restpki_client import StandardSignaturePolicies
from restpki_client import XmlInsertionOptions
from restpki_client import XmlSignatureFinisher

from sample.storage_mock import create_app_data
from sample.storage_mock import get_sample_xml_document_path
from sample.utils import get_expired_page_headers
from sample.utils import get_rest_pki_client
from sample.utils import get_security_context_id

# 21-07-2022
# For some reason, Blueprint has stopped accepting names containing dots('.'),
# so the exception would be thrown at the blueprint instantiation. In order to 
# solve that we replaced all occurrences of dots with forward slash ('/'). This fix
# made the PkiSuiteSamples Flask example run normally again
__name__ = __name__.replace(".","/")
blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/xml-signature-rest')


@blueprint.route('/')
def index():
    # Get an instance of the FullXmlSignatureStarter class, responsible for
    # receiving the signature elements and start the signature process.
    signature_starter = FullXmlSignatureStarter(get_rest_pki_client())

    # Set the XML to be signed, a sample XML Document.
    signature_starter.set_xml_to_sign(get_sample_xml_document_path())

    # Set the location on which to insert the signature node. If the
    # location is not specified, the signature will appended to the root
    # element (which is most usual with enveloped signatures).
    nsm = NamespaceManager()
    nsm.add_namespace('ls', 'http://www.lacunasoftware.com/sample')
    signature_starter.set_signature_element_location(
        '//ls:signaturePlaceholder',
        XmlInsertionOptions.APPEND_CHILD,
        nsm
    )

    # Set the signature policy.
    signature_starter.signature_policy = StandardSignaturePolicies.XADES_BES

    # Set the security context to be used to determine trust in the
    # certificate chain. We have encapsulated the security context choice on
    # util.py.
    signature_starter.security_context = get_security_context_id()

    # Call the start_with_webpki() method, which initiates the signature.
    # This yields the token, a 43-character case-sensitive URL-safe string,
    # which identifies this signature process. We'll use this value to call
    # the signWithRestPki() method on the Web PKI component (see
    # signature-form.js javascript) and also to complete the signature after
    # the form is submitted (see method pades_signature_action()). This
    # should not be mistaken with the API access token.
    result = signature_starter.start_with_webpki()

    # The token acquired above can only be used for a single signature
    # attempt. In order to retry the signature it is necessary to get a new
    # token. This can be a problem if the user uses the back button of the
    # browser, since the browser might show a cached page that we rendered
    # previously, with a now stale token. To prevent this from happen, we
    # force page expiration through HTTP headers to prevent caching of the
    # page.
    response = make_response(render_template('xml_signature_rest/index.html',
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

    return render_template('xml_signature_rest/complete.html',
                           signed_xml=filename,
                           signer_cert=signer_cert)
