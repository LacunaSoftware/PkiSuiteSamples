import os

from flask import send_from_directory
from flask import current_app
from flask import Blueprint
from sample.storage_mock import get_sample_doc_name, SampleDocs

# Flask 2.2 and later reject blueprint names that contain a dot, because the
# name is prepended to the blueprint's endpoint names. The dots in the module
# name are replaced so that basename() keeps only its last part.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/download')


@blueprint.route('/<filename>')
def get_file(filename):
    """

    This function's purpose is to download a file from the app_data folder:
    the sample file that is signed during the signature examples, an uploaded
    file for signature or a previously performed signature.

    """

    return send_from_directory(current_app.config['APPDATA_FOLDER'], filename)


@blueprint.route('/doc/<file_id>')
def get_doc(file_id):
    """

    This function's purpose is to download one of the documents signed by the
    batch signature examples (static/00.pdf to static/09.pdf).

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
                               filename, as_attachment=True, download_name=filename)