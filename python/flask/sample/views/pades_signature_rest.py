import base64
from io import BytesIO
import os
import uuid

from flask import render_template
from flask import make_response
from flask import request
from flask import current_app
from flask import Blueprint
from itsdangerous import base64_decode, base64_encode
# from restpki_client import PadesSignatureStarter
# from restpki_client import PadesSignatureFinisher
# from restpki_client import StandardSignaturePolicies
# import restpki_client

from sample.pades_visual_elements_rest import PadesVisualElementsRest
from sample.storage_mock import create_app_data, get_icp_brasil_logo_content, get_pdf_stamp_content
from sample.utils import get_rest_pki_client
from sample.utils import get_expired_page_headers
from sample.utils import get_security_context_id

from restpki_ng_python_client import *


# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects), 
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer 
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/pades-signature-rest')


@blueprint.route('/<file_to_sign>')
def index(file_to_sign=None):
    """

    This function initiates a PAdES signature using REST PKI and renders the
    signature page.

    Both PAdES signature examples, with a server file and with a file uploaded
    by the user, converge to this function. The difference is that, when the
    file is uploaded by the user, the function is called with a URL argument
    named "userfile".

    """

    try:

        # Get an instantiate of the PadesSignatureStarter class, responsible for
        # receiving the signature elements and start the signature process.
        # signature_starter = PadesSignatureStarter(get_rest_pki_client())

        client = RestPkiClient(api_key="dev-support|c40706850488334bbdbc2741df0202088ba66e5224af49f9852777230b211345",
        endpoint="https://homolog.core.pki.rest/")
        

        # Set the PDF to be signed.
        # signature_starter.set_pdf_to_sign(
        #     '%s/%s' % (current_app.config['APPDATA_FOLDER'], file_to_sign))

        # # Set the signature policy.
        # signature_starter.signature_policy =\
        #     StandardSignaturePolicies.PADES_BASIC

        # # Set a security context to be used to determine trust in the
        # # certificate chain. We have encapsulated the security context choice on
        # # util.py.
        # signature_starter.security_context = get_security_context_id()

        # # Set the visual representation for the signature. We have encapsulated
        # # this code (on util-pades.py) to be used on various PAdES examples.
        # signature_starter.visual_representation = \
            # PadesVisualElementsRest.get_visual_representation()

        # # Call the start_with_webpki() method, which initiates the signature.
        # # This yields the token, a 43-character case-sensitive URL-safe string,
        # # which identifies this signature process. We'll use this value to call
        # # the signWithRestPki() method on the Web PKI component (see
        # # signature-form.js javascript) and also to complete the signature after
        # # the form is submitted (see method pades_signature_action()). This
        # # should not be mistaken with the API access token.
        # result = signature_starter.start_with_webpki()
        file = open('%s/%s' % (current_app.config['APPDATA_FOLDER'], file_to_sign), 'rb')
        file_processed = base64.encodebytes(file.read()).decode('utf-8')
        # image_stamp = base64.b64encode(get_pdf_stamp_content()).decode("utf-8")
        # print(image_stamp)
        # print("file_processed:", file_processed)
        file.close()
        pades_sig_v2 = PadesSignaturePostRequestV2(
            # Set file to sign
            pdfToSign = FileModel(
                content=file_processed,
                mimeType="application/pdf"),
            # Set certificate thumbprint
            # certificate="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",
            # Set signature policy
            signaturePolicyId="78d20b33-014d-440e-ad07-929f05d00cdf",
            # Set security context
            securityContextId="803517ad-3bbc-4169-b085-60053a8f6dbf",
            # Set visual representation
            visual_representation = PadesVisualRepresentationModel(
                    text = PadesVisualTextModel(
                        font_size = 13.0, 
                        include_signing_time = True, 
                        text="restpkicore",
                        horizontal_align = 'Left', 
                        container = PadesVisualRectangleModel(
                            left = 0.2, 
                            top = 0.2, 
                            right = 0.2, 
                            bottom = 0.2,
                        )
                    ),
                    image= PadesVisualImageModel(
                        resource = ResourceContentOrReference(
                        content = base64.b64encode(get_pdf_stamp_content()).decode("utf-8"),
                        mimeType='image/png'
                        ), 
                        horizontalAlign = PadesHorizontalAlign.RIGHT,
                        verticalAlign = PadesVerticalAlign.CENTER 
                    ),
                    position = PadesVisualPositioningModel(
                        page_number = 0, 
                        measurement_units = PadesMeasurementUnits.CENTIMETERS,
                        auto = PadesVisualAutoPositioningModel(
                            container = PadesVisualRectangleModel( 
                                height = 4.94,
                                width=2.0
                            ), 
                            signature_rectangle_size = PadesSizeModel(
                                height = 8.0, 
                                width = 4.94,
                            )
                        )
                    ),
                )
            )
        res = client.start_pades_signature_v2(pades_sig_v2)
        # client.pdf_add_marks(
        #     PdfAddMarksRequest(
        #         file=FileModel(
        #             file = FileModel(
        #             mime_type = 'application/pdf', 
        #             content = file_processed
        #             ),
        #         marks = [
        #             PdfMarkModel(
        #                 container = PadesVisualRectangleModel(
        #                     left = 0.2, 
        #                     top = 0.2, 
        #                     right = 0.2, 
        #                     bottom = 0.2), 
        #                 border_width = 0.5, 
        #                 border_color = ColorModel(
        #                     red = 56, 
        #                     green = 56, 
        #                     blue = 56, 
        #                     alpha = 1), 
        #                 background_color = ColorModel(
        #                     red = 56, 
        #                     green = 56, 
        #                     blue = 56, 
        #                     alpha = 1), 
        #                 elements = [
        #                     PdfMarkElementModel(
        #                         element_type = 'Text', 
        #                         relative_container = PadesVisualRectangleModel(
        #                             left = 0.2, 
        #                             top = 0.2, 
        #                             right = 0.2, 
        #                             bottom = 0.2, 
        #                             width = 2, 
        #                             height = 1), 
        #                         rotation = 56, 
        #                         text_sections = [
        #                             PdfTextSectionModel(
        #                                 text = '0', 
        #                                 style = 'Normal', 
        #                                 color = ColorModel(red=255, green=0, blue=0, alpha=0), 
        #                                 font_size = 13)
        #                             ], 
        #                         image = PdfMarkImageModel(
        #                             opacity = 1.337, 
        #                             resource = ResourceContentOrReference(
        #                                 url = '', 
        #                                 content = get_icp_brasil_logo_content(), 
        #                                 mime_type = '')), 
        #                         qr_code_data = '', 
        #                         qr_code_draw_quiet_zones = True, 
        #                         align = 'Left', 
        #                         vertical_align = 'Top', 
        #                         opacity = 1.337)
        #                     ], 
        #                 page_option = 'AllPages', 
        #                 page_option_number = 56)
        #             ],
        #         abort_if_signed = True,
        #         measurement_units = 'Centimeters',
        #         page_optimization = PadesPageOptimizationModel(
        #             paper_size = 'Custom', 
        #             custom_paper_size = PadesSizeModel(
        #                 height = 1.337, 
        #                 width = 1.337), 
        #             page_orientation = 'Auto'),
        #         force_blob_result = True,
        #         preserve_signatures_visual_representation = True
        #         )
        #     )
        # )   
        print("token: ", res.token)
        

        # The token acquired above can only be used for a single signature
        # attempt. In order to retry the signature it is necessary to get a new
        # token. This can be a problem if the user uses the back button of the
        # browser, since the browser might show a cached page that we rendered
        # previously, with a now stale token. To prevent this from happen, we
        # force page expiration through HTTP headers to prevent caching of the
        # page.
        response = make_response(
            render_template('pades_signature_rest/index.html',
                            token=res.token))
        get_expired_page_headers(response.headers)
        return response

    except Exception as e:
        return render_template('error.html', msg=e)


