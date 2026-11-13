"""

This sample performs the three signatures required on a Brazilian digital
diploma XML (Diploma Digital, from MEC), one after the other:

1. The DadosDiploma element, signed with an e-CNPJ, AD-RT policy (index() and
   action());
2. The DadosRegistro element, signed with an e-CPF, AD-RT policy
   (dados_registro() and dados_registro_action());
3. The whole document, signed with an e-CNPJ, AD-RA policy (diploma() and
   diploma_action()).

"""
import uuid

from os.path import basename
from os.path import exists
from os.path import join

from flask import Blueprint
from flask import abort
from flask import current_app
from flask import make_response
from flask import render_template
from flask import request
from restpki_client import FullXmlSignatureStarter
from restpki_client import NamespaceManager
from restpki_client import StandardSignaturePolicies
from restpki_client import XmlElementSignatureStarter
from restpki_client import XmlInsertionOptions
from restpki_client import XmlSignatureFinisher
from werkzeug.utils import safe_join

from sample.storage_mock import create_app_data
from sample.storage_mock import get_sample_diploma_path
from sample.utils import get_expired_page_headers
from sample.utils import get_rest_pki_client
from sample.utils import get_security_context_id

# Flask 2.2 and later reject blueprint names that contain a dot, because the
# name is prepended to the blueprint's endpoint names. The dots in the module
# name are replaced so that basename() keeps only its last part.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/xml-diploma-signature-rest')

# ICP-Brasil XAdES AD-RA ("arquivamento") policy. The restpki-client package
# (up to 1.3.1) has no constant for it, so we use its ID, the same as the
# PkiBrazilXadesAdrArquivamento policy of the Java and PHP clients.
PKI_BRAZIL_XADES_ADR_ARQUIVAMENTO = '5b8c0710-006d-434d-bf35-12292b56b90a'


@blueprint.route('/')
def index():
    """

    This action initiates the signature of the DadosDiploma element of the
    sample diploma, usually with an e-CNPJ.

    """
    # Instantiate the XmlElementSignatureStarter class, responsible for
    # receiving the signature elements and starting the signature process.
    signature_starter = XmlElementSignatureStarter(get_rest_pki_client())

    # Set the XML to be signed, a sample Brazilian digital diploma
    # pre-generated.
    signature_starter.set_xml_to_sign(get_sample_diploma_path())

    # Set the ID of the element to be signed (the DadosDiploma element).
    signature_starter.to_sign_element_id = \
        'Dip35141214314050000662550010001084271182362300'

    # Append the signature as the last child of the signed element.
    signature_starter.set_signature_element_location(
        '.', XmlInsertionOptions.APPEND_CHILD, NamespaceManager())

    # Set the signature policy.
    signature_starter.signature_policy = \
        StandardSignaturePolicies.PKI_BRAZIL_XADES_ADR_TEMPO

    # Set a security context to be used to determine trust in the
    # certificate chain. We have encapsulated the security context choice on
    # utils.py.
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
        render_template('xml_diploma_signature_rest/index.html',
                        token=result.token))
    get_expired_page_headers(response.headers)
    return response


@blueprint.route('/', methods=['POST'])
def action():
    """

    This action completes the signature of the DadosDiploma element.

    """
    # Get the token for this signature (rendered in a hidden input field, see
    # xml_diploma_signature_rest/index.html template).
    token = request.form['token']

    # Complete the signature and store the signed XML.
    filename = _finish_signature(token)

    return render_template('xml_diploma_signature_rest/dados_diploma.html',
                           signed_xml=filename)


@blueprint.route('/dados-registro/<file_id>')
def dados_registro(file_id):
    """

    This action initiates the signature of the DadosRegistro element of the
    diploma signed on the previous step, usually with an e-CPF.

    """
    # Locate the diploma with the DadosDiploma element already signed. This
    # sample can only execute if the provided file exists.
    file_path = _get_stored_file_path(file_id)

    # Instantiate the XmlElementSignatureStarter class, responsible for
    # receiving the signature elements and starting the signature process.
    signature_starter = XmlElementSignatureStarter(get_rest_pki_client())

    # Set the XML to be signed, the diploma signed on the previous step.
    signature_starter.set_xml_to_sign(file_path)

    # Set the ID of the element to be signed (the DadosRegistro element).
    signature_starter.to_sign_element_id = \
        'Reg35141214314050000662550010001084271182362300'

    # Append the signature as the last child of the signed element.
    signature_starter.set_signature_element_location(
        '.', XmlInsertionOptions.APPEND_CHILD, NamespaceManager())

    # Set the signature policy.
    signature_starter.signature_policy = \
        StandardSignaturePolicies.PKI_BRAZIL_XADES_ADR_TEMPO

    # Set a security context to be used to determine trust in the
    # certificate chain. We have encapsulated the security context choice on
    # utils.py.
    signature_starter.security_context = get_security_context_id()

    # Call the start_with_webpki() method, which initiates the signature and
    # yields the token (see index() above).
    result = signature_starter.start_with_webpki()

    # Force page expiration, since the token can only be used once (see
    # index() above).
    response = make_response(
        render_template('xml_diploma_signature_rest/sign_dados_registro.html',
                        token=result.token,
                        file_id=file_id))
    get_expired_page_headers(response.headers)
    return response


@blueprint.route('/dados-registro/<file_id>', methods=['POST'])
def dados_registro_action(file_id):
    """

    This action completes the signature of the DadosRegistro element.

    """
    # Get the token for this signature (rendered in a hidden input field, see
    # xml_diploma_signature_rest/sign_dados_registro.html template).
    token = request.form['token']

    # Complete the signature and store the signed XML.
    filename = _finish_signature(token)

    return render_template('xml_diploma_signature_rest/dados_registro.html',
                           signed_xml=filename)


@blueprint.route('/diploma/<file_id>')
def diploma(file_id):
    """

    This action initiates the signature of the whole diploma signed on the
    previous steps, usually with an e-CNPJ.

    """
    # Locate the diploma with the DadosDiploma and DadosRegistro elements
    # already signed. This sample can only execute if the provided file exists.
    file_path = _get_stored_file_path(file_id)

    # Instantiate the FullXmlSignatureStarter class, responsible for receiving
    # the signature elements and starting the signature process.
    signature_starter = FullXmlSignatureStarter(get_rest_pki_client())

    # Set the XML to be signed, the diploma signed on the previous steps.
    signature_starter.set_xml_to_sign(file_path)

    # Set the signature policy.
    signature_starter.signature_policy = PKI_BRAZIL_XADES_ADR_ARQUIVAMENTO

    # Set a security context to be used to determine trust in the
    # certificate chain. We have encapsulated the security context choice on
    # utils.py.
    signature_starter.security_context = get_security_context_id()

    # Call the start_with_webpki() method, which initiates the signature and
    # yields the token (see index() above).
    result = signature_starter.start_with_webpki()

    # Force page expiration, since the token can only be used once (see
    # index() above).
    response = make_response(
        render_template('xml_diploma_signature_rest/sign_diploma.html',
                        token=result.token,
                        file_id=file_id))
    get_expired_page_headers(response.headers)
    return response


@blueprint.route('/diploma/<file_id>', methods=['POST'])
def diploma_action(file_id):
    """

    This action completes the signature of the whole diploma.

    """
    # Get the token for this signature (rendered in a hidden input field, see
    # xml_diploma_signature_rest/sign_diploma.html template).
    token = request.form['token']

    # Complete the signature and store the signed XML.
    filename = _finish_signature(token)

    return render_template('xml_diploma_signature_rest/diploma.html',
                           signed_xml=filename)


def _get_stored_file_path(file_id):
    """

    Returns the path of a file stored by a previous step, or answers 404 if it
    does not exist.

    """
    file_path = safe_join(current_app.config['APPDATA_FOLDER'], file_id)
    if file_path is None or not exists(file_path):
        abort(404)
    return file_path


def _finish_signature(token):
    """

    Completes a signature started on one of the steps above and stores the
    signed XML, returning its file name.

    """
    # Instantiate the XmlSignatureFinisher class, responsible for completing
    # the signature process.
    signature_finisher = XmlSignatureFinisher(get_rest_pki_client())

    # Set the token.
    signature_finisher.token = token

    # Call the finish() method, which finalizes the signature process and
    # returns the signed XML.
    result = signature_finisher.finish()

    # At this point, you'd typically store the signed XML on your database.
    # For demonstration purposes, we'll store the XML on a temporary folder
    # and return an identifier that can be used to download it.
    create_app_data()  # Guarantees that "app data" folder exists.
    filename = '%s.xml' % (str(uuid.uuid4()))
    result.write_to_file(join(current_app.config['APPDATA_FOLDER'], filename))
    return filename
