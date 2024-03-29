import os

from flask import send_from_directory
from flask import current_app
from flask import Blueprint
from sample.storage_mock import get_sample_doc_name, SampleDocs

# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects), 
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer 
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/download')


@blueprint.route('/<filename>')
def get_file(filename):
    """

    This function's purpose is to download the sample file that is signed during
    the signature examples or download a upload file for signature or download a
    previously performed signature.

    """

    return send_from_directory(current_app.config['APPDATA_FOLDER'], filename)


@blueprint.route('/doc/<file_id>')
def get_doc(file_id):
    """

    This function's purpose is to download the sample file that is signed during
    the signature examples or download a upload file for signature or download a
    previously performed signature.

    """

    return send_from_directory(current_app.static_folder,
                               "%02d.pdf" % (int(file_id) % 10))

@blueprint.route('/sample/<file_id>')
def get_sample(file_id):
    """

    This function's purpose is to download the sample file to be signed.

    """
    filename = get_sample_doc_name(int(file_id))
    return send_from_directory(current_app.static_folder,
                               filename, as_attachment=True, attachment_filename=filename)