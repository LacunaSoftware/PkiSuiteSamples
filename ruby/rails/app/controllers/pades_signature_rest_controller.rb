require 'rest_pki'

class PadesSignatureRestController < ApplicationController
  include PadesVisualElementsRest

  # This action initiates a PAdES signature using REST PKI and renders the signature page.
  #
  # Both PAdES signature examples, with a server file and with a file uploaded by the user, converge to this action.
  # The difference is that, when the file is uploaded by the user, the action is called with a URL argument name
  # "userfile".
  def index

    # Instantiate the PadesSignatureStarter class, responsible for receiving the signature elements and start
    # the signature process
    signature_starter = PadesSignatureStarter.new(get_rest_pki_client)

    # Set the signature policy
    signature_starter.signature_policy_id = StandardSignaturePolicies::PADES_BASIC

    # Set the security context to be used to determine trust in the certificate chain
    signature_starter.security_context_id = get_security_context_id

    # Set the visual representation for the signature
    signature_starter.visual_representation = get_visual_representation

    # Below we'll either set the PDF file to be signed. Prefer passing a path or a stream instead of the file's
    # contents as a byte array to prevent memory allocation issues with large files.
    @userfile = params[:userfile]
    if @userfile.nil?

      # If the URL argument "userfile" is filled, it means the user was redirected by upload_controller
      # (signature with file upload by user). We'll set the path of the file to be signed, which was saved in
      # the temporary folder by upload_controller (such a file would normally come from your application's
      # database)
      signature_starter.set_pdf_tosign_from_path(get_sample_doc_path)

    else

      # If userfile is null, this is the "signature with server file" case. We'll set the file to be signed
      # by passing its path
      signature_starter.set_pdf_tosign_from_path(Rails.root.join('public', 'uploads', @userfile))

    end

    # Call the start_with_webpki method, which initiates the signature. This yields the token, a 43-character
    # case-sensitive URL-safe string, which identifies this signature process. We'll use this value to call the
    # sign_with_restpki method on the Web PKI component (see signature-form.js) and also to complete the
    # signature after the form is submitted (see method create below). This should not be mistaken with the
    # API access token.
    @token = signature_starter.start_with_webpki

    # The token acquired above can only be used for a single signature attempt. In order to retry the signature
    # it is necessary to get a new token. This can be a problem if the user uses the back button of the browser,
    # since the browser might show a cached page that we rendered previously, with a now stale token. To prevent
    # this from happening, we call the method set_expired_page_headers, located in application_helper.rb, which
    # sets HTTP headers to prevent caching of the page.
    set_expired_page_headers
  end

  # This action receives the form submission from the signature page. We'll call REST PKI to complete the signature.
  def action

    # Get the token for this signature (rendered in a hidden input field, see pades_signature/new.html.erb)
    token = params[:token]

    # Instantiate the PadesSignatureFinisher class, responsible for completing the signature process
    # (see config/initializers/restpki.rb)
    signature_finisher = PadesSignatureFinisher.new(get_rest_pki_client)

    # Set the token
    signature_finisher.token = token

    # Call the finish method, which finalizes the signature process and returns the signed PDF's bytes
    signed_bytes = signature_finisher.finish

    # Get information about the certificate used by the user to sign the file. This field can only be acquired
    # after calling the finish method.
    @signer_cert = signature_finisher.certificate_info

    # At this point, you'd typically store the signed XML on your database. For demonstration purposes, we'll
    # store the XML on a temporary folder publicly accessible and render a link to it.

    @filename = SecureRandom.hex(10).to_s + '.pdf'
    File.open(Rails.root.join('public', 'uploads', @filename), 'wb') do |file|
      file.write(signed_bytes)
    end
  end
end
