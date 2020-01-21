"""

This sample performs a merge of CAdES signature using PKI Express.

"""
import os
import uuid

from flask import Blueprint
from flask import render_template
from flask import current_app

from pkiexpress import CadesSignatureEditor
from sample.storage_mock import create_app_data
from sample.utils import set_pki_defaults


blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/merge-cades-express')


@blueprint.route('/detached/<data_file_id>/<file_id1>/<file_id2>')
def detached(data_file_id, file_id1, file_id2):
    """

    This function performs a merge of CAdES signature using PKI Express
    when both signatures doesn't have encapsulated content

    """
    # Get an instance of the CadesSignatureEditor class, responsible for
    # receiving the files and merge them.
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


@blueprint.route('/attached/<file_id1>/<file_id2>')
def attached(file_id1, file_id2):
    """

    This function performs a merge of CAdES signature using PKI Express
    when both signatures have encapsulated content

    """
    # Get an instance of the CadesSignatureEditor class, responsible for
    # receiving the files and merge them.
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


@blueprint.route('/mixed/<data_file_id>/<file_id1>/<file_id2>')
def mixed(data_file_id, file_id1, file_id2):
    """

    This function performs a merge of CAdES signature using PKI Express
    when one signature has encpasulated content and the other doesn't

    """
    # Get an instance of the CadesSignatureEditor class, responsible for
    # receiving the files and merge them.
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
    signature_editor.output_file = os.path.join(current_app.config['APPDATA_FOLDER'], output_file)

    # Merge files
    signature_editor.merge()

    return render_template('merge_cades_express/index.html', output_file=output_file)