require 'rest_pki'

class XmlSignatureRestController < ApplicationController


  # This action initiates a full XML signature using REST PKI and renders the signature page.
  def index
      # Instantiate the FullXmlSignatureStarter class, responsible for receiving the signature elements and
      # starting the signature process (see get_rest_pki_client on util.rb)
      signature_starter = RestPki::FullXmlSignatureStarter.new(get_rest_pki_client)

      # Set path of the XML to be signed, a sample XML Document
      signature_starter.set_xml_tosign_from_path(get_sample_doc_path(:sample_xml))

      # Set the location on which to insert the signature node. If the location is not specified, the signature
      # will be appended to the root element (which is most usual with enveloped signatures).
      nsm = RestPki::NamespaceManager.new
      nsm.add_namespace('ls', 'http://www.lacunasoftware.com/sample')
      signature_starter.set_signature_element_location(
          '//ls:signaturePlaceholder',
          RestPki::XmlInsertionOptions::APPEND_CHILD,
          nsm
      )

      # Set the signature policy
      signature_starter.signature_policy_id = RestPki::StandardSignaturePolicies::XML_XADES_BES

      # Set the security context to be used to determine trust in the certificate chain
      signature_starter.security_context_id = get_security_context_id

      # Call the :start_with_webpki method, which initiates the signature. This yields the token, a 43-character
      # case-sensitive URL-safe string, which identifies this signature process. We'll use this value to call the
      # signWithRestPki method on the Web PKI component (see app/assets/javascripts/signature-form.js) and also to
      # complete the signature after the form is submitted (see method action below). This should not be mistaken
      # for the API access token.
      @token = signature_starter.start_with_webpki

      # The token acquired above can only be used for a single signature attempt. In order to retry the signature
      # it is necessary to get a new token. This can be a problem if the user uses the back button of the browser,
      # since the browser might show a cached page that we rendered previously, with a now stale token. To prevent
      # this from happening, we call the method set_expired_page_headers, located in util.rb,
      # which sets HTTP headers to prevent caching of the page.
      set_expired_page_headers
  end

  # This action receives the form submission from the signature page. We'll call REST PKI to complete the signature.
  def action
      # Get the token for this signature (rendered in a hidden input field, see xml_signature_rest/index.html.erb)
      token = params[:token]

      # Instantiate the XmlSignatureFinisher class, responsible for completing the signature
      # process (see get_rest_pki_client on util.rb)
      signature_finisher = RestPki::XmlSignatureFinisher.new(get_rest_pki_client)

      # Set the token
      signature_finisher.token = token

      # Call the finish method, which finalizes the signature process and returns the signed XML's bytes
      signed_bytes = signature_finisher.finish

      # Get information about the certificate used by the user to sign the file. This field can only be acquired
      # after calling the finish method.
      @signer_cert = signature_finisher.certificate_info

      # At this point, you'd typically store the signed XML on your database. For demonstration purposes, we'll
      # store the XML on the private/files folder (see storage_mock.rb) and render a link to it.
      @signed_pdf = store(signed_bytes, 'xml')
  end

end
