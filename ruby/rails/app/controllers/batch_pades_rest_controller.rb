require 'rest_pki'

class BatchPadesRestController < ApplicationController
  include PadesVisualElementsRest

  # GET /batch-pades-signature-rest
  #
  # This action renders the batch signature page.
  # Notice that the only thing we'll do on the server-side at this point is
  # determine the IDs of the documents to be signed. The page will handle each
  # document one by one and will call the server asynchronously to start and
  # complete each signature.

  def index
    @documentsIds = [*1..30]
  end

  # POST /batch-pades-signature-rest/start
  #
  # This route is called asynchronously via AJAX by the batch signature page for
  # each document being signed. It receives the ID of the document and the
  # signer's certificate content and initiates a PAdES signature using
  # REST PKI and returns a JSON with the parameters for the client-side
  # signature using Web PKI (see batch-signature-form.js).
  def start
    # Get the parameters for this signature (received from the POST call via
    # AJAX, see batch-signature-form.js).
    id = params[:id]
  
    # Get an instantiate of the PadesSignatureStarter class, responsible for
    # receiving the signature elements and start the signature process.
    signature_starter = RestPki::PadesSignatureStarter.new(get_rest_pki_client)
  
    # Set signature policy.
    signature_starter.signature_policy_id = RestPki::StandardSignaturePolicies::PADES_BASIC
  
    # Set the security context to be used to determine trust in the certificate
    # chain. We have encapsulated the security context choice on util.rb.
    signature_starter.security_context_id = get_security_context_id

    # Set the visual representation for the signature.
    signature_starter.visual_representation = get_visual_representation
    
    # Set the PDF to be signed.
    signature_starter.set_pdf_tosign_from_path(get_batch_doc_path(id))
  
    # Call the start_with_webpki method, which initiates the signature. This
    # yields the token, a 43-character case-sensitive URL-safe string, which
    # identifies this signature process. We'll use this value to call the
    # sign_with_restpki method on the Web PKI component (see signature-form.js)
    # and also to complete the signature after the form is submitted (see method
    # create below). This should not be mistaken with the API access token.
    @token = signature_starter.start_with_webpki

    # The token acquired above can only be used for a single signature attempt.
    # In order to retry the signature it is necessary to get a new token. This
    # can be a problem if the user uses the back button of the browser, since
    # the browser might show a cached page that we rendered previously, with a
    # now stale token. To prevent this from happening, we call the method
    # set_expired_page_headers, located in application_helper.rb, which sets
    # HTTP headers to prevent caching of the page.
    set_expired_page_headers

    render json: "\"#{@token}\""
  end

  # POST /batch-pades-signature-rest/complete
  #
  # This route is called asynchronously via AJAX by the batch signature page for
  # each document being signed. It receives the ID of the document, the computed
  # signature and the transfer file, received on start action. We'll call REST
  # PKI to complete this signature and return a JSON with the saved filename so
  # that the page can render a link to it.
  def complete
    # Get an instance of the PadesSignatureFinisher class, responsible for
    # completing the signature process.
    signature_finisher = RestPki::PadesSignatureFinisher.new(get_rest_pki_client)

    # Set the token of this signature process
    signature_finisher.token = params[:token]

    # Call the finish method, which finalizes the signature process and returns
    # the signed PDF's bytes.
    signed_bytes = signature_finisher.finish

    # At this point, you'd typically store the signed XML on your database. For
    # demonstration purposes, we'll store the XML on a temporary folder publicly
    # accessible and render a link to it.
    @signed_pdf = store(signed_bytes, 'pdf')

    render json: "\"#{@signed_pdf}\""
  end
end