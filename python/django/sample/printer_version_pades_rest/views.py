import uuid
from datetime import datetime
from os.path import join

from django.shortcuts import render
from django.http import Http404, FileResponse

from restpki_client import Color, StandardSignaturePolicies
from restpki_client import PadesSignatureExplorer
from restpki_client import PdfHelper, PdfMarker

from storage_mock import get_verification_code
from storage_mock import get_icp_brasil_logo_content
from storage_mock import get_validation_result_icon
from storage_mock import set_verification_code
from storage_mock import MEDIA_STORAGE_PATH
from utils import generate_verification_code, get_rest_pki_client
from utils import get_security_context_id, get_description
from utils import join_strings_pt, get_display_name
from utils import format_verification_code


################################################################################
# Configuration of the printer-friendly version
################################################################################

# Name of your website, with preceding article (article in lowercase)
VERIFICATION_SITE_NAME_WITH_ARTICLE = 'my Verification Center'

# Publicly accessible URL of your website. Preferably HTTPS.
VERIFICATION_SITE = 'http://localhost:5000'

# Format of the verification link, with "%s" as the verification code
# placeholder.
VERIFICATION_LINK_FORMAT = 'http://localhost:8000/check-pades-rest/%s'

# "Normal" font size. Sizes of header fonts are defined based on this size.
NORMAL_FONT_SIZE = 12.0

# Date format to be used when converting dates to string.
DATE_FORMAT = ''

# Display name of the timezone chosen above
TIME_ZONE_DISPLAY_NAME = 'Brasilia timezone'

# You may also change texts, positions and more by editing directly the method
# generate_printer_version below.
################################################################################

def index(request, file_id):
    """

    This generates a printer-friendly version from a signature file using REST PKI.

    """
    if request.method == 'GET':
        file_path = join(MEDIA_STORAGE_PATH, file_id)

        # Check if doc already has a verification code registered on storage.
        verification_code = get_verification_code(request.session, file_id)
        if verification_code is None:
            # If not, generate and register it.
            verification_code = generate_verification_code()
            set_verification_code(request.session, file_id, verification_code)

        # Generate marks on printer-friendly version.
        pfv_file = generate_printer_friendly_version(file_path, verification_code)
        pfv_path = join(MEDIA_STORAGE_PATH, pfv_file)
        return FileResponse(open(pfv_path, 'rb'), as_attachment=True)
    else:
        return Http404()

def get_signer_description(signer):
    text = get_description(signer.certificate)
    if signer.signing_time is not None:
        text += " on %s" % datetime.strftime(signer.signing_time,
                                             '%d/%m/%Y %H:%M')
    return text

def generate_printer_friendly_version(pdf_path, verification_code):
    client = get_rest_pki_client()

    # The verification code is generated without hyphens to save storage space
    # and avoid copy-and-paste problems. On the PDF generation, we use the
    # "formatted" version, with hyphens (which will later be discarded on the
    # verification page)
    formatted_verification_code = format_verification_code(verification_code)

    # Build the verification link from the constant "VERIFICATION_LINK_FORMAT"
    # (see above) and the formatted verification code.
    verification_link = VERIFICATION_LINK_FORMAT % formatted_verification_code

    # 1. Upload the PDF.

    blob_token = client.upload_file_from_path(pdf_path)

    # 2. Inspect signatures on the uploaded PDF

    # Get and instance of the PadesSignatureExplorer class, used to
    # open/validate PDF signatures.
    sig_explorer = PadesSignatureExplorer(client)
    # Specify that we want to validate the signatures in the file, not only
    # inspect them.
    sig_explorer.validate = True
    # Set the PDF file to be inspected.
    sig_explorer.signature_file_blob_token = blob_token
    # Specify the parameters for the signature validation:
    # Accept any PAdES signature as long as the signer has an ICP-Brasil
    # certificate.
    sig_explorer.default_signature_policy_id = \
        StandardSignaturePolicies.PADES_BASIC
    # Specify the security context to be used to determine trust in the
    # certificate chain. We have encapsulated the security context on utils.py.
    sig_explorer.security_context_id = get_security_context_id()
    # Call the open() method, which returns the signature file's information.
    signature = sig_explorer.open()

    # 3. Create PDF with the verification information from uploaded PDF.

    # Get an instance of the PdfMarker class, used to apply marks on the PDF.
    pdf_marker = PdfMarker(client)
    # Specify the file to be marked.
    pdf_marker.file_blob_token = blob_token

    # Build string with joined names of signers (see method get_display_name
    # below)
    signer_names_list = []
    for signer in signature.signers:
        signer_names_list.append(get_display_name(signer.certificate))
    signer_names = join_strings_pt(signer_names_list)
    all_pages_message = "This document was digitally signed by %s.\n" \
                        "To check the signatures, visit %s at %s and inform this code %s." % (signer_names, VERIFICATION_SITE_NAME_WITH_ARTICLE, VERIFICATION_SITE, formatted_verification_code)

    # PdfHelper is a class from the PKI Express's "fluent API" that helps
    # creating elements and parameters for the PdfMarker.
    pdf = PdfHelper()

    # ICP-Brasil logo on bottom-right corner of every page (except on the page
    # which will be created at the end of the document)
    pdf_marker.marks.append(
        pdf.mark()
        .on_all_pages()
        .on_container(
            pdf.container()
            .width(1.0)
            .anchor_right(1.0)
            .height(1.0)
            .anchor_bottom(1.0))
        .add_element(
            pdf.image_element()
            .with_opacity(75)
            .with_image_content(get_icp_brasil_logo_content(), "image/png")))

    # Summary on bottom margin of every page (except on the page which will be
    # created at the end of the document)
    pdf_marker.marks.append(
        pdf.mark()
        .on_all_pages()
        .on_container(
            pdf.container()
            .height(2.0)
            .anchor_bottom()
            .var_width()
            .margins(1.5, 3.5))
        .add_element(
            pdf.text_element()
            .with_opacity(75)
            .add_section_from_text(all_pages_message)))

    # Summary on right margin of every page (except on the page which will be
    # created at the end of the document), rotated 90 degrees counterclockwise
    # (text goes up).
    pdf_marker.marks.append(
        pdf.mark()
        .on_all_pages()
        .on_container(
            pdf.container()
            .width(2.0)
            .anchor_right()
            .var_height()
            .margins(1.5, 3.5))
        .add_element(
            pdf.text_element()
            .rotate_90_counter_clockwise()
            .with_opacity(75)
            .add_section_from_text(all_pages_message)))

    # Create a "manifest" mark on a new page added on the end of the document.
    # We'll add several elements to this mark.
    manifest_mark = pdf.mark()\
        .on_new_page()\
        .on_container(
            pdf.container()
            .var_width_and_height()
            .margins(2.54, 2.54))

    # We'll keep track of our "vertical offset" as we add elements to the mark.
    vertical_offset = 0

    element_height = 3
    # ICP-Brasil logo on the upper-left corner. Using elementHeight as width
    # because the image is a square.
    manifest_mark.add_element(
        pdf.image_element()
        .on_container(
            pdf.container()
            .height(element_height)
            .anchor_top(vertical_offset)
            .width(element_height)
            .anchor_left())
        .with_image_content(get_icp_brasil_logo_content(), "image/png"))

    # QR Code with the verification link on the upper-right corner. Using
    # elementHeight as width because the image is a square.
    manifest_mark.add_element(
        pdf.qr_code_element()
        .on_container(
            pdf.container()
            .height(element_height)
            .anchor_top(vertical_offset)
            .width(element_height)
            .anchor_right())
        .with_qr_code_data(verification_link)
        .draw_quiet_zones())

    manifest_mark.add_element(
        pdf.text_element()
        .on_container(
            pdf.container()
            .height(element_height)
            .anchor_top(vertical_offset * 0.2)
            .full_width())
        .align_text_center()
        .add_section(
            pdf.text_section()
            .with_font_size(NORMAL_FONT_SIZE * 1.6)
            .with_text('SIGNATURE\nCHECK')))
    vertical_offset += element_height

    # Vertical padding.
    vertical_offset += 1.7

    # Header with verification code.
    element_height = 2
    manifest_mark.add_element(
        pdf.text_element()
        .on_container(
            pdf.container()
            .height(element_height)
            .anchor_top(vertical_offset)
            .full_width())
        .align_text_center()
        .add_section(
            pdf.text_section()
            .with_font_size(NORMAL_FONT_SIZE * 1.2)
            .with_text("Verification code: %s" % formatted_verification_code)))
    vertical_offset += element_height

    # Paragraph saving "this document was signed by the following signers etc"
    # and mentioning the timezone of the date/times below.
    element_height = 2.5
    manifest_mark.add_element(
        pdf.text_element()
        .on_container(
            pdf.container()
            .height(element_height)
            .anchor_top(vertical_offset)
            .full_width())
        .add_section(
            pdf.text_section()
            .with_font_size(NORMAL_FONT_SIZE)
            .with_text("This document was digitally signed by the following signers on the indicated dates (%s):" % TIME_ZONE_DISPLAY_NAME)))
    vertical_offset += element_height

    # Iterate signers.
    for signer in signature.signers:

        element_height = 1.5
        # Green "check" or red "X" icon depending on result of validation for
        # this signer.
        manifest_mark.add_element(
            pdf.image_element()
            .on_container(
                pdf.container()
                .height(0.5)
                .anchor_top(vertical_offset + 0.2)
                .width(0.5).anchor_left())
            .with_image_content(get_validation_result_icon(signer.validation_results.is_valid), 'image/png'))

        # Description of signer (see method  get_signer_description() below).
        manifest_mark.add_element(
            pdf.text_element()
            .on_container(
                pdf.container()
                .height(element_height)
                .anchor_top(vertical_offset)
                .var_width()
                .margins(0.8, 0.0))
            .add_section(
                pdf.text_section()
                .with_font_size(NORMAL_FONT_SIZE)
                .with_text(get_signer_description(signer))))

        vertical_offset += element_height

    # Some vertical padding for last signer.
    vertical_offset += 1.0

    # Paragraph with link to verification site and citing both the verification
    # code above and the verification link below.
    element_height = 2.5
    manifest_mark.add_element(
        pdf.text_element()
        .on_container(
            pdf.container()
            .height(element_height)
            .anchor_top(vertical_offset)
            .full_width())
        .add_section(
            pdf.text_section()
            .with_font_size(NORMAL_FONT_SIZE)
            .with_text("In order to check the signatures, visit %s at " % VERIFICATION_SITE_NAME_WITH_ARTICLE))
        .add_section(
            pdf.text_section()
            .with_font_size(NORMAL_FONT_SIZE)
            .with_color(Color.BLUE)
            .with_text(VERIFICATION_SITE))
        .add_section(
            pdf.text_section()
            .with_font_size(NORMAL_FONT_SIZE)
            .with_text(' and inform the code above or access the link below:')))
    vertical_offset += element_height

    # Verification link.
    element_height = 1.5
    manifest_mark.add_element(
        pdf.text_element()
        .on_container(
            pdf.container()
            .height(element_height)
            .anchor_top(vertical_offset)
            .full_width())
        .add_section(
            pdf.text_section()
            .with_font_size(NORMAL_FONT_SIZE)
            .with_color(Color.BLUE)
            .with_text(verification_link))
        .align_text_center())

    # Add marks.
    pdf_marker.marks.append(manifest_mark)

    # Generate path for output file and add the marker.
    pfv_filename = "%s.pdf" % str(uuid.uuid4())

    # Apply marks.
    result = pdf_marker.apply()
    result.write_to_file(join(MEDIA_STORAGE_PATH, pfv_filename))

    # Return content of the printer-friendly version.
    return pfv_filename
