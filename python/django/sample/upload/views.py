import uuid
from os.path import join, exists
from django.shortcuts import render
from django.http import HttpResponseRedirect
from storage_mock import create_app_data, MEDIA_STORAGE_PATH
from werkzeug.utils import secure_filename


def index(request):
    """

    This function allows the user to upload a file to be signed. Once the file
    is uploaded, we save it to the app_data folder and redirect the user to
    cades-signature or pades-signature view passing the filename on the
    "userfile" URL argument.

    """
    rc = request.GET.get('rc')
    if request.method == 'POST':
        userfile = request.FILES['userfile']

        # Generate a unique filename.
        filename = '%s_%s' % (str(uuid.uuid4()), secure_filename(userfile.name))

        with userfile.open('rb') as f:
            sample_file = f.read()

        # Move the file to the "app_data" with the unique filename. Make sure
        # the "app_data" folder exists (static/util.py).
        create_app_data()
        with open(join(MEDIA_STORAGE_PATH, filename), 'wb') as f:
            f.write(sample_file)

        # Redirect the user to the redirect parameter "rc".
        redirect_url = '../' + rc
        if request.GET.get('certId', None) is not None:
            redirect_url += '?fileId=%s&certId=%s' % (filename, request.GET.get('certId'))
        else:
            redirect_url += '/%s' % filename
        return HttpResponseRedirect(redirect_url)
    else:
        return render(request, 'upload/index.html', {'rc': rc})