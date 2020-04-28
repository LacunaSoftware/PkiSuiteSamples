# require 'rest_pki'

# class PrinterVersionPadesRestController < ApplicationController
#     # #############################################################################
#     # Configuration of the Printer-Friendly version
#     # #############################################################################

#     # Name of your website, with preceding article (article in lowercase).
#     VERIFICATION_SITE_NAME_WITH_ARTICLE = 'my Verification Center'

#     # Publicly accessible URL of your website. Preferable HTTPS.
#     VERIFICATION_SITE = 'http://localhost:3000'

#     # Format of the verification link, without the verification code, that is added
#     # on generatePrinterFriendlyVersion() method.
#     VERIFICATION_LINK_FORMAT = 'http://localhost:3000/check-pades-rest/'

#     # "Normal" font size. Sizes of header fonts are defined based on this size.
#     NORMAL_FONT_SIZE = 12

#     # Date format when converting date into a string (see strftime)
#     DATE_FORMAT = '%d/%m/%Y %H:%M'

#     # Display name of the time zone chosen above
#     TIMEZONE_DISPLAY_NAME = 'Brasilia timezone'
#     TIMEZONE_UTC_OFFSET = '-3'

#     # You may also change texts, positions and more by editing directly the method
#     # generatePrinterFriendlyVersion() below.
#     # #############################################################################

#     # GET /printer-version-pades-rest
#     # This action loads printer_version_pades_rest/index.html.erb
#     def index
#         # Retrieve "file_id" parameter.
#         @file_id = params[:file_id]

#         # Verify if the :file_id exists with the help of our StorageMock class.
#         # This sample can only be executed if the provided file exists.
#         unless exist?(@file_id)
#             render text: 'Not Found', status: 404 && return
#         end
#     end

#     # GET /printer-version-pades-rest/download/
#     # This generates a printer-friendly version from a signature file using REST PKI.
#     def download
#         # Retrieve "file_id" parameter.
#         @file_id = params[:file_id]

#         # Verify if the :file_id exists with the help of our StorageMock class.
#         # This sample can only be executed if the provided file exists.
#         unless exist?(@file_id)
#             render text: 'Not Found', status: 404 && return
#         end

#         file_path = get_data_path(@file_id)

#         # Check if doc already has a verification code registered on storage.
#         verification_code = get_verification_code(@file_id)
#         if verification_code.to_s.empty?
#             # If not, generate a code and register it.
#             verification_code = generate_verification_code()
#             set_verification_code(@file_id, verification_code)
#         end

#         # Generate the printer-friendly version.
#         pfv_content = generate_printer_friendly_version(file_path, verification_code)
#         # Return the generate file.
#         send_data pfv_content, :filename => "printer-friendly.pdf"
#     end

#     def generate_printer_friendly_version(pdf_path, verification_code)
#         # The verification code is generated without hyphens to save storage space
#         # and avoid copy-and-paste problems. On the PDF generation, we use the
#         # "formatted" version, with hyphens (which will later be discarded on the
#         # verification page).
#         formatted_verification_code = format_verification_code(verification_code)
    
#         # Build the verification link from teh constant verificationLinkFormat (see
#         # above) and the formatted verification code.
#         verification_link = VERIFICATION_LINK_FORMAT + formatted_verification_code
    
#         # 1. Inspect signature on the uploaded PDF.
    
#         # Get an instance of the PadesSignatureExplorer class, used to open/validate
#         # PDF signatures.
#         signature_explorer = RestPki::PadesSignatureExplorer.new(get_rest_pki_client)
    
#         # Set the PDF file to be inspected.
#         signature_explorer.set_signature_file_from_path(pdf_path)
    
#         # Specify that we want to validate the signatures in the file, not only
#         # inspect them.
#         signature_explorer.validate = true
    
#         # Specify the signature for signature validation. On this sample, we will
#         # accept any valid PAdES signature as long as the signer is trusted by the
#         # security context.
#         signature_explorer.default_signature_policy_id = RestPki::StandardSignaturePolicies::PADES_BASIC
    
#         # Specify the security context to be used to determine trust in the
#         # certificate chain. We have encapsulated the security context choice on
#         # util.rb.
#         signature_explorer.security_context_id = get_security_context_id

#         signature = signature_explorer.open()

