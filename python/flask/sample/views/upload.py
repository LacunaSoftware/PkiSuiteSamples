import os
import uuid

from flask import render_template
from flask import request
from flask import current_app
from flask import Blueprint
from werkzeug.utils import secure_filename
from werkzeug.utils import redirect

from sample.storage_mock import create_app_data

# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects), 
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer 
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint('upload', __name__, url_prefix='/upload')


@blueprint.route('/<rc>', methods=['GET', 'POST'])
def upload(rc):
    """

    This function allows the user to upload a file to be signed. Once the file
    is uploaded, we save it to the app_data folder and redirect the user to
    cades-signature or pades-signature view passing the filename on the
    "userfile" URL argument.

    """

    if request.method == 'POST':
        userfile = request.files['userfile']

        # Generate a unique filename.
        filename = '%s_%s' % (str(uuid.uuid4()), secure_filename(
            userfile.filename))

        # Move the file to the "app_data" with the unique filename. Make sure
        # the "app_data" folder exists (static/util.py).
        create_app_data()
        userfile.save(
            os.path.join(current_app.config['APPDATA_FOLDER'], filename))

        # Redirect the user to the redirect parameter "rc".
        if request.args.get('certId', None) is not None:
            return redirect('/%s/%s?certId=%s' % (rc, filename, request.args.get('certId')))
        return redirect('/%s/%s' % (rc, filename))
    else:
        return render_template('upload/index.html')
