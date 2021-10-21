import os
import uuid

from os.path import exists
from os.path import join
from django.conf import settings

MEDIA_STORAGE_PATH = settings.BASE_DIR.as_posix() + settings.MEDIA_URL
STATIC_STORAGE_PATH = settings.BASE_DIR.as_posix() + settings.STATIC_URL

class SampleDocs (): 
    SAMPLE_PDF =  0
    PDF_SIGNED_ONCE = 1
    PDF_SIGNED_TWICE = 2
    CMS_SIGNED_ONCE = 3
    CMS_SIGNED_TWICE = 4
    SAMPLE_XML = 5
    SAMPLE_NFE = 6
    CMS_DETACHED_1 = 7
    CMS_DETACHED_2 = 8
    CMS_ATTACHED_1 = 9
    CMS_ATTACHED_2 = 10
    CMS_DATA_FILE = 11


def create_app_data():
    if not exists(MEDIA_STORAGE_PATH):
        os.makedirs(MEDIA_STORAGE_PATH)


def get_pdf_stamp_path():
    return join(STATIC_STORAGE_PATH, 'PdfStamp.png')


def get_sample_batch_doc_path(file_id):
    return '%s/%02d.pdf' % (STATIC_STORAGE_PATH, (int(file_id) % 10))


def get_sample_doc_path():
    return join(STATIC_STORAGE_PATH, 'SampleDocument.pdf')


def get_pdf_stamp_content():
    with open(join(STATIC_STORAGE_PATH, 'PdfStamp.png'), 'rb') as f:
        pdf_stamp = f.read()
    return pdf_stamp


def get_sample_doc_name(sample_id):
    if sample_id == SampleDocs.SAMPLE_PDF:
        return ('SampleDocument.pdf', 'application/pdf')
    elif sample_id == SampleDocs.PDF_SIGNED_ONCE:
        return ('SamplePdfSignedOnce.pdf', 'application/pdf')
    elif sample_id == SampleDocs.PDF_SIGNED_TWICE:
        return ('SamplePdfSignedTwice.pdf', 'application/pdf')
    elif sample_id == SampleDocs.CMS_SIGNED_ONCE:
        return ('SampleCms.p7s', 'application/pkcs7-signature')
    elif sample_id == SampleDocs.CMS_SIGNED_TWICE:
        return ('SampleCmsSignedTwice.p7s', 'application/pkcs7-signature')
    elif sample_id == SampleDocs.SAMPLE_XML:
        return ('SampleDocument.xml', 'application/xml')
    elif sample_id == SampleDocs.SAMPLE_NFE:
        return ('SampleNFe.xml', 'application/xml')
    elif sample_id == SampleDocs.CMS_DETACHED_1:
        return ('CMSDetached1.p7s', 'application/pkcs7-signature')
    elif sample_id == SampleDocs.CMS_DETACHED_2:
        return ('CMSDetached2.p7s', 'application/pkcs7-signature')
    elif sample_id == SampleDocs.CMS_ATTACHED_1:
        return ('CMSAttached1.p7s', 'application/pkcs7-signature')
    elif sample_id == SampleDocs.CMS_ATTACHED_2:
        return ('CMSAttached2.p7s', 'application/pkcs7-signature')
    elif sample_id == SampleDocs.CMS_DATA_FILE:
        return ('CMSDataFile.pdf', 'application/pdf')
    else:
        raise Exception('Invalid sample document identification.')


def get_validation_result_icon(is_valid):
    filename = "ok.png" if is_valid else "not-ok.png"
    with open(join(STATIC_STORAGE_PATH, filename), 'rb') as f:
        valid_icon = f.read()
    return valid_icon


def get_icp_brasil_logo_content():
    with open(join(STATIC_STORAGE_PATH, 'icp-brasil.png'), 'rb') as f:
        icp_brasil_logo = f.read()
    return icp_brasil_logo


def get_verification_code(session, file_id):
    """

    Returns the verification code associated with the given document, or
    null if no verification code has been associated with it.

    """
    # >>>>> NOTICE <<<<<
    # This should be implemented on your application as a SELECT on your
    # "document table" by the ID of the document, returning the value of the
    # verification code column.
    return session.get("Files/%s/Code" % file_id)


def set_verification_code(session, file_id, code):
    """

    Registers the verification code for a given document.

    """
    # >>>>> NOTICE <<<<<
    # This should be implemented on your application as a SELECT on your
    # "document table" by the verification code column, which should be an
    # indexed column.
    session["Files/%s/Code" % file_id] = code
    session["Codes/%s" % code] = file_id


def lookup_verification_code(session, code):
    """

    Returns the ID of the document associated with a given verification
    code, or null if no document matcher the given code.

    """
    if code is None or len(code) == 0:
        return None

    return session.get("Codes/%s" % code)