#         # 1. Create PDF with verification info from uploaded PDF.
#         pdf_marker = RestPki::PdfMarker.new(get_rest_pki_client)
#         pdf_marker.set_file_from_path(pdf_path)

#         # Build string with joined names of signers (see method getDisplayName below)
#         cert_display_names = []
#         for signer in signature.signers
#             cert_display_names.push(get_display_name(signer.certificate))
#         end
#         signer_names = join_strings_pt(cert_display_names)
#         all_pages_message = "This document was digitally signed by #{signer_names}.\n" + 
#             "To check the signatures, visit #{VERIFICATION_SITE_NAME_WITH_ARTICLE} at" +
#             " #{VERIFICATION_SITE} and inform this code #{formatted_verification_code}."

#         # PdfHelper is a class from the Rest PKI Client "fluent API" that helps to create elements and
#         # parameters for the PdfMarker.
#         pdf = RestPki::PdfHelper.new()
#         color_blue = RestPki::Color.new(0,0,100)
#         # ICP-Brasil logo on bottom-right corner of every page (except on the page which will be created
#         # at the end of the document).
#         pdf_marker.marks.push(
#             pdf.mark()
#             .on_all_pages()
#             .on_container(pdf.container().width(1).anchor_right(1).height(1).anchor_bottom(1))
#             .add_element(
#                 pdf.image_element()
#                 .with_opacity(75)
#                 .with_image(get_icp_brasil_logo_content(), "image/png")
#             )
#         )

#         # Summary on bottom margin of every page (except on the page which will be created at the end of
#         # the document).
#         pdf_marker.marks.push(
#             pdf.mark()
#             .on_all_pages()
#             .on_container(pdf.container().height(2).anchor_bottom().var_width().margins(1.5, 3.5))
#             .add_element(
#                 pdf.text_element()
#                 .with_opacity(75)
#                 .add_section_with_text(all_pages_message)
#             )
#         )

#         # Summary on right margin of every page (except on the page which will be created at the end of
#         # the document), rotated 90 degrees counterclockwise (text goes up).
#         pdf_marker.marks.push(
#             pdf.mark()
#             .on_all_pages()
#             .on_container(pdf.container().width(2).anchor_right().var_height().margins(1.5, 3.5))
#             .add_element(
#                 pdf.text_element()
#                 .rotate90_counter_clockwise()
#                 .with_opacity(75)
#                 .add_section_with_text(all_pages_message)
#             )
#         )

#         # Create a "manifest" mark on a new page added on the end of the document. We'll add several
#         # elements to this mark.
#         manifest_mark = pdf.mark()
#         .on_new_page() 
#         .on_container( # This mark's container is the whole page with 1-inch margins.
#             pdf.container().var_width_and_height().margins(2.54, 2.54)
#         )


#         # We'll keep track of our "vertical offset" as we add elements to the mark.
#         vertical_offset = 0

#         element_height = 3
#         # ICP-Brasil logo on the upper-left corner.
#         manifest_mark.add_element(
#             pdf.image_element()
#             .on_container(
#                 pdf.container().height(element_height).anchor_top(vertical_offset)
#                 .width(element_height) # using element_height as width because the image is square
#                 .anchor_left()
#             )
#             .with_image(get_icp_brasil_logo_content(), "image/png")
#         )
#         .add_element( # QR Code with the verification link on the upper-right corner.
#             pdf.qr_code_element()
#             .on_container(
#                 pdf.container().height(element_height).anchor_top(vertical_offset)
#                 .width(element_height) # using element_height as width because QR Codes are square 
#                 .anchor_right()
#             )
#             .with_qr_code_data(verification_link)
#         )
#         .add_element( # Header "VERIFICAÇÃO DAS ASSINATURAS" centered between ICP-Brasil logo and QR Code.
#             pdf.text_element()
#             .on_container(pdf.container().height(element_height).anchor_top(vertical_offset + 0.2).full_width())
#             .align_text_center()
#             .add_section(pdf.text_section().with_font_size(NORMAL_FONT_SIZE * 1.6).with_text("SIGNATURE\nCHECK"))
#         )
#         vertical_offset += element_height

#         # Vertical padding.
#         vertical_offset += 1.7

