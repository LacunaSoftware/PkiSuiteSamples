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
class PadesCloudPwdExpressController < ApplicationController
  include PadesVisualElementsExpress

  # GET /pades-cloud-pwd-express
  #
  # This action will render a page that request a CPF to the user. This CPF
  # is used to discover which PSCs have a certificate containing that CPF.
  def index
    # Retrieve "file_id" parameter.
    @file_to_sign = params[:file_id]
    
    # Verify if the :file_id exists with the help of our StorageMock class.
    # This sample cna only be executed if the provided file exists.
    render text: 'Not Found', status: 404 unless exist?(@file_to_sign)
  end
  
  # POST /pades-cloud-pwd-express/discover
  #
  # This action will be called after the user press the button "Search" on 
  # index page.  It will search for all PSCs that have a certificate with the 
  # provided CPF. In this  -page, there will be a form field asking for user 
  # current password. In BirdId provider,  this password is called OTP.
  def discover
    # Retrieve "file_id" parameter.
    @file_to_sign = params[:file_id]
    # Recover CPF from the POST argument.
    @cpf = params[:cpf]
    
    # Process cpf, removing all formatting.
    plain_cpf = @cpf
    plain_cpf.gsub!(".", "")
    plain_cpf.gsub!("-", "")
    
    # Get an instance of the TrustServiceManager class, responsible for communicating with 
    # PSCs and handling the password flow.
    manager = PkiExpress::TrustServicesManager.new
    
    # Discover available PSCs.
    @services = manager.discover_by_cpf(plain_cpf)
  end
  
  # POST /pades-cloud-pwd-express/authorize
  # 
  # This action is called after the form after the user press the button "Sign". 
  # This action will receive the user's CPF and current password.
  def authorize
    # Retrieve "file_id" parameter.
    file_to_sign = params[:file_id]
    # Recover variables from the POST arguments.
    cpf = params[:cpf]
    service = params[:service]
    password = params[:password]

    # Process cpf, removing all formatting.
    plain_cpf = cpf
    plain_cpf.gsub!(".", "")
    plain_cpf.gsub!("-", "")

    # Get an instance of the TrustServiceManager class, responsible for communicating
    # with PSCs and handling the password flow.
    manager = PkiExpress::TrustServicesManager.new

    # Complete authentication using CPF and current password. The following method has three sessionTypes:
    # - SINGLE_SIGNATURE: The returned token can only be used for one single signature request.
    # - MULTI_SIGNATURE: The returned token can only be used for one multi signature request.
    # - SIGNATURE_SESSION: The return token can only be used for one or more signature requests.
    result = manager.password_authorize(service,
       plain_cpf, 
       password, 
       PkiExpress::TrustServiceSessionTypes::SIGNATURE_SESSION)
    
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