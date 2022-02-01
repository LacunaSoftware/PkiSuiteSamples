import binascii
import os
import re
import uuid
from fpdf import FPDF

"""
    This function generates a new PDF document with all the main information for a medical prescription.
    It uses the package fpdf to create and edit the PDF, although there are different python packages 
    eith this purpose.

"""
def generate_receita_simples(name, crm, crmUf):
    # create new PDF document in A4 portrait and the measure is in milimeter
    document = FPDF('P', 'mm', 'A4');
    # create a new page 
    document.add_page()
    #left, top, right margins
    document.set_margins(1,2,1)
    # font: ariel, regular font
    document.set_font('Arial', "B", 16)

    # REQUIRED!!!
    # set all the PDF metadata
    # when value is not specified, use empty strings
    document.set_title("RECEITUÁRIO SIMPLES")
    document.set_subject("CRM: "+crm+ " UF: "+crmUf)
    especialidade = ""
    crf = ""
    crfUf = ""
    document.set_keywords("Especialidade: " + especialidade + " CRF: "
        + crf + "CRF-UF: " + crfUf)
    document.set_author(name)

    # set main information
    document.ln(8)
    document.cell(200,1,"NOME DO(A) MÉDICO(A): " + name,0,1,'L')
    document.ln(8)
    document.cell(200,1,"CRM: " + crm,0,1,'L')
    document.ln(8)
    document.cell(200,1,"UF: " + crmUf,0,1,'L')
    document.ln(12)

    
    # set remain content
    default_info = {"Telefone" :            "+00 (00) 0000-0000",
                   "Endereço" :             "Complexo Hospitalar", 
                    "Bairro" :              "Bairro do Mar",
                    "Cidade" :              "Brasília",
                    "UF" :                  "DF",
                    "Local de Atendimento" :"Clínica Local",
                    "CNES" :                "0000000",
                    "Nome do Paciente" :    "Maria da Silva",
                    "Prescrição" :          "Remédio X ---------- 1 comprimido de 12 em 12 horas por 3 dias",
                    "Data de Emissão" :     "00/00/0000"}

    document.set_font('Arial', "", 16)

    # associate each label to one value
    for label, value in default_info.items():
        document.cell(200, 1, label+": "+value,0, 2, 'L')
        document.ln(8)

    # Generate a unique filename.
    filename = '%s.%s' % (str(uuid.uuid4()), "pdf")
    
    # Return the document as a string, named with the generated filename
    return document.output(filename,'S').encode('latin-1'); 
