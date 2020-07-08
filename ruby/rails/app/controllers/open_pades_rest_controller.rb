require 'rest_pki'

class OpenPadesRestController < ApplicationController
  
  # GET /open-pades-rest
  # This action submits a PDF file to REST PKI for inspection of its signatures.
  def index
    # Retrieve "file_id" parameter.
    @file_id = params[:file_id]

    # Verify if the :file_id exists with the help of our StorageMock class.
    # This sample can only be executed if the provided file exists.
    unless exist?(@file_id)
      render text: 'Not Found', status: 404 && return
    end

    # Get an instance of the PadesSignatureExplorer class, used to open/validate PDF
    # signature.
    sig_explorer = RestPki::PadesSignatureExplorer.new(get_rest_pki_client)

    # Specify that we want to validate the signatures in the file, not only
    # inspect them.
    sig_explorer.validate = true

    # Specify the parameters for the signature validation:
    # Accept any PAdES signature as long as the signer has an ICP-Brasil
    # certificate.
    sig_explorer.default_signature_policy_id = RestPki::StandardSignaturePolicies::PADES_BASIC

    # Specify the security context to be used to determine trust in the
    # certificate chain. We have encapsulated the security context on util.js.
    sig_explorer.security_context_id = get_security_context_id

    # Set the PDF file.
    sig_explorer.set_signature_file_from_path(get_data_path(@file_id))

    # Call the open() method, which returns a Promise with the signature file's
    # information.
    @signature = sig_explorer.open
    @datetime_offset = '-3'
  end
end