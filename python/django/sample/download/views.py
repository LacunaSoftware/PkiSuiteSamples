from os.path import join, exists
from django.http import Http404, FileResponse
from storage_mock import get_sample_doc_name, STATIC_STORAGE_PATH, MEDIA_STORAGE_PATH


def get_file(_, filename):
    """

    This function's purpose is to download the sample file that is signed during
    the signature examples or download a upload file for signature or download a
    previously performed signature.

    """
    file_path = join(MEDIA_STORAGE_PATH, filename)
    if exists(file_path):
        return FileResponse(open(file_path, 'rb'), as_attachment=True)
    raise Http404


def get_doc(_, file_id):
    """

    This function's purpose is to download the sample file that is signed during
    the signature examples or download a upload file for signature or download a
    previously performed signature.

    """

    filename = "%02d.pdf" % (int(file_id) % 10)
    file_path = join(STATIC_STORAGE_PATH, filename)
    if exists(file_path):
        return FileResponse(open(file_path, 'rb'), as_attachment=True)
    raise Http404


def get_sample(_, file_id):
    """

    This function's purpose is to download the sample file to be signed.

    """
    (filename, mimetype) = get_sample_doc_name(int(file_id))
    file_path = join(STATIC_STORAGE_PATH, filename)
    if exists(file_path):
        return FileResponse(open(file_path, 'rb'), as_attachment=True)
    raise Http404