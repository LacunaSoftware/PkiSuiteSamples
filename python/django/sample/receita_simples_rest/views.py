import uuid
from os.path import join
from datetime import datetime
from django.shortcuts import render
from django.http import HttpResponseNotFound, HttpResponseRedirect
from storage_mock import create_app_data, MEDIA_STORAGE_PATH

from PyPDF2 import PdfFileReader, PdfFileWriter
from reportlab.platypus.tables import Table
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4

from restpki_client import PdfMarker, PdfHelper

from utils import get_rest_pki_client


def index(request):
    """

    This function renders the receita simples form.

    """
    if request.method == 'GET':
        ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
        'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ',
        'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']
        return render(request, 'receita_simples_rest/index.html', {'ufs': ufs})
    else:
        return HttpResponseNotFound()


def generate(request):
    """

    This function receives the form submission from the template
    receita_simples_rest/index.html and generate the receita simples
    PDF.

    """
    if request.method == 'POST':
        create_app_data()
        filename = '%s.pdf' % (str(uuid.uuid4()))
        file_path = join(MEDIA_STORAGE_PATH, filename)

        # Dados receita
        nome_medico = request.POST['name']
        crm = request.POST['crm']
        crm_uf = request.POST['crm_uf']
        default_fields = [
            ["Dr.", nome_medico],
            ["CRM", crm + " - " + crm_uf],
            [ "Nome do Paciente", "Maria da Silva"],
            ["Nome Local de Atendimento", "Clínica Local"],
            ["Telefone", "+00 (00) 0000-0000"],
            ["Endereço", "Complexo Hospitalar"], 
            ["Cidade", "Brasília"], 
            ["Bairro", "Bairro do Mar"], 
            ["CNES", "0000000"], 
            ["UF", "DF"],
            ["Data de Emissão", "00/00/0000"], 
            ["Prescrição", "Dipirona ----------- 1 comprimido de 12 em 12 horas por 3 dias"]]

        ## GERAÇÂO DO PDF
        # Here's where the PDF generation happens.
        # See the ReportLab documentation for the full list of functionality.
        p = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter
        p.setFont("Helvetica-Bold", 25)

        p.drawCentredString(width/2, height-60, "RECEITUÁRIO SIMPLES")

        table_style = [
            ('FONTNAME', (0,0), (-1,-1), 'Times-Roman'),
            ('FONTSIZE', (0,0), (-1,-1), 12)
        ]
        table = Table(default_fields, style=table_style)
        table.wrapOn(p, width, height)
        table.drawOn(p, 60, 470)

        # Close the PDF object cleanly.
        p.showPage()
        p.save()

        ## INSERÇÃO DE METADADOS
        # MUST HAVE ALL THE FOLLOWING METADATA
        info = {
            '/Title': 'Receita Simples',
            '/Author': nome_medico,
            '/Subject': 'Receita Simples',
            '/Keywords': 'metadata pdf',
            '/Creator': 'PkiSuiteSample',
            '/CreationDate': datetime.now().isoformat(),
            '/2.16.76.1.12.1.1': '',      # Prescrição de medicamento
            '/2.16.76.1.4.2.2.1': crm,    # CRM
            '/2.16.76.1.4.2.2.2': crm_uf, # CRM UF
            '/2.16.76.1.4.2.2.3': '',     # Especialidade
            '/2.16.76.1.4.2.3.1': '',     # CRF
            '/2.16.76.1.4.2.3.2': '',     # CRF UF
            '/2.16.76.1.4.2.3.3': ''      # Especialidade
        }

        # Add metadata
        fin = open(file_path, 'rb')
        reader = PdfFileReader(fin)
        writer = PdfFileWriter()
        writer.appendPagesFromReader(reader)
        writer.addMetadata(info)
        fout = open(file_path, 'ab') 
        writer.write(fout)
        fin.close()
        fout.close()

        ## INSERÇÃO DE QR CODE
        # Add QR Code for ITI Validation - Optional
        url_base = "http://8341-191-176-217-42.ngrok.io"
        iti_verification_link = url_base + "/ReceitaSimplesSdk/ItiValidation"
        client = get_rest_pki_client()

        # Get an instance of the PdfMarker class, used to apply marks on the PDF.
        pdf_marker = PdfMarker(client)
        # Specify the file to be marked.
        pdf_marker.file_path = file_path

        # PdfHelper is a class from the REST PKI's "fluent API" that helps
        # creating elements and parameters for the PdfMarker.
        pdf = PdfHelper()

        # Create a "manifest" mark on a new page added on the end of the document.
        # We'll add several elements to this mark.
        manifest_mark = pdf.mark()\
            .on_container(
                pdf.container()
                .var_width_and_height()
                .margins(2.54, 2.54))
        # QR Code with the verification link on the upper-right corner. Using
        # elementHeight as width because the image is a square.
        manifest_mark.add_element(
            pdf.qr_code_element()
            .on_container(
                pdf.container()
                .height(3)
                .anchor_bottom(10)
                .width(3)
                .anchor_right())
            .with_qr_code_data(iti_verification_link)
            .draw_quiet_zones())

        # Add marks.
        pdf_marker.marks.append(manifest_mark)

        # Apply marks.
        result = pdf_marker.apply()
        result.write_to_file(file_path)

        # Redirect to PAdES Signature to start the signature processs
        return HttpResponseRedirect(join('/pades-signature-rest/', filename))
    else:
        return HttpResponseNotFound()