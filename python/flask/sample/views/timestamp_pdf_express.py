import uuid

from os.path import basename
from os.path import exists
from os.path import join

from flask import Blueprint
from flask import current_app
from flask import render_template
from flask import send_from_directory
from pkiexpress import PadesTimestamper

from sample.storage_mock import create_app_data
from sample.utils import set_pki_defaults

# 21-07-2022
# For some reason, Blueprint has stopped accepting names containing dots('.'),
# so the exception would be thrown at the blueprint instantiation. In order to 
# solve that we replaced all occurrences of dots with forward slash ('/'). This fix
# made the PkiSuiteSamples Flask example run normally again
__name__ = __name__.replace(".","/")
blueprint = Blueprint(basename(__name__), __name__,
                      url_prefix='/timestamp-pdf-express')


@blueprint.route('/<file_id>')
def index(file_id):

    # Locate document. This sample should not continue if the file is not found.
    if not exists(join(current_app.config['APPDATA_FOLDER'], file_id)):
        return render_template('error.html', msg='File not found')

    # Get an instance of the PadesTimestamper class, used to timestamp a PDF
    # file.
    stamper = PadesTimestamper()

    # Set PKI default (see utils.py).
    set_pki_defaults(stamper)

    # Set the PDF to be timestamped.
    stamper.set_pdf_from_path(join(current_app.config['APPDATA_FOLDER'],
                                   file_id))

    # Generate path for output file and add to the stamper.
    create_app_data()  # Guarantees that "app_data" folder exists.
    output_file = '%s.pdf' % str(uuid.uuid4())
    output_file_path = join(current_app.config['APPDATA_FOLDER'], output_file)
    stamper.output_file_path = output_file_path

    # Add a timestamp to the PDF file.
    stamper.stamp()

    # Return the stamped PDF as a downloadable file.
    return send_from_directory(current_app.config['APPDATA_FOLDER'],
                               output_file)
