require 'rest_pki'

class BatchCadesRestController < ApplicationController

  # GET /batch-cades-rest
  #
  # This action renders the batch signature page.
  # Notice that the only thing we'll do on the server-side at this point is
  # determine the IDs of the documents to be signed. The page will handle each
  # document one by one and will call the server asynchronously to start and
  # complete each signature.

  def index
    @documents_ids = [*1..30]
  end

  # POST /batch-cades-rest/start
  #
  # This route is called asynchronously via AJAX by the batch signature page for
  # each document being signed. It receives the ID of the document, initiates a
  # CAdES signature using REST PKI and returns a JSON with the token for the
  # client-side signature using Web PKI (see batch-signature-restpki-form.js).
  def start
    # Get the parameters for this signature (received from the POST call via
    # AJAX, see batch-signature-restpki-form.js).
    id = params[:id]
  
    # Get an instance of the CadesSignatureStarter class, responsible for
    # receiving the signature elements and starting the signature process.
    signature_starter = RestPki::CadesSignatureStarter.new(get_rest_pki_client)
  
    # Set signature policy.
    signature_starter.signature_policy_id = RestPki::StandardSignaturePolicies::CADES_ICPBR_ADR_BASICA
  
    # Set the security context to be used to determine trust in the certificate
    # chain. We have encapsulated the security context choice on util.rb.
    signature_starter.security_context_id = get_security_context_id

    # Set the file to be signed.
    signature_starter.set_file_tosign_from_path(get_batch_doc_path(id))

    # Optionally, set whether the content should be encapsulated in the resulting CMS.
    signature_starter.encapsulate_content = true

    # Call the start_with_webpki method, which initiates the signature. This
    # yields the token, a 43-character case-sensitive URL-safe string, which
    # identifies this signature process. We'll use this value to call the
    # signWithRestPki method on the Web PKI component (see
    # batch-signature-restpki-form.js) and also to complete the signature (see
    # action complete below). This should not be mistaken for the API access
    # token.
    @token = signature_starter.start_with_webpki

    # The token acquired above can only be used for a single signature attempt.
    # In order to retry the signature it is necessary to get a new token. To
    # prevent the browser from caching this response, with a token that may be
    # stale, we call the method set_expired_page_headers, located in util.rb,
    # which sets HTTP headers to prevent caching.
    set_expired_page_headers

    render json: "\"#{@token}\""
  end

  # POST /batch-cades-rest/complete
  #
  # This route is called asynchronously via AJAX by the batch signature page for
  # each document being signed. It receives the token of the signature process,
  # acquired on the start action. We'll call REST PKI to complete this signature
  # and return a JSON with the saved filename so that the page can render a link
  # to it.
  def complete
    # Get an instance of the CadesSignatureFinisher class, responsible for
    # completing the signature process.
    signature_finisher = RestPki::CadesSignatureFinisher.new(get_rest_pki_client)

    # Set the token of this signature process
    signature_finisher.token = params[:token]

    # Call the finish method, which finalizes the signature process and returns
    # the signed CMS bytes.
    signed_bytes = signature_finisher.finish

    # At this point, you'd typically store the signed CMS on your database. For
    # demonstration purposes, we'll store the CMS on the private/files folder
    # (see storage_mock.rb) and render a link to it.
    @filename = store(signed_bytes, 'p7s')

    render json: "\"#{@filename}\""
  end
end