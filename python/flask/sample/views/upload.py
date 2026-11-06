import os
import uuid

from flask import render_template
from flask import request
from flask import current_app
from flask import Blueprint
from werkzeug.utils import secure_filename
from werkzeug.utils import redirect

from sample.storage_mock import create_app_data

# Flask 2.2 and later reject blueprint names that contain a dot, because the
# name is prepended to the blueprint's endpoint names. This blueprint has a
# fixed name, "upload".
__name__ = __name__.replace(".","/")
blueprint = Blueprint('upload', __name__, url_prefix='/upload')


@blueprint.route('/<rc>', methods=['GET', 'POST'])
def upload(rc):
    """

    This function allows the user to upload a file to be signed. Once the file
    is uploaded, we save it to the app_data folder and redirect the user to
    the sample given by the "rc" URL argument, passing the filename as the
    last part of the URL.

    """

    if request.method == 'POST':
        userfile = request.files['userfile']

        # Generate a unique filename.
        filename = '%s_%s' % (str(uuid.uuid4()), secure_filename(
            userfile.filename))

        # Save the file to the "app_data" folder with the unique filename. Make
        # sure the "app_data" folder exists (see sample/storage_mock.py).
        create_app_data()
        userfile.save(
            os.path.join(current_app.config['APPDATA_FOLDER'], filename))

        # Redirect the user to the redirect parameter "rc".
        if request.args.get('certId', None) is not None:
            return redirect('/%s/%s?certId=%s' % (rc, filename, request.args.get('certId')))
        return redirect('/%s/%s' % (rc, filename))
    else:
        return render_template('upload/index.html')
