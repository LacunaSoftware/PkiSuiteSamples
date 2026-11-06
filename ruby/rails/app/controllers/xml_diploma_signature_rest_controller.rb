require 'rest_pki'

# This sample performs the three signatures required on a Brazilian digital
# diploma XML, one after the other:
#
# 1. The DadosDiploma element, usually signed with an e-CNPJ, AD-RT policy
#    (actions index and action);
# 2. The DadosRegistro element, usually signed with an e-CPF, AD-RT policy
#    (actions dados_registro and dados_registro_action);
# 3. The whole document, usually signed with an e-CNPJ, AD-RA policy (actions
#    diploma and diploma_action).
class XmlDiplomaSignatureRestController < ApplicationController

  # ID of the "ICP-Brasil XAdES AD-RA" (Assinatura Digital com Referencia de
  # Arquivamento) signature policy. The rest_pki gem (1.1.0) has no constant for
  # it on RestPki::StandardSignaturePolicies, so we declare it here, with the
  # same value as the Java (SignaturePolicy.PkiBrazilXadesAdrArquivamento) and
  # PHP (StandardSignaturePolicies::XML_ICPBR_ADR_ARQUIVAMENTO) clients.
  XML_ICPBR_ADR_ARQUIVAMENTO = '5b8c0710-006d-434d-bf35-12292b56b90a'

  # GET /xml-diploma-signature-rest
  #
  # This action initiates the signature of the DadosDiploma element of the
  # sample diploma using REST PKI and renders the signature page.
  def index

    # Instantiate the XmlElementSignatureStarter class, responsible for
    # receiving the signature elements and starting the signature process.
    signature_starter = RestPki::XmlElementSignatureStarter.new(get_rest_pki_client)

    # Set the XML to be signed, a sample Brazilian digital diploma
    # pre-generated.
    signature_starter.set_xml_tosign_from_path(get_sample_doc_path(:sample_diploma))

    # Set the ID of the element to be signed (the DadosDiploma element).
    signature_starter.element_tosign_id = 'Dip35141214314050000662550010001084271182362300'

    # Append the signature as the last child of the signed element.
    signature_starter.set_signature_element_location('.', RestPki::XmlInsertionOptions::APPEND_CHILD, RestPki::NamespaceManager.new)

    # Set the signature policy.
    signature_starter.signature_policy_id = RestPki::StandardSignaturePolicies::XML_ICPBR_ADR_TEMPO

    # Set the security context to be used to determine trust in the
    # certificate chain. We have encapsulated the security context choice on
    # util.rb.
    signature_starter.security_context_id = get_security_context_id

    # Call the start_with_webpki method, which initiates the signature. This
    # yields the token, a 43-character case-sensitive URL-safe string, which
    # identifies this signature process. We'll use this value to call the
    # signWithRestPki method on the Web PKI component (see signature-form.js)
    # and also to complete the signature after the form is submitted (see
    # method action below). This should not be mistaken for the API access
    # token.
    @token = signature_starter.start_with_webpki

    # The token acquired above can only be used for a single signature
    # attempt. In order to retry the signature it is necessary to get a new
    # token. This can be a problem if the user uses the back button of the
    # browser, since the browser might show a cached page that we rendered
    # previously, with a now stale token. To prevent this from happening, we
    # call the method set_expired_page_headers, located in util.rb, which sets
    # HTTP headers to prevent caching of the page.
    set_expired_page_headers
  end

  # POST /xml-diploma-signature-rest
  #
  # This action receives the form submission from the signature page of the
  # DadosDiploma element. We'll call REST PKI to complete the signature.
  def action

    # Instantiate the XmlSignatureFinisher class, responsible for completing
    # the signature process.
    signature_finisher = RestPki::XmlSignatureFinisher.new(get_rest_pki_client)

    # Set the token for this signature (rendered in a hidden input field, see
    # xml_diploma_signature_rest/index.html.erb).
    signature_finisher.token = params[:token]

    # Call the finish method, which finalizes the signature process and
    # returns the signed XML's bytes.
    signed_bytes = signature_finisher.finish

    # At this point, you'd typically store the signed XML on your database.
    # For demonstration purposes, we'll store the XML on a temporary folder and
    # return to the page an identifier that can be used to download it and to
    # continue the signature process.
    @file_id = store(signed_bytes, 'xml')
  end

  # GET /xml-diploma-signature-rest/dados-registro?fileId=<file id>
  #
  # This action initiates the signature of the DadosRegistro element of the
  # diploma signed by the action above and renders the signature page.
  def dados_registro

    # Retrieve "fileId" parameter (the diploma with the DadosDiploma element
    # already signed).
    @file_id = params[:fileId]

    # Verify if the provided file exists with the help of our StorageMock
    # class. This sample can only be executed if the provided file exists.
    if @file_id.blank? || !exist?(@file_id)
      render plain: 'Not Found', status: 404
      return
    end

    # Instantiate the XmlElementSignatureStarter class, responsible for
    # receiving the signature elements and starting the signature process.
    signature_starter = RestPki::XmlElementSignatureStarter.new(get_rest_pki_client)

    # Set the XML to be signed, the diploma signed in the previous step.
    signature_starter.set_xml_tosign_from_path(get_data_path(@file_id))

    # Set the ID of the element to be signed (the DadosRegistro element).
    signature_starter.element_tosign_id = 'Reg35141214314050000662550010001084271182362300'

    # Append the signature as the last child of the signed element.
    signature_starter.set_signature_element_location('.', RestPki::XmlInsertionOptions::APPEND_CHILD, RestPki::NamespaceManager.new)

    # Set the signature policy.
    signature_starter.signature_policy_id = RestPki::StandardSignaturePolicies::XML_ICPBR_ADR_TEMPO

    # Set the security context to be used to determine trust in the
    # certificate chain. We have encapsulated the security context choice on
    # util.rb.
    signature_starter.security_context_id = get_security_context_id

    # Call the start_with_webpki method, which initiates the signature and
    # yields the token (see method index above).
    @token = signature_starter.start_with_webpki

    # Prevent caching of this page, so that a stale token is never reused (see
    # method index above).
    set_expired_page_headers
  end

  # POST /xml-diploma-signature-rest/dados-registro
  #
  # This action receives the form submission from the signature page of the
  # DadosRegistro element. We'll call REST PKI to complete the signature.
  def dados_registro_action

    # Instantiate the XmlSignatureFinisher class, responsible for completing
    # the signature process.
    signature_finisher = RestPki::XmlSignatureFinisher.new(get_rest_pki_client)

    # Set the token for this signature (rendered in a hidden input field, see
    # xml_diploma_signature_rest/dados_registro.html.erb).
    signature_finisher.token = params[:token]

    # Call the finish method, which finalizes the signature process and
    # returns the signed XML's bytes.
    signed_bytes = signature_finisher.finish

    # At this point, you'd typically store the signed XML on your database.
    # For demonstration purposes, we'll store the XML on a temporary folder and
    # return to the page an identifier that can be used to download it and to
    # continue the signature process.
    @file_id = store(signed_bytes, 'xml')
  end

  # GET /xml-diploma-signature-rest/diploma?fileId=<file id>
  #
  # This action initiates the signature of the whole diploma signed by the
  # action above and renders the signature page.
  def diploma

    # Retrieve "fileId" parameter (the diploma with the DadosDiploma and
    # DadosRegistro elements already signed).
    @file_id = params[:fileId]

    # Verify if the provided file exists with the help of our StorageMock
    # class. This sample can only be executed if the provided file exists.
    if @file_id.blank? || !exist?(@file_id)
      render plain: 'Not Found', status: 404
      return
    end

    # Instantiate the FullXmlSignatureStarter class, responsible for receiving
    # the signature elements and starting the signature process.
    signature_starter = RestPki::FullXmlSignatureStarter.new(get_rest_pki_client)

    # Set the XML to be signed, the diploma signed in the previous step.
    signature_starter.set_xml_tosign_from_path(get_data_path(@file_id))

    # Set the signature policy (AD-RA, see XML_ICPBR_ADR_ARQUIVAMENTO above).
    signature_starter.signature_policy_id = XML_ICPBR_ADR_ARQUIVAMENTO

    # Set the security context to be used to determine trust in the
    # certificate chain. We have encapsulated the security context choice on
    # util.rb.
    signature_starter.security_context_id = get_security_context_id

    # Call the start_with_webpki method, which initiates the signature and
    # yields the token (see method index above).
    @token = signature_starter.start_with_webpki

    # Prevent caching of this page, so that a stale token is never reused (see
    # method index above).
    set_expired_page_headers
  end

  # POST /xml-diploma-signature-rest/diploma
  #
  # This action receives the form submission from the signature page of the
  # whole diploma. We'll call REST PKI to complete the signature.
  def diploma_action

    # Instantiate the XmlSignatureFinisher class, responsible for completing
    # the signature process.
    signature_finisher = RestPki::XmlSignatureFinisher.new(get_rest_pki_client)

    # Set the token for this signature (rendered in a hidden input field, see
    # xml_diploma_signature_rest/diploma.html.erb).
    signature_finisher.token = params[:token]

    # Call the finish method, which finalizes the signature process and
    # returns the signed XML's bytes.
    signed_bytes = signature_finisher.finish

    # At this point, you'd typically store the signed XML on your database.
    # For demonstration purposes, we'll store the XML on a temporary folder and
    # return to the page an identifier that can be used to download it.
    @file_id = store(signed_bytes, 'xml')
  end
end
