import os
import uuid
from datetime import datetime
from io import BytesIO

from flask import Blueprint
from flask import current_app
from flask import jsonify
from flask import redirect
from flask import render_template
from flask import request
from pypdf import PdfReader
from pypdf import PdfWriter
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus.tables import Table
from restpki_client import PdfHelper
from restpki_client import PdfMarker

from sample.storage_mock import create_app_data
from sample.utils import get_rest_pki_client


# 26-08-2022
# By further inspecting in the latest Blueprint documentation (https://flask.palletsprojects.com/en/2.2.x/api/#blueprint-objects),
# when creating a Blueprint object, the first parameter (name) is prepend to the URL endpoint. Therefore, Blueprint no longer
# allows dots in the name since it would break the URL entirely.
__name__ = __name__.replace(".","/")
blueprint = Blueprint(os.path.basename(__name__), __name__,
                      url_prefix='/receita-simples-rest')

# ITI's validator (https://validar.iti.gov.br/) reads the QR code on the prescription and calls the
# iti_validation route below, so it must reach this app on a public URL. To try it, expose the app
# with a tunnel such as ngrok and put its address here.
PUBLIC_URL = 'http://localhost:5000'

UFS = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS',
       'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC',
       'SE', 'SP', 'TO']


@blueprint.route('/')
def index():
    """

    This function renders the form with the prescriber's data.

    """
    return render_template('receita_simples_rest/index.html', ufs=UFS)


@blueprint.route('/generate', methods=['POST'])
def generate():
    """

    This function receives the form submission, generates the Receita Simples
    PDF with the prescription metadata required by ICP-Brasil and redirects to
    the PAdES signature with REST PKI (see pades_signature_rest.py).

    """
    try:
        create_app_data()
        filename = '%s.pdf' % str(uuid.uuid4())
        file_path = os.path.join(current_app.config['APPDATA_FOLDER'],
                                 filename)

        # Prescription data.
        doctor_name = request.form['name']
        crm = request.form['crm']
        crm_uf = request.form['crm_uf']
        fields = [
            ['Dr.', doctor_name],
            ['CRM', crm + ' - ' + crm_uf],
            ['Nome do Paciente', 'Maria da Silva'],
            ['Nome Local de Atendimento', 'Clínica Local'],
            ['Telefone', '+00 (00) 0000-0000'],
            ['Endereço', 'Complexo Hospitalar'],
            ['Cidade', 'Brasília'],
            ['Bairro', 'Bairro do Mar'],
            ['CNES', '0000000'],
            ['UF', 'DF'],
            ['Data de Emissão', '00/00/0000'],
            ['Prescrição', 'Dipirona ----------- 1 comprimido de 12 em 12 '
                           'horas por 3 dias'],
        ]

        # Generate the PDF. See the ReportLab documentation for the full list
        # of functionality.
        pdf_canvas = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter
        pdf_canvas.setFont('Helvetica-Bold', 25)
        pdf_canvas.drawCentredString(width / 2, height - 60,
                                     'RECEITUÁRIO SIMPLES')
        table = Table(fields, style=[
            ('FONTNAME', (0, 0), (-1, -1), 'Times-Roman'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
        ])
        table.wrapOn(pdf_canvas, width, height)
        table.drawOn(pdf_canvas, 60, 470)
        pdf_canvas.showPage()
        pdf_canvas.save()

        # Add the metadata. A prescription MUST have all the following
        # entries, keyed by the OIDs that ICP-Brasil defines for them.
        writer = PdfWriter()
        writer.append_pages_from_reader(PdfReader(file_path))
        writer.add_metadata({
            '/Title': 'Receita Simples',
            '/Author': doctor_name,
            '/Subject': 'Receita Simples',
            '/Keywords': 'metadata pdf',
            '/Creator': 'PkiSuiteSample',
            '/CreationDate': datetime.now().isoformat(),
            '/2.16.76.1.12.1.1': '',       # Prescrição de medicamento
            '/2.16.76.1.4.2.2.1': crm,     # CRM
            '/2.16.76.1.4.2.2.2': crm_uf,  # CRM UF
            '/2.16.76.1.4.2.2.3': '',      # Especialidade
            '/2.16.76.1.4.2.3.1': '',      # CRF
            '/2.16.76.1.4.2.3.2': '',      # CRF UF
            '/2.16.76.1.4.2.3.3': '',      # Especialidade
        })
        output = BytesIO()
        writer.write(output)
        with open(file_path, 'wb') as f:
            f.write(output.getvalue())

        # Optionally, add a QR code that ITI's validator uses to download the
        # signed prescription (see iti_validation below). We use REST PKI's
        # PdfMarker, which applies marks on the PDF.
        pdf_marker = PdfMarker(get_rest_pki_client())
        pdf_marker.file_path = file_path

        # PdfHelper is a class from the REST PKI's "fluent API" that helps
        # creating elements and parameters for the PdfMarker. Create a
        # "manifest" mark on a new page added on the end of the document, with
        # the QR code on its lower-right corner. The QR code is a square, so its
        # width is the same as its height.
        pdf = PdfHelper()
        manifest_mark = pdf.mark() \
            .on_container(pdf.container().var_width_and_height().margins(2.54, 2.54))
        manifest_mark.add_element(
            pdf.qr_code_element()
            .on_container(pdf.container().height(3).anchor_bottom(10).width(3).anchor_right())
            .with_qr_code_data(PUBLIC_URL + '/receita-simples-rest/iti-validation')
            .draw_quiet_zones())
        pdf_marker.marks.append(manifest_mark)

        result = pdf_marker.apply()
        result.write_to_file(file_path)

        # Sign the prescription with the PAdES signature sample.
        return redirect('/pades-signature-rest/%s' % filename)

    except Exception as e:
        return render_template('error.html', msg=e)


@blueprint.route('/iti-validation')
def iti_validation():
    """

    This function answers ITI's validator, which calls it with the code that the
    user types there (_secretCode). In this sample, the code is the name of the
    signed file shown at the end of the signature. The response tells the
    validator where to download the signed prescription.

    """
    # The code comes from the request, so keep only its file name part.
    secret_code = os.path.basename(request.args.get('_secretCode', ''))
    if not secret_code or not os.path.exists(
            os.path.join(current_app.config['APPDATA_FOLDER'], secret_code)):
        return jsonify(error='Prescription not found'), 404

    return jsonify({
        'version': '1.0.0',
        'prescription': {
            'signatureFiles': {
                'url': '%s/download/%s' % (PUBLIC_URL, secret_code),
            },
        },
    })
