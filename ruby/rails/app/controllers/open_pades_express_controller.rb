require 'pki_express'

class OpenPadesExpressController < ApplicationController
  
  # GET /open-pades-express
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
    sig_explorer = PkiExpress::PadesSignatureExplorer.new()

    # Set PKI default options (see util.rb)
    set_pki_defaults(sig_explorer)

    # Specify that we want to validate the signatures in the file, not only
    # inspect them.
    sig_explorer.validate = true

    # Set the PDF file.
    sig_explorer.signature_file_path = get_data_path(@file_id)

    # Call the open() method, which returns a Promise with the signature file's
    # information.
    @signature = sig_explorer.open
    @datetime_offset = '-3'
  end
end