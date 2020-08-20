require 'pki_express'

class CadesSignatureExpressController < ApplicationController
  # GET /cades-signature
  # This sample performs a CAdES signature in three steps using PKI Express
  # and Web PKI
  def index
    @file_to_sign = params[:file_id]
    
    # Verify if the :file_id exists with the help of our StorageMock class.
    # This sample cna only be executed if the provided file exists.
    render text: 'Not Found', status: 404 unless exist?(@file_to_sign)
  end

  # POST /cades-signature/start
  # This method starts the signature. In this sample, it will be called
  # programatically after the user press the "Sign File" button
  # (see method readCertificate() on signature-start-form.js)
  def start
    # Retrieve parameters
    @file_to_sign = params[:file_id]
    @cert_thumb = params[:cert_thumb]
    cert_content = params[:cert_content]

    # Get instance of the CadesSignatureStarter class, responsible for
    # receiving the signature elements and start the signature process.
    signature_starter = PkiExpress::CadesSignatureStarter.new

    # Set PKI default options (see util.rb)
    set_pki_defaults(signature_starter)

    # Set signature policy.
    signature_starter.signature_policy = PkiExpress::StandardSignaturePolicies::PKI_BRAZIL_CADES_ADR_BASICA

    # Set PDF to be signed.
    signature_starter.file_to_sign_path = get_data_path(@file_to_sign)

    # Set Base64-encoded certificate's content to signature starter.
    signature_starter.certificate_base64 = cert_content

    # Optionally, set whether the content should be encapsulated in the resulting CMS. If this parameter is
    # omitted, the following rules apply:
    #  - If no cms-to-cosign is given, the resulting CMS will include the content
    #  - If a cms-to-cosign is given, the resulting CMS will include the content if and only if the cms also
    #    includes the content
    signature_starter.encapsulated_content = true
    
    # Start the signature process.
    result = signature_starter.start

    @to_sign_hash = result.to_sign_hash
    @transfer_file_id = result.transfer_file_id
    @digest_algorithm = result.digest_algorithm_name
  end

  # POST /cades-signature/complete
  # This method completes the signature, it will be called programatically
  # after the Web PKI component perform the signature and submit the form
  # (see method sign() on signature-complete-form.js)
  def complete
    # Retrieve parameters
    file_to_sign = params[:file_id]
    transfer_file_id = params[:transfer_file_id]
    signature = params[:signature]
    
    # Get an instance of the SignatureFinisher class, responsible for
    # completing the signature process.
    signature_finisher = PkiExpress::SignatureFinisher.new
    
    # Set PKI default options (see util.rb)
    set_pki_defaults(signature_finisher)

    # Set the file to be signed. It's the same file we used on "start"
    # method.
    signature_finisher.file_to_sign_path = get_data_path(file_to_sign)

    # Set the transfer file.
    signature_finisher.transfer_file_id = transfer_file_id

    # Set the signature value.
    signature_finisher.signature = signature

    # Generate path for output file and add to signature finisher.
    @output_file = generate_file_id('p7s')
    signature_finisher.output_file_path = get_data_path(@output_file)

    # Complete the signature process.
    @signer_cert = signature_finisher.complete
  end
end