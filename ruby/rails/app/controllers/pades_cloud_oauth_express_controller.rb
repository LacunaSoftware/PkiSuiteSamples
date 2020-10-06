require 'pki_express'

 # This sample is responsible to perform a OAuth flow to communicate with PSCs to perform a
 # signature. To perform this sample it's necessary to configure PKI Express with the credentials of
 # the services by executing the following sample:
 #
 #    pkie config --set trustServices:<provider>:<configuration>
 #
 # All standard providers:
 #    - BirdId
 #    - ViDaaS
 #    - NeoId
 #    - RemoteId
 #    - SafeId
 # It's possible to create a custom provider if necessary.
 #
 # All configuration available:
 #    - clientId
 #    - clientSecret
 #    - endpoint
 #    - provider
 #    - badgeUrl
 #    - protocolVariant (error handling, normally it depends on the used provider)
 #
 # This sample will only show the PSCs that are configured.
class PadesCloudOauthExpressController < ApplicationController
  include PadesVisualElementsExpress

  # GET /pades-cloud-oauth-express
  #
  # This action will render a page that request a CPF to the user. 
  # This CPF is used to discover which PSCs have a certificate containing 
  # that CPF.
  def index
    # Retrieve "file_id" parameter.
    @file_to_sign = params[:file_id]

    # Verify if the :file_id exists with the help of our StorageMock class.
    # This sample cna only be executed if the provided file exists.
    render text: 'Not Found', status: 404 unless exist?(@file_to_sign)
  end

  # POST /pades-cloud-oauth-express
  #
  # This action will be called after the user press the button "Search" on index page.
  # It will search for all PSCs that have a certificate with the provided CPF. Thus, it will
  # start the authentication process and return a URL to redirect the user to perform the authentication.
  # 
  # After this action the user will be redirected, and to store the local data (fileId) to be user
  # after the user returns to your application. We use the parameter "customState", the last parameter
  # of the method discover_by_cpf_and_start_auth(). This parameter will be recovered in the next action.
  def discover
    # Retrieve "file_id" parameter.
    file_to_sign = params[:file_id]
    # Recover CPF from the POST argument.
    plain_cpf = params[:cpf]

    # Process cpf, removing all formatting.
    plain_cpf.gsub!(".", "")
    plain_cpf.gsub!("-", "")

    # Get an instance of the TrustServiceManager class, responsible for communicating with 
    # PSCs and handling the OAuth flow.
    manager = PkiExpress::TrustServicesManager.new

    # Discover PSCs and receive a URL to redirect the user to perform the OAuth authentication
    # page. As mentioned before, we pass the id of the file to be signed as the last parameter
    # of the following method. The next action will recover this information.
    @services = manager.discover_by_cpf_and_start_auth(plain_cpf, 
            "http://localhost:3000/pades-cloud-oauth-express/complete", 
            PkiExpress::TrustServiceSessionTypes::SIGNATURE_SESSION,
            file_to_sign)
  end

  # GET /pades-cloud-oauth-express/complete
  #
  # This action will complete the authentication process and create a 
  # signature using a session token returned by user. Also, we recover the
  # parameter "customState" containing the id of the file that will be signed.
  def complete
    # Recover variables from query parameters.
    code = params[:code]
    state = params[:state]

    # Get an instance of the TrustServiceManager class, responsible for communicating with 
    # PSCs and handling the OAuth flow.
    manager = PkiExpress::TrustServicesManager.new

    # Complete the authentication process, recovering the session info to be used on the
    # signature and the custom state (fileId).
    result = manager.complete_auth(code, state)

    # Recover file id on custom state parameter.
    file_to_sign = result.custom_state

    # Verify if the :file_id exists with the help of our StorageMock class.
    # This sample cna only be executed if the provided file exists.
    render text: 'Not Found', status: 404 unless exist?(file_to_sign)

    # Get an instance of the PadesSigner class, responsible for receiving
    # the signature elements and performing the local signature.
    signer = PkiExpress::PadesSigner.new

    # Set PKI default options (see util.rb)
    set_pki_defaults(signer)

    # Set signature policy.
    signer.signature_policy = PkiExpress::StandardSignaturePolicies::PADES_BASIC_WITH_LTV

    # Set PDF to be signed.
    signer.pdf_to_sign_path = get_data_path(file_to_sign)

    # Set trust session acquired on the following steps of this sample.
    signer.trust_service_session = result.session

    # Set visual representation. We provide a class that represents the visual
    # representation model.
    signer.visual_representation = get_visual_representation

    # Generate path for output file and add to signature finisher.
    output_file = generate_file_id('pdf')
    signer.output_file_path = get_data_path(output_file)

    # Perform the signature.
    signer_cert = signer.sign(false)

    @signed_pdf = output_file
  end

end