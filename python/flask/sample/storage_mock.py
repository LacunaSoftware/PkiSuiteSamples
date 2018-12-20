import os

from flask import current_app


def create_app_data():
    if not os.path.exists(current_app.config['APPDATA_FOLDER']):
        os.makedirs(current_app.config['APPDATA_FOLDER'])

def get_pdf_stamp_path():
    return os.path.join(current_app.static_folder, 'PdfStamp.png')

def get_sample_batch_doc_path(file_id):
    return '%s/%02d.pdf' % (current_app.static_folder, (int(file_id) % 10))

def get_sample_doc_path():
    return os.path.join(current_app.static_folder, 'SampleDocument.pdf')

def get_pdf_stamp_content():
    with open(os.path.join(current_app.static_folder, 'PdfStamp.png'), 'rb') as f:
        pdf_stamp = f.read()
    return pdf_stamp
