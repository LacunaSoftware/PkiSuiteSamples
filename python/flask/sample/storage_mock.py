import os
import uuid

from os.path import exists
from os.path import join

from flask import current_app
from flask import session
from enum import Enum


class SampleDocs (Enum): 
	SAMPLE_PDF =  0
	PDF_SIGNED_ONCE = 1
	PDF_SIGNED_TWICE = 2
	CMS_SIGNED_ONCE = 3
	CMS_SIGNED_TWICE = 4
	SAMPLE_XML = 5
	SAMPLE_NFE = 6


def create_app_data():
    if not exists(current_app.config['APPDATA_FOLDER']):
        os.makedirs(current_app.config['APPDATA_FOLDER'])


def get_pdf_stamp_path():
    return join(current_app.static_folder, 'PdfStamp.png')


def get_sample_batch_doc_path(file_id):
    return '%s/%02d.pdf' % (current_app.static_folder, (int(file_id) % 10))


def get_sample_doc_path():
    return join(current_app.static_folder, 'SampleDocument.pdf')


def get_pdf_stamp_content():
    with open(join(current_app.static_folder, 'PdfStamp.png'), 'rb') as f:
        pdf_stamp = f.read()
    return pdf_stamp


def get_sample_doc_name(sample_id):
    if sample_id == SampleDocs.SAMPLE_PDF:
        return 'SampleDocument.pdf'
    elif sample_id == SampleDocs.PDF_SIGNED_ONCE:
        return 'SamplePdfSignedOnce.pdf'
    elif sample_id == SampleDocs.PDF_SIGNED_TWICE:
        return 'SamplePdfSignedTwice.pdf'
    elif sample_id == SampleDocs.CMS_SIGNED_ONCE:
        return 'SampleCms.p7s'
    elif sample_id == SampleDocs.CMS_SIGNED_TWICE:
        return 'SampleCmsSignedTwice.p7s'
    elif sample_id == SampleDocs.SAMPLE_XML:
        return 'SampleDocument.xml'
    elif sample_id == SampleDocs.SAMPLE_NFE:
            return 'SampleNFe.xml'
    else:
        raise Exception('Invalid sample document identification.')


def get_sample_nfe_path():
    return '%s/%s' % (current_app.static_folder, 'SampleNFe.xml')


def get_sample_xml_document_path():
    return '%s/%s' % (current_app.static_folder, 'SampleDocument.xml')


def get_validation_result_icon(is_valid):
    filename = "ok.png" if is_valid else "not-ok.png"
    with open(join(current_app.static_folder, filename), 'rb') as f:
        valid_icon = f.read()
    return valid_icon


def get_icp_brasil_logo_content():
    with open(join(current_app.static_folder, 'icp-brasil.png'), 'rb') as f:
        icp_brasil_logo = f.read()
    return icp_brasil_logo


def get_verification_code(file_id):
    """

    Returns the verification code associated with the given document, or
    null if no verification code has been associated with it.

    """
    # >>>>> NOTICE <<<<<
    # This should be implemented on your application as a SELECT on your
    # "document table" by the ID of the document, returning the value of the
    # verification code column.
    return session.get("Files/%s/Code" % file_id)


def set_verification_code(file_id, code):
    """

    Registers the verification code for a given document.

    """
    # >>>>> NOTICE <<<<<
    # This should be implemented on your application as a SELECT on your
    # "document table" by the verification code column, which should be an
    # indexed column.
    session["Files/%s/Code" % file_id] = code
    session["Codes/%s" % code] = file_id


def lookup_verification_code(code):
    """

    Returns the ID of the document associated with a given verification
    code, or null if no document matcher the given code.


    """
    if code is None or len(code) == 0:
        return None

    return session.get("Codes/%s" % code)
