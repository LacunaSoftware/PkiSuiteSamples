from os.path import join
import uuid
from django.shortcuts import render
from django.http import Http404, HttpResponseRedirect
from storage_mock import get_sample_doc_name, SampleDocs, create_app_data
from storage_mock import STATIC_STORAGE_PATH, MEDIA_STORAGE_PATH


def index(request):
    if request.method == 'GET':
        op = request.GET.get('op')
        rc = request.GET.get('rc')
        if op == "cosignCms":
            available_files = [ServerFileModel(SampleDocs.CMS_SIGNED_ONCE, "A sample CMS file that was signed once."), ServerFileModel(SampleDocs.CMS_SIGNED_TWICE, "A sample CMS file that was signed twice.")]
        elif op == "cosignPdf" or op =="printerFriendlyPdf":
            available_files = [ServerFileModel(SampleDocs.PDF_SIGNED_ONCE, "A sample PDF that was signed once."), ServerFileModel(SampleDocs.PDF_SIGNED_TWICE, "A sample PDF that was signed twice.")]
        elif op == "signCms" or op == "signPdf":
            available_files = [ServerFileModel(SampleDocs.SAMPLE_PDF, "A sample PDF file to be signed.")]
        else:
            return render(request, 'error.html', msg='Invalid Operation')

        return render(request, 'server_files/index.html', { 'rc':rc, 'available_files': available_files })
    else:
        op = request.GET.get('op')
        rc = request.GET.get('rc')
        sample_id = int(request.POST.get('selectedFile', ""))
        filename = get_sample_doc_name(sample_id)
        file_extension = filename[0].rsplit('.', 1)[1]

        # Copy file to the App_Data folder, where the upload files is stored.
        with open(join(STATIC_STORAGE_PATH, filename[0]), 'rb') as f:
            sample_file = f.read()
        # Generate a unique filename.
        file_id = '%s.%s' % (str(uuid.uuid4()), file_extension)

        # Move the file to the "app_data" with the unique filename. Make sure
        # the "app_data" folder exists (static/util.py).
        create_app_data()
        with open(join(MEDIA_STORAGE_PATH, file_id), 'wb') as f:
            f.write(sample_file)

        # Redirect the user to the signature route, passing the name of the file
        # as a URL argument.
        redirect_url = '../' + rc
        if op == "cosignCms":
            redirect_url += '/cosign/' + file_id
        else:
            redirect_url += '/' + file_id
        return HttpResponseRedirect(redirect_url)


class ServerFileModel:
    def __init__(self, id, description):
        self.id = id
        self.description = description
        self.download_url = '/download/sample/' + str(id) 