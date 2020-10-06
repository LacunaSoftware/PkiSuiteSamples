require 'pki_express'

class PadesServerKeyExpressController < ApplicationController
  include PadesVisualElementsExpress

  # GET /pades-server-key-express
  def index
    # Retrieve "file_id" parameter.
    @file_to_sign = params[:file_id]
    
    # Verify if the :file_id exists with the help of our StorageMock class.
    # This sample cna only be executed if the provided file exists.
    render text: 'Not Found', status: 404 unless exist?(@file_to_sign)

    # Get an instance of the PadesSigner class, responsible for receiving
    # the signature elements and performing the local signature.
    signer = PkiExpress::PadesSigner.new

    # Set PKI default options (see util.rb)
    set_pki_defaults(signer)

    # Set signature policy.
    signer.signature_policy = PkiExpress::StandardSignaturePolicies::PADES_BASIC_WITH_LTV

    # Set PDF to be signed.
    signer.pdf_to_sign_path = get_data_path(@file_to_sign)

    # The PKCS #12 certificate path.
    signer.pkcs12_path = get_resource_path('Pierre de Fermat.pfx')
    # Set the certificate's PIN.
    signer.cert_password = '1234'

    # Set visual representation. We provide a class that represents the visual
    # representation model.
    signer.visual_representation = get_visual_representation

    # Generate path for output file and add to signature finisher.
    output_file = generate_file_id('pdf')
    signer.output_file_path = get_data_path(output_file)

    # Perform the signature.
    @signer_cert = signer.sign(true)

    @signed_pdf = output_file
  end
end  