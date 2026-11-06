import os
import uuid

from flask import render_template
from flask import make_response
from flask import request
from flask import current_app
from flask import Blueprint
from restpki_client import CadesSignatureStarter
from restpki_client import CadesSignatureFinisher
from restpki_client import StandardSignaturePolicies

from sample.storage_mock import create_app_data
from sample.utils import get_rest_pki_client
from sample.utils import get_expired_page_headers
from sample.utils import get_security_context_id

# Flask 2.2 and later reject blueprint names that contain a dot, because the
# name is prepended to the blueprint's endpoint names. The dots in the module
# name are replaced so that basename() keeps only its last part.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/cades-signature-rest')


@blueprint.route('/<file_to_sign>')
@blueprint.route('/cosign/<file_to_cosign>')
def index(file_to_sign=None, file_to_cosign=None):
    """

    This function initiates a CAdES signature using REST PKI and renders the
    signature page.

    All CAdES signature examples converge to this action, but with different
    URL arguments:

        1. Signature with a server file               : "file_to_sign" filled
        2. Signature with a file uploaded by the user : "file_to_sign" filled
        3. Co-signature of a previously signed CMS    : "file_to_cosign" filled

    """

    try:

        # Get an instance of the CadesSignatureStarter class, responsible for
        # receiving the signature elements and starting the signature process.
        signature_starter = CadesSignatureStarter(get_rest_pki_client())

        if file_to_cosign is not None:
            # If the "file_to_cosign" URL argument is filled, the user has
            # asked to co-sign a previously signed CMS. We'll set the path to
            # the CMS to be co-signed, which was previously saved in the
            # "app_data" folder. Note two important things:
            #
            #   1. The CMS to be co-signed must be set using the method
            #      "set_cms_to_cosign", not the method "set_file_to_sign".
            #
            #   2. Since we're creating CMSs with encapsulated content (see the
            #      encapsulate_content property below), we don't need to set
            #      the content to be signed, REST PKI will get the content from
            #      the CMS being co-signed.
            #
            signature_starter.set_cms_to_cosign_path(
                '%s/%s' % (current_app.config['APPDATA_FOLDER'], file_to_cosign))
        else:
            # Otherwise, the "file_to_sign" URL argument is filled: the user
            # was redirected here by the "upload" view (signature with a file
            # uploaded by the user) or by the "server_files" view. We'll set the
            # path of the file to be signed, which those views saved in the
            # app_data folder.
            signature_starter.set_file_to_sign_path(
                '%s/%s' % (current_app.config['APPDATA_FOLDER'], file_to_sign))

        # Set the signature policy.
        signature_starter.signature_policy =\
            StandardSignaturePolicies.PKI_BRAZIL_CADES_ADR_BASICA

        # Set a security context to be used to determine trust in the
        # certificate chain. We have encapsulated the security context choice on
        # utils.py.
        signature_starter.security_context = get_security_context_id()

        # Optionally, set whether the content should be encapsulated in the
        # resulting CMS. If this parameter is omitted, the following rules
        # apply:
        #
        # - If no CmsToCoSign is given, the resulting CMS will include the
        # content.
        # - If a CmsToCoSign is given, the resulting CMS will include the
        # content if and only if the CmsToCoSign also includes the content.
        #
        signature_starter.encapsulate_content = True

        # Call the start_with_webpki() method, which initiates the signature.
        # This yields the token, a 43-character case-sensitive URL-safe string,
        # which identifies this signature process. We'll use this value to call
        # the signWithRestPki() method on the Web PKI component (see
        # signature-form.js) and also to complete the signature after
        # the form is submitted (see method action()). This should not be
        # mistaken with the API access token.
        result = signature_starter.start_with_webpki()

        # The token acquired above can only be used for a single signature
        # attempt. In order to retry the signature it is necessary to get a
        # new token. This can be a problem if the user uses the back button of
        # the browser, since the browser might show a cached page that we
        # rendered previously, with a now stale token. To prevent this from
        # happening, we call the method get_expired_page_headers(), which
        # forces page expiration through HTTP headers to prevent caching of the
        # page.
        response = make_response(render_template('cades_signature_rest/index.html',
                                                 token=result.token))

        get_expired_page_headers(response.headers)
        return response

    except Exception as e:
        return render_template('error.html', msg=e)


@blueprint.route('/', methods=['POST'])
def action():
    """

    This method receives the form submission from the template
    cades_signature_rest/index.html. We'll call REST PKI to complete the
    signature.

    """

    try:
        # Get the token for this signature (rendered in a hidden input field,
        # see cades_signature_rest/index.html template).
        token = request.form['token']

        # Get an instance of the CadesSignatureFinisher class, responsible for
        # completing the signature process.
        signature_finisher = CadesSignatureFinisher(get_rest_pki_client())

        # Set the token.
        signature_finisher.token = token

        # Call the finish() method, which finalizes the signature process. The
        # return value is the CMS content.
        result = signature_finisher.finish()

        # Get information about the certificate used by the user to sign the
        # file. This method must only be called after calling the finish()
        # method.
        signer_cert = result.certificate

        # At this point, you'd typically store the signed CMS on your database.
        # For demonstration purposes, we'll store the CMS on a temporary folder
        # publicly accessible and render a link to it.

        create_app_data()  # Guarantees that "app data" folder exists.
        filename = '%s.p7s' % (str(uuid.uuid4()))
        result.write_to_file(
            os.path.join(current_app.config['APPDATA_FOLDER'], filename))

        return render_template('cades_signature_rest/complete.html',
                               signer_cert=signer_cert,
                               cms_file=filename)

    except Exception as e:
        return render_template('error.html', msg=e)
