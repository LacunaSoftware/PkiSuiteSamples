require 'pki_express'

class PadesSignatureExpressController < ApplicationController
  include PadesVisualElementsExpress

  # GET /pades-signature-express
  #
  # This action simply  renders the page.
  def index

    # Retrieve "file_id" parameter.
    @file_to_sign = params[:file_id]

    # Verify if the :file_id exists with the help of our StorageMock class.
    # This sample cna only be executed if the provided file exists.
    render text: 'Not Found', status: 404 unless exist?(@file_to_sign)
  end

  # POST /pades-signature-express/start
  #
  # This action receives the form submission from the signature page. It will
  # perform a PAdES signature in three steps using PKI Express and Web PKI.
  def start

    # Retrieve parameters
    @file_to_sign = params[:file_id]
    @cert_thumb = params[:cert_thumb]
    @cert_content = params[:cert_content]

    # Get instance of the PadesSignatureStarter class, responsible for receiving
    # the signature elements and start the signature process.
    signature_starter = PkiExpress::PadesSignatureStarter.new

    # Set PKI default options (see util.rb)
    set_pki_defaults(signature_starter)

    # Set signature policy.
    signature_starter.signature_policy = PkiExpress::StandardSignaturePolicies::PADES_BASIC_WITH_LTV

    # Set PDF to be signed.
    signature_starter.pdf_to_sign_path = get_data_path(@file_to_sign)

    # Set Base64-encoded certificate's content to signature starter.
    signature_starter.certificate_base64 = @cert_content

    # Set visual representation. We provide a class that represents the visual
    # representation model.
    signature_starter.visual_representation = get_visual_representation

    # Start the signature process. Receive as response a SignatureStartResult
    # instance containing the following fields:
    # - to_sign_hash: The hash to be signed.
    # - digest_algorithm_name: The digest algorithm's name that be used to
    # configure Web PKI component to compute the signature.
    # - digest_algorithm_oid: The digest algorithm's oid that be used to
    # configure Web PKI component to compute the signature.
    # - transfer_file_id: A temporary file's id to be passed to "complete" step.
    result = signature_starter.start

    @to_sign_hash = result.to_sign_hash
    @transfer_file_id = result.transfer_file_id
    @digest_algorithm = result.digest_algorithm_name
  end

  # POST /pades-signature-express/complete
  #
  # This action receives the form submission from the signature page. It will
  # perform a PAdES signature in three steps using PKI Express and Web PKI.
  def complete
    @file_to_sign = params[:file_id]
    @transfer_file_id = params[:transfer_file_id]
    signature = params[:signature]

    # Get an instance of the SignatureFinisher class, responsible for completing
    # the signature process.
    signature_finisher = PkiExpress::SignatureFinisher.new

    # Set PKI default options (see util.rb)
    set_pki_defaults(signature_finisher)

    # Set PDF to be signed. It's the same file we used on "start" step.
    signature_finisher.file_to_sign_path = get_data_path(@file_to_sign)

    # Set transfer file.
    signature_finisher.transfer_file_id = @transfer_file_id

    # Set the signature value.
    signature_finisher.signature = signature

    # Generate path for output file and add to signature finisher.
    output_file = generate_file_id('pdf')
    signature_finisher.output_file_path = get_data_path(output_file)

    # Complete the signature process.
    @signer_cert = signature_finisher.complete

    @signed_pdf = output_file
  end
end
