"""

This sample performs a merge of CAdES signatures using PKI Express.

"""
import os
import uuid

from flask import Blueprint
from flask import render_template
from flask import current_app

from pkiexpress import CadesSignatureEditor
from sample.storage_mock import create_app_data
from sample.utils import set_pki_defaults


# Flask 2.2 and later reject blueprint names that contain a dot, because the
# name is prepended to the blueprint's endpoint names. The dots in the module
# name are replaced so that basename() keeps only its last part.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/merge-cades-express')


@blueprint.route('/<data_file_id>/<file_id1>/<file_id2>')
def detached(data_file_id, file_id1, file_id2):
    """

    This function performs a merge of CAdES signatures using PKI Express
    when both signatures don't have encapsulated content or when one
    signature has encapsulated content and the other doesn't.

    """
    # Get an instance of the CadesSignatureEditor class, responsible for
    # receiving the files and merging them.
    signature_editor = CadesSignatureEditor()

    # Set PKI default options (see utils.py).
    set_pki_defaults(signature_editor)
    
    # Guarantees that "app data" folder exists.
    create_app_data()

    # Generate output filename
    output_file = '%s.p7s' % (str(uuid.uuid4()))

    # Set the CMS data file
    signature_editor.set_data_file_from_path(os.path.join(current_app.config['APPDATA_FOLDER'], data_file_id))

    # Add both signatures
    signature_editor.add_cms_file_from_path(os.path.join(current_app.config['APPDATA_FOLDER'], file_id1))
    signature_editor.add_cms_file_from_path(os.path.join(current_app.config['APPDATA_FOLDER'], file_id2))

    # Set path to output file
    signature_editor.output_file = os.path.join(os.path.join(current_app.config['APPDATA_FOLDER'], output_file))

    # Merge files
    signature_editor.merge()

    return render_template('merge_cades_express/index.html', output_file=output_file)


@blueprint.route('/<file_id1>/<file_id2>')
def attached(file_id1, file_id2):
    """

    This function performs a merge of CAdES signatures using PKI Express
    when both signatures have encapsulated content

    """
    # Get an instance of the CadesSignatureEditor class, responsible for
    # receiving the files and merging them.
    signature_editor = CadesSignatureEditor()

    # Set PKI default options (see utils.py).
    set_pki_defaults(signature_editor)
    
    # Guarantees that "app data" folder exists.
    create_app_data()

    # Generate output filename
    output_file = '%s.p7s' % (str(uuid.uuid4()))

    # Add both signatures
    signature_editor.add_cms_file_from_path(os.path.join(current_app.config['APPDATA_FOLDER'], file_id1))
    signature_editor.add_cms_file_from_path(os.path.join(current_app.config['APPDATA_FOLDER'], file_id2))

    # Set path to output file
    signature_editor.output_file = os.path.join(current_app.config['APPDATA_FOLDER'], output_file)
    
    # Merge files
    signature_editor.merge()
    return render_template('merge_cades_express/index.html', output_file=output_file)

@blueprint.route('/attach/<data_file_id>/<file_id1>')
def generate_attached(data_file_id, file_id1):
    """

    This function uses PKI Express to merge the data file and a detached CMS
    into a CMS with encapsulated content.

    """
    # Get an instance of the CadesSignatureEditor class, responsible for
    # receiving the files and merging them.
    signature_editor = CadesSignatureEditor()

    # Set PKI default options (see utils.py).
    set_pki_defaults(signature_editor)

    # Guarantees that "app data" folder exists.
    create_app_data()

    # Generate output filename
    output_file = '%s.p7s' % (str(uuid.uuid4()))

    # Set the CMS data file
    signature_editor.set_data_file_from_path(os.path.join(current_app.config['APPDATA_FOLDER'], data_file_id))

    # Add detached CMS file
    signature_editor.add_cms_file_from_path(os.path.join(current_app.config['APPDATA_FOLDER'], file_id1))

    # Set path to output file
    signature_editor.output_file = os.path.join(current_app.config['APPDATA_FOLDER'], output_file)

    # Merge files
    signature_editor.merge()

    return render_template('merge_cades_express/index.html', output_file=output_file)
