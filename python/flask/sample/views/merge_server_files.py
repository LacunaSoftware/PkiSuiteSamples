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
                      url_prefix='/merge-server-files')


@blueprint.route('/<rc>', methods=['GET', 'POST'])
def index(rc):
    if request.method == 'GET':
        available_files = [
            MergeServerFileModel(0, SampleDocs.CMS_DETACHED_1, SampleDocs.CMS_DETACHED_2, 'A sample where both CMS don\'t have encapsulated content.'),
            MergeServerFileModel(1, SampleDocs.CMS_ATTACHED_1, SampleDocs.CMS_DETACHED_2, 'A sample where a CMS has encapsulated content and another doesn\'t.'),
            MergeServerFileModel(2, SampleDocs.CMS_ATTACHED_1, SampleDocs.CMS_ATTACHED_2, 'A sample where both CMS have encapsulated content.'),
            MergeServerFileModel(3, SampleDocs.CMS_DETACHED_1, None, 'A sample where the original file is attached to a CMS that doesn\'t have encapsulated content.')]
        sample_file_id = SampleDocs.CMS_DATA_FILE
        return render_template('merge_server_files/index.html', available_files=available_files, sample_file_id=sample_file_id)
    else:
        sample_id = int(request.form['selectedSample'])
        data_file = get_sample_doc_name(SampleDocs.CMS_DATA_FILE)

        redirect_url = '../../' + rc + "/"

        if sample_id == 0:
            file1 = get_sample_doc_name(SampleDocs.CMS_DETACHED_1)
            file2 = get_sample_doc_name(SampleDocs.CMS_DETACHED_2)

            redirect_url += copy_from_static_to_app_data(data_file) + \
                      '/' + copy_from_static_to_app_data(file1)     + \
                      '/' + copy_from_static_to_app_data(file2)
        elif sample_id == 1:
            file1 = get_sample_doc_name(SampleDocs.CMS_ATTACHED_1)
            file2 = get_sample_doc_name(SampleDocs.CMS_DETACHED_2)

            redirect_url += copy_from_static_to_app_data(data_file) + \
                      '/' + copy_from_static_to_app_data(file1)     + \
                      '/' + copy_from_static_to_app_data(file2)
        elif sample_id == 2:
            file1 = get_sample_doc_name(SampleDocs.CMS_ATTACHED_1)
            file2 = get_sample_doc_name(SampleDocs.CMS_ATTACHED_2)

            redirect_url += copy_from_static_to_app_data(file1) + \
                      '/' + copy_from_static_to_app_data(file2)
        else:
            file1 = get_sample_doc_name(SampleDocs.CMS_DETACHED_1)

            redirect_url += 'attach/' + copy_from_static_to_app_data(data_file) + \
                            '/' +       copy_from_static_to_app_data(file1)

        return redirect(redirect_url)


def copy_from_static_to_app_data(filename):
    # Copy file to the App_Data folder, where the upload files is stored.
    with open(os.path.join(current_app.static_folder, filename), 'rb') as f:
        sample_file = f.read()
    # Generate a unique filename.
    new_filename = '%s.%s' % (str(uuid.uuid4()), 'p7s')

    # Move the file to the "app_data" with the unique filename. Make sure
    # the "app_data" folder exists (static/util.py).
    create_app_data()
    with open(os.path.join(current_app.config['APPDATA_FOLDER'], new_filename), 'wb') as f:
        f.write(sample_file)

    return new_filename


class MergeServerFileModel:
    def __init__(self, optionId, id1, id2, description):
        self.optionId = optionId
        self.id1 = id1
        self.id2 = id2
        self.description = description