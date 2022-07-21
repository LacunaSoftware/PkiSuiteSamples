import os

from flask import send_from_directory
from flask import current_app
from flask import Blueprint
from sample.storage_mock import get_sample_doc_name, SampleDocs

# 21-07-2022
# For some reason, Blueprint has stopped accepting names containing dots('.'),
# so the exception would be thrown at the blueprint instantiation. In order to 
# solve that we replaced all occurrences of dots with forward slash ('/'). This fix
# made the PkiSuiteSamples Flask example run normally again
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