#         # Header with verification code.
#         element_height = 2
#         manifest_mark.add_element(
#             pdf.text_element()
#             .on_container(pdf.container().height(element_height).anchor_top(vertical_offset).full_width())
#             .align_text_center()
#             .add_section(
#                 pdf.text_section().with_font_size(NORMAL_FONT_SIZE * 1.2)
#                 .with_text("Verification Code: #{formatted_verification_code}")
#             )
#         )
#         vertical_offset += element_height

#         # Paragraph saying "this document was signed by the following signers etc" and mentioning the
#         # time zone of the date/times below.
#         element_height = 2.5
#         manifest_mark.add_element(
#             pdf.text_element()
#             .on_container(pdf.container().height(element_height).anchor_top(vertical_offset).full_width())
#             .add_section(
#                 pdf.text_section().with_font_size(NORMAL_FONT_SIZE)
#                 .with_text("This document was digitally signed by the following signers on the indicated dates (#{TIMEZONE_DISPLAY_NAME}):")
#             )
#         )
#         vertical_offset += element_height

#         # Iterate signers.
#         for signer in signature.signers

#             element_height = 1.5

#             # Green "check" or red "X" icon depending on result of validation for this signer.
#             manifest_mark.add_element(
#                 pdf.image_element()
#                 .on_container(pdf.container().height(0.5).anchor_top(vertical_offset + 0.2).width(0.5).anchor_left())
#                 .with_image(get_validation_result_icon(signer.validation_results.is_valid), "image/png")
#             )
#             .add_element( # Description of signer (see method getSignerDescription() below).
#                 pdf.text_element()
#                 .on_container(pdf.container().height(element_height).anchor_top(vertical_offset).var_width().margins(0.8, 0))
#                 .add_section(pdf.text_section().with_font_size(NORMAL_FONT_SIZE).with_text(get_signer_description(signer)))
#             )

#             vertical_offset += element_height
#         end

#         # Some vertical padding from last signer.
#         vertical_offset += 1

#         # Paragraph with link to verification site and citing both the verification code above and the
#         # verification link below.
#         element_height = 2.5
#         manifest_mark.add_element(
#             pdf.text_element()
#             .on_container(pdf.container().height(element_height).anchor_top(vertical_offset).full_width())
#             .add_section(
#                 pdf.text_section().with_font_size(NORMAL_FONT_SIZE)
#                 .with_text("To verify the signatures, go to #{VERIFICATION_SITE_NAME_WITH_ARTICLE} on ")
#             )
#             .add_section(pdf.text_section().with_font_size(NORMAL_FONT_SIZE).with_color(color_blue).with_text(VERIFICATION_SITE))
#             .add_section(
#                 pdf.text_section().with_font_size(NORMAL_FONT_SIZE).with_text(" and inform the code above or follow the link below:")
#             )
#         )
#         vertical_offset += element_height

#         # Verification link.
#         element_height = 1.5
#         manifest_mark.add_element(
#             pdf.text_element()
#             .on_container(pdf.container().height(element_height).anchor_top(vertical_offset).full_width())
#             .add_section(pdf.text_section().with_font_size(NORMAL_FONT_SIZE).with_color(color_blue).with_text(verification_link))
#             .align_text_center()
#         )

#         # Apply marks.
#         pdf_marker.marks.push(manifest_mark)
#         result = pdf_marker.apply()

#         result
#     end

#     def get_display_name(cert)
#         unless cert.pki_brazil.responsavel.to_s.empty?
#           return cert.pki_brazil.responsavel
#         end

#         cert.subject_name.common_name
#     end
    
#     def get_description(cert)
#         text = ''
#         text += get_display_name(cert)
#         unless cert.pki_brazil.cpf.to_s.empty?
#             text += " (CPF #{cert.pki_brazil.cpf_formatted})"
#         end
#         unless cert.pki_brazil.cnpj.to_s.empty?
#             text += ", company #{cert.pki_brazil.company_name} (CNPJ #{cert.pki_brazil.cnpj_formatted})"
#         end

#         text
#     end

#     def get_signer_description(signer)
#         text = ''
#         text += get_description(signer.certificate)
#         if signer.signing_time
#             text += DateTime.parse(signer.signing_time).new_offset(TIMEZONE_UTC_OFFSET).strftime(" on #{DATE_FORMAT}")
#         end
        
#         text
#     end
# end