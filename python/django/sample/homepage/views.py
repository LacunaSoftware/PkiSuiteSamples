from django.shortcuts import render


def index(request):
    """

    This function initiates the homepage

    """
    pades_rest_urls = [
        ('server-files?rc=pades-signature-rest&op=signPdf', 'Sign a PDF stored on the server'),
        # ('upload?rc=pades-signature-rest/', 'Sign a PDF stored on the user\'s machine'),
        ('pades-signature-rest/', 'Sign a PDF stored on the server'),
        ('receita-simples-rest/', 'Receita Simples'),
        ('server-files?rc=pades-signature-rest&op=cosignPdf', 'Co-sign a PDF'),
        # ('upload?rc=open-pades-rest/', 'Validate PDF signature'),
        ('server-files?rc=printer-version-pades-rest&op=printerFriendlyPdf', 'Generate a printer-friendly version from a PDF signature')
    ]
    return render(request, 'homepage/index.html', {'pades_rest_urls': pades_rest_urls})