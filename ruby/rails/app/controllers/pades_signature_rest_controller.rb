require 'rest_pki'

class PadesSignatureRestController < ApplicationController
  include PadesVisualElementsRest

  # GET /pades-signature-rest
  #
  # This action initiates a PAdES signature using REST PKI and renders the
  # signature page.
  def index

    # Retrieve "fileId" parameter.
    @file_to_sign = params[:file_id]

    # Verify if the :file_id exists with the help of our StorageMock class.
    # This sample can only executed if the provided file exists.
    unless exist?(@file_to_sign)
      render text: 'Not Found', status: 404 && return
    end

    # Get an instance of the PadesSignatureStarter class, responsible for
    # receiving the signature elements and start the signature process.
    signature_starter = RestPki::PadesSignatureStarter.new(get_rest_pki_client)

    # Set the signature policy.
    signature_starter.signature_policy_id = RestPki::StandardSignaturePolicies::PADES_BASIC

    # Set the security context to be used to determine trust in the certificate
    # chain. We have encapsulated the security context choice on util.rb.
    signature_starter.security_context_id = get_security_context_id

    # Set the visual representation for the signature.
    signature_starter.visual_representation = get_visual_representation

    # Set the PDF to be signed.
    signature_starter.set_pdf_tosign_from_path(get_data_path(@file_to_sign))

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
  end

  # POST /pades-signature-rest
  #
  # This action receives the form submission form the signature page. We'll call
  # REST PKI to complete the signature.
  def action

    # Get the token for this signature (rendered in a hidden input field, see
    # pades_signature/new.html.erb).
    token = params[:token]

    # Get an instance of the PadesSignatureFinisher class, responsible for
    # completing the signature process.
    signature_finisher = RestPki::PadesSignatureFinisher.new(get_rest_pki_client)

    # Set the token of this signature process (rendered in a hidden input field,
    # see file views/pades_signature_rest/index.html.erb).
    signature_finisher.token = token

    # Call the finish method, which finalizes the signature process and returns
    # the signed PDF's bytes.
    signed_bytes = signature_finisher.finish

    # Get information about the certificate used by the user to sign the file.
    # This field can only be acquired after calling the finish method.
    @signer_cert = signature_finisher.certificate_info

    # At this point, you'd typically store the signed XML on your database. For
    # demonstration purposes, we'll store the XML on a temporary folder publicly
    # accessible and render a link to it.

    @signed_pdf = store(signed_bytes, 'pdf')
  end
end
