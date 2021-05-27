import os
import uuid

from amplia_client import CreateOrderRequest, CertificateKinds, PkiBrazilCertificateParameters
from flask import Blueprint, render_template, current_app, request
from pkiexpress import KeyGenerator, Pkcs12Generator, SupportedKeySizes

from sample.utils import get_amplia_client, set_pki_defaults, get_two_years_from_now_date

blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/issue-cert-server-amplia')


@blueprint.route('/')
def index():
    """
    GET /issue-cert-server-amplia

    Renders issue certificate page, containing the form to be filled with the
    information to be used on certificate generation.
    """
    return render_template('issue_cert_server_amplia/index.html')


@blueprint.route('/', methods=['POST'])
def action():
    """
    POST /issue-cert-server-amplia

    Receives issueForm POST request, containing two parameters:
    - The subject name;
    - The CPF number.
    """
    # Get an instance of the AmpliaClient, responsible to connect with
    # Amplia and perform the requests.
    client = get_amplia_client()

    # --------------------------------------------------------------------------
    # 1st Step: Create an issuing order on Amplia
    # --------------------------------------------------------------------------

    # Create an order request
    req = CreateOrderRequest()
    # Set the certificate authority's id. This authority will generate your
    # certificate. You can have a default ca_id per application, in that case,
    # there is no need to set this parameter.
    req.ca_id = current_app.config['AMPLIA_CA_ID']
    # Set the certificate validity. We encapsulated the validity date
    # definition on the get_two_years_from_now_date() method. We used the
    # format_date() date method to parse to "MM-DD-YYYY" pattern accepted
    # on Amplia.
    req.validity_end = get_two_years_from_now_date()
    # Set the kind of the certificate.
    req.kind = CertificateKinds.PUBLIC_KEY

    # Set the certificate parameters class with the desired parameters to
    # your certificate. In this sample we'll use the PKI-BRAZIL standards.
    parameters = PkiBrazilCertificateParameters()
    # Set the subject name.
    parameters.name = request.form['subjectName']
    # Set the CPF number.
    parameters.cpf = request.form['cpf']
    req.parameters = parameters

    # Create an order of issuing certificate on Amplia.
    order = client.create_order(req)

    # --------------------------------------------------------------------------
    # 2nd Step: Generate key pair using PKI Express and generate the certificate
    # using Amplia. Note that the key is never sent to Amplia, it stays on
    # server.
    # --------------------------------------------------------------------------

    # Get an instance of the KeyGenerator class, responsible for generate
    # a private key and the corresponding CSR.
    key_generator = KeyGenerator()
    key_generator.key_size = SupportedKeySizes.S2048
    key_generator.gen_csr = True

    # Set PKI default options (see utils.py).
    set_pki_defaults(key_generator)

    # Generate private key and CSR.
    gen_key = key_generator.generate()

    # Call Amplia to issue the certificate referred by the created order's id.
    cert = client.issue_certificate(order.id, gen_key.csr)

    # --------------------------------------------------------------------------
    # 3rd Step: Generate PFX file to be used on the sample of signature with
    # server key.
    # --------------------------------------------------------------------------

    # Get an instance of the Pkcs12Generator class, responsible for generate
    # a PKCS #12 from a generated key and certificate file. This certificate
    # will be used to sign the uploaded PDF.
    pkcs12_generator = Pkcs12Generator()

    # Set PKI default options (see utils.py).
    set_pki_defaults(key_generator)

    # Set the generate key.
    pkcs12_generator.key = gen_key.key

    # Set the certificate file.
    pkcs12_generator.set_cert_file_from_base64(cert.content_base64)

    # Generate PKCS #12 file using the default password.
    pkcs12_gen_result = pkcs12_generator.generate('1234')

    # Store PKCS #12 file to be used later.
    pkcs12_id = '%s.pfx' % (str(uuid.uuid4()))
    pkcs12_gen_result.pfx.write_to_file(
        os.path.join(current_app.config['APPDATA_FOLDER'], pkcs12_id))

    return render_template('issue_cert_server_amplia/action.html',
                           pkcs12_id=pkcs12_id,
                           cert=cert)
