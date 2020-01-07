import os
import uuid
from os.path import basename

from flask import Blueprint
from flask import current_app
from flask import render_template
from flask import request
from werkzeug.utils import redirect
from sample.storage_mock import get_sample_doc_name, SampleDocs, create_app_data

blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/server-files')

@blueprint.route('/<rc>/<op>', methods=['GET', 'POST'])
def index(rc, op):
    if request.method == 'GET':
        if op == "cosignCms":
            available_files = [ServerFileModel(SampleDocs.CMS_SIGNED_ONCE, "A sample CMS file that was signed once."), ServerFileModel(SampleDocs.CMS_SIGNED_TWICE, "A sample CMS file that was signed twice.")]
        elif op == "cosignPdf" or op =="printerFriendlyPdf":
            available_files = [ServerFileModel(SampleDocs.PDF_SIGNED_ONCE, "A sample PDF that was signed once."), ServerFileModel(SampleDocs.PDF_SIGNED_TWICE, "A sample PDF that was signed twice.")]
        elif op == "signCms" or op == "signPdf":
            available_files = [ServerFileModel(SampleDocs.SAMPLE_PDF, "A sample PDF file to be signed.")]
        else:
            return render_template('error.html', msg='Invalid Operation')

        return render_template('server_files/index.html', rc=rc, available_files=available_files)
    else:
        sample_id = int(request.form['selectedFile'])
        filename = get_sample_doc_name(SampleDocs(sample_id))
        file_extension = filename.rsplit('.', 1)[1]
        
        # Copy file to the App_Data folder, where the upload files is stored.
        with open(os.path.join(current_app.static_folder, filename), 'rb') as f:
            sample_file = f.read()
        # Generate a unique filename.
        file_id = '%s.%s' % (str(uuid.uuid4()), file_extension)

        # Move the file to the "app_data" with the unique filename. Make sure
        # the "app_data" folder exists (static/util.py).
        create_app_data()
        with open(os.path.join(current_app.config['APPDATA_FOLDER'], file_id), 'wb') as f:
            f.write(sample_file)
            
        # Redirect the user to the signature route, passing the name of the file as
        # a URL argument.
        redirect_url = rc
        if op == "cosignCms":
            redirect_url += '/cosign/' + file_id
        else:
            redirect_url += '/' + file_id
        
        return redirect(redirect_url)

class ServerFileModel:
    def __init__(self, id, description):
        self.id = id.value
        self.description = description
        self.download_url = '/download/sample/' + str(id.value) 