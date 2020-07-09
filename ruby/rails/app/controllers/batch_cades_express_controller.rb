require 'pki_express'

class BatchCadesExpressController < ApplicationController
  # GET /batch-cades-signature-express
  #
  # This action renders the batch signature page.
  # Notice that the only thing we'll do on the server-side at this point is
  # determine the IDs of the documents to be signed. The page will handle each
  # document one by one and will call the server asynchronously to start and
  # complete each signature.
  def index
    @documents_ids = [*1..30]
  end

  # POST /batch-cades-signature-express/start
  #
  # This route is called asynchronously via AJAX by the batch signature page for
  # each document being signed. It receives the ID of the document and the
  # signer's certificate content and initiates a cades signature using
  # PKI Express and returns a JSON with the parameters for the client-side
  # signature using Web PKI (see batch-signature-form.js).
  def start
    # Get the parameters for this signature (received from the POST call via
    # AJAX, see batch-signature-form.js).
    id = params[:id]
    cert_content = params[:certContent]

    # Get instance of the CadesSignatureStarter class, responsible for
    # receiving the signature elements and start the signature process.
    signature_starter = PkiExpress::CadesSignatureStarter.new

    # Set PKI default options (see util.rb)
    set_pki_defaults(signature_starter)

    # Set signature policy.
    signature_starter.signature_policy = PkiExpress::StandardSignaturePolicies::PKI_BRAZIL_CADES_ADR_BASICA

    # Set PDF to be signed.
    signature_starter.file_to_sign_path = get_batch_doc_path(id)

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


    render json: {
      'toSignHash': result.to_sign_hash,
      'transferFile': result.transfer_file_id,
      'digestAlgorithm': result.digest_algorithm_name
    }
  end

  # POST /batch-cades-signature-express/complete
  #
  # This route is called asynchronously via AJAX by the batch signature page for
  # each document being signed. It receives the ID of the document, the computed
  # signature and the transfer file, received on start action. We'll call PKI
  # Express to complete this signature and return a JSON with the saved filename
  # so that the page can render a link to it.
  def complete
    # Get the parameters for this signature (received from the POST call via
    # AJAX, see batch-signature-form.js).
    id = params[:id]
    transfer_file_id = params[:transferFile]
    signature = params[:signature]

    # Get an instance of the SignatureFinisher class, responsible for
    # completing the signature process.
    signature_finisher = PkiExpress::SignatureFinisher.new

    # Set PKI default options (see util.rb)
    set_pki_defaults(signature_finisher)

    # Set the file to be signed. It's the same file we used on "start"
    # method.
    signature_finisher.file_to_sign_path = get_batch_doc_path(id)

    # Set the transfer file.
    signature_finisher.transfer_file_id = transfer_file_id

    # Set the signature value.
    signature_finisher.signature = signature

    # Generate path for output file and add to signature finisher.
    @output_file = generate_file_id('p7s')
    signature_finisher.output_file_path = get_data_path(@output_file)

    signature_finisher.complete

    render json: "\"#{@output_file}\""
  end
end