@blueprint.route('/', methods=['POST'])
def action():
    """

    This function receives the form submission from the template
    cades-signature/index.html. We'll call REST PKI to complete the signature.

    """

    try:
        client = RestPkiClient(api_key="dev-support|c40706850488334bbdbc2741df0202088ba66e5224af49f9852777230b211345",
        endpoint="https://homolog.core.pki.rest")

        # Get the token for this signature. (rendered in a hidden input field,
        # see pades-signature/index.html template)
        token = request.form['token']

        pades_sig_finisher_res = client.complete_pades_signature_with_token(token=token)

        # Get an intance of the PadesSignatureFinisher class, responsible for
        # completing the signature process.

        # Set the token.
        # signature_finisher.token = token

        # Call the finish() method, which finalizes the signature process. The
        # return value is the signed PDF content.
        # result = signature_finisher.finish()

        # Get information about the certificate used by the user to sign the
        # file. This method must only be called after calling the finish()
        # method.
        # signer_cert = result.certificate
        signer_cert = pades_sig_finisher_res.certificate

        # At this point, you'd typically store the signed PDF on your database.
        # For demonstration purposes, we'll store the PDF on a temporary folder
        # publicly accessible and render a link to it.

        create_app_data()  # Guarantees that "app data" folder exists.
        filename = '%s.pdf' % (str(uuid.uuid4()))
        file = FileModel(content=pades_sig_finisher_res.signed_pdf, mimeType="application/pdf")
        file_util = FileUtils(client, file)
        file_util.write_to_file(os.path.join(current_app.config['APPDATA_FOLDER'], filename))

        return render_template('pades_signature_rest/complete.html',
                               signer_cert=signer_cert,
                               signed_pdf=filename)

    except Exception as e:
        return render_template('error.html', msg=e)