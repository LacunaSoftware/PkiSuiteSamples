import os

from flask import current_app
from flask import Blueprint
from flask import render_template
from flask import redirect
from pkiexpress import InstallationNotFoundError
from pkiexpress import PadesSignatureStarter

from sample.storage_mock import get_sample_doc_path

blueprint = Blueprint(os.path.basename(__name__), __name__, url_prefix='/')


@blueprint.route('/')
def index():
    """

    This function will render the main page.

    """
    return render_template('home/index.html')

@blueprint.route('/check-pki-express/<rc>')
@blueprint.route('/check-pki-express/<rc>/<fwd>')
@blueprint.route('/check-pki-express/<rc>/<fwd>/<op>')
def check_pki_express(rc, fwd=None, op=None):
    """
    
    This function will check PKI Express installation.
    
    """
    try:
        starter = PadesSignatureStarter()
        starter.set_pdf_to_sign_from_path(get_sample_doc_path())
        starter.set_certificate_from_base64('MIIFLTCCBBegAwIBAgIQAPlQfZfK+GbabULPDzWHmTALBgkqhkiG9w0BAQswVTELMAkGA1UEBhMCQlIxEzARBgNVBAoMCklDUC1CcmFzaWwxHTAbBgNVBAsMFExhY3VuYSBTb2Z0d2FyZSAtIExTMRIwEAYDVQQDDAlMYWN1bmEgQ0EwHhcNMTUwMTIwMTAyMzU5WhcNMTkwMTIwMTAyMzU1WjBtMQswCQYDVQQGEwJCUjETMBEGA1UECgwKSUNQLUJyYXNpbDEuMCwGA1UECwwlQXV0aGVudGljYXRlZCBieSBMYWN1bmEgU29mdHdhcmUgLSBMUzEZMBcGA1UEAwwQUGllcnJlIGRlIEZlcm1hdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALzmguTacZ4YiFpzUvE9xQEFB2bs8FXdXK8DCEDIq6mTudxFQzicCvF1rn5tgJZVDl4ANjKGDnQFUUhW50gf9xCxcytYkf7jWeabiGrHYweQggoTbguc8mY/OIl1W+0GAoVtpFrBs27zHcE4kPu9DJwJjKNHp00SuRkx35WezRRas940vg15eZKFneyw0VaacJelVdtSwto5HrsoFgQIEQhh/33FHhfVt9XnZ1UiZVZPZcOETJ8ebJpjtKL83yy4QKFc235dp0iudAdCVIY4oAlwVjCn6U9dIZk7qR0H1OYE1f2z8lTtiWx/jg/j+bBpMayVz7HEFqJe/mFBimeY5ZECAwEAAaOCAeMwggHfMAkGA1UdEwQCMAAwHwYDVR0jBBgwFoAU0qjYpb7yDHVFWfnN4BUYSk7c2/cwDgYDVR0PAQH/BAQDAgXgMIGmBgNVHREEgZ4wgZugPQYFYEwBAwGgNAQyMDEwMTE5NzA0NzM2MzM2MTg4NjAwMDAwMDAwMDAwMDAwMDAwMDQ5Mzg4ODI3U1NQREagFwYFYEwBAwagDgQMODg1NTc3NTM0NjUyoCgGBWBMAQMFoB8EHTkxMjkzOTIxOTc3NTc3NzY2NjZCcmFzaWxpYURGgRd0ZXN0QGxhY3VuYXNvZnR3YXJlLmNvbTBQBgNVHSAESTBHMEUGBmBMAQIBADA7MDkGCCsGAQUFBwIBFi1odHRwOi8vY2F0ZXN0LmxhY3VuYXNvZnR3YXJlLmNvbS9kcGNhY3JmYi5wZGYwOQYDVR0fBDIwMDAuoCygKoYoaHR0cDovL2NhdGVzdC5sYWN1bmFzb2Z0d2FyZS5jb20vY3Jscy9jYTAdBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwQwTAYIKwYBBQUHAQEEQDA+MDwGCCsGAQUFBzAChjBodHRwOi8vY2F0ZXN0LmxhY3VuYXNvZnR3YXJlLmNvbS9jZXJ0aWZpY2F0ZXMvY2EwCwYJKoZIhvcNAQELA4IBAQAAyc4Ylt4Fa2n8DdfjFLTAt4Y78uR3Fo+on8yE2fUG/B/CNLw0TEuSKpvCra1igNjU4VmqRsPAGJiKGaOZe0XeuySVvd16z6J92GLI/02qKvPBuC2qaBF9eu+Hhd4G0G/gnIKFEr/LMoOkBrfU9CL/9jm3/MT2s9F8uF8OBjP0TDaMJkc3yNS9RYEhAM1EdfXUStEv4Zs+Yy+CkkL1vCha1+sH8zNdkYbNMxdGYQTrcG8I1TTh9NLxitTAM7j5JrPycp3rUvu/rq94VnBN9CzN62TWvkaFpQuZSg6FKrsjyGWbpUN96Y21p7QTUAliq226eGBk5BZD8+7ZuZGmG07J')
        starter.start()
    except InstallationNotFoundError:
        return render_template('home/express-installation-not-found.html')

    if fwd is not None and len(fwd) > 0:
        if op is not None and len(op) > 0:
            return redirect('/%s/%s-express/%s' % (rc, fwd, op))
        return redirect('/%s/%s-express' % (rc, fwd))
    return redirect('/%s-express' % rc)

@blueprint.route('/check-restpki-token/<rc>')
@blueprint.route('/check-restpki-token/<rc>/<fwd>')
@blueprint.route('/check-restpki-token/<rc>/<fwd>/<op>')
def check_restpki_token(rc, fwd=None, op=None):
    """

    This function will check if the REST PKI token is set.

    """
    access_token = current_app.config['REST_PKI_ACCESS_TOKEN']
    if access_token is None or len(access_token) == 0:
        return render_template('home/restpki-token-not-set.html')

    if fwd is not None and len(fwd) > 0:
        if op is not None and len(op) > 0:
            return redirect('/%s/%s-restpki/%s' % (rc, fwd, op))
        return redirect('/%s/%s-restpki' % (rc, fwd))
    return redirect('/%s-restpki' % rc)
