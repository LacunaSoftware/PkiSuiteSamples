import os
import uuid

from amplia_client import CreateOrderRequest, CertificateKinds, PkiBrazilCertificateParameters
from flask import Blueprint, render_template, current_app, request

from sample.utils import get_amplia_client, get_two_years_from_now_date

# 21-07-2022
# For some reason, Blueprint has stopped accepting names containing dots('.'),
# so the exception would be thrown at the blueprint instantiation. In order to 
# solve that we replaced all occurrences of dots with forward slash ('/'). This fix
# made the PkiSuiteSamples Flask example run normally again
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/issue-cert-user-amplia')

RETURN_URL = 'http://localhost:5000/issue-cert-user-amplia/complete'


@blueprint.route('/')
def index():
    """
    GET /issue-cert-user-amplia

    Renders issue certificate page, containing the form to be filled with the
    information to be used on certificate generation.
    """
    return render_template('issue_cert_user_amplia/index.html')


@blueprint.route('/', methods=['POST'])
def action():
    """
    POST /issue-cert-user-amplia

    Receives issueForm POST request, containing two parameters:
    - The subject name;
    - The CPF number.
    - The phone number, used to validate identity when generating the certificate
    remotely.
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
    # Set the phone number.
    # WARNING: For this sample it's necessary to pass a phoneNumber to
    # perform identity verification when issue the certificate remotely.
    parameters.phone_number = request.form['phoneNumber']
    req.parameters = parameters

    # Create an order of issuing certificate on Amplia.
    order = client.create_order(req)

    # After the order is create, it's possible to get a redirect link
    link = client.get_order_issue_link(order.id, RETURN_URL)

    return render_template('issue_cert_user_amplia/redirect.html',
                           redirect_link=link)


@blueprint.route('/complete')
def complete():
    """
    GET /issue-cert-user-amplia/complete

    Renders page, used as a "returnUrl' to Amplia returns to. This page can be
    a page where you show to user that the certificate was successfully issued.
    """
    return render_template('issue_cert_user_amplia/complete.html')
