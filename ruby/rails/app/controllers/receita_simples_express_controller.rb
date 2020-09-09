require 'pki_express'
require 'prawn'

class ReceitaSimplesExpressController < ApplicationController
  include PadesVisualElementsExpress

  # GET /receita-simples-express
  #
  # This file initiates the generation of Receita Simples file.
  def index
    @ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 
      'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']
  end

  # POST /receita-simples-express/generate
  #
  # This file generates the Receita Simples file and it performs a PAdES 
  # signature in three steps using PKI Express and Web PKI.
  def generate
    nome_medico = params[:name]
    crm = params[:crm]
    crm_uf = params[:crm_uf]

    ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 
    'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']

    default_field_name = [ "03_Telefone Local de Atendimento", "03_Endereço Local de Atendimento",
        "03_Data Emissão_af_date", "03_Cidade Local de Atendimento", "01_Nome do Paciente",
        "03_Nome Local de Atendimento", "02_Prescrição", "03_Bairro Local de Atendimento", "03_CNES",
        "03_UF Local de atendimento" ]
    default_field_label = [ "Telefone", "Endereço", "Data de Emissão", "Cidade", 
        "Nome do Paciente", "Nome Local de Atendimento", "Prescrição", "Bairro", "CNES", "UF" ]
    default_field_values = [ "+00 (00) 0000-0000", "Complexo Hospitalar", "00/00/0000",
        "Brasília", "Maria da Silva", "Clínica Local", "Dipirona ----------- 1 comprimido de 12 em 12 horas por 3 dias",
        "Bairro do Mar", "0000000", "DF" ]

    info = {
      Title: 'My title',
      Author: 'John Doe',
      Subject: 'My Subject',
      Keywords: 'test metadata ruby pdf dry',
      Creator: 'ACME Soft App',
      Producer: 'Prawn',
      CreationDate: Time.now,
      '2_16_76_1_12_1_1': '',
      '2_16_76_1_4_2_2_1': crm,
      '2_16_76_1_4_2_2_2': crm_uf,
      '2_16_76_1_4_2_2_3': '',
      '2_16_76_1_4_2_3_1': '',
      '2_16_76_1_4_2_3_1': '',
      '2_16_76_1_4_2_3_1': ''
    }

    @file_to_sign = generate_file_id('pdf')
    Prawn::Document.generate(get_data_path(@file_to_sign), info: info) do
      font('Helvetica', size: 20, style: :bold, align: :center) do
        text 'RECEITUÁRIO SIMPLES'
      end
      define_grid(columns: 5, rows: 8, gutter: 10)
      grid([1, 0], [7, 1]).bounding_box do
        text 'NOME DO(A) MÉDICO(A): '
        move_down 10
        text 'CRM: '
        move_down 10
        text 'CRM UF: '
        move_down 10
        default_field_label.each do |label|
          text "#{label}: "
          move_down 10
        end
      end
      grid([1, 3], [7, 4]).bounding_box do
        text nome_medico
        move_down 10
        text crm
        move_down 10
        text crm_uf
        move_down 10
        default_field_values.each do |value|
          text value
          move_down 10
        end
      end
    end
  end

  # POST /pades-signature-express/start
  #
  # This action receives the form submission from the signature page. It will
  # perform a PAdES signature in three steps using PKI Express and Web PKI.
  def start

    # Retrieve parameters
    @file_to_sign = params[:file_id]
    @cert_thumb = params[:cert_thumb]
    @cert_content = params[:cert_content]

    # Get instance of the PadesSignatureStarter class, responsible for receiving
    # the signature elements and start the signature process.
    signature_starter = PkiExpress::PadesSignatureStarter.new

    # Set PKI default options (see util.rb)
    set_pki_defaults(signature_starter)

    # Set signature policy.
    signature_starter.signature_policy = PkiExpress::StandardSignaturePolicies::PADES_BASIC_WITH_LTV

    # REQUIRED!
    # Use a custom signature field name. This field MUST have the 
    # "Emitente" keyword as the last keyword.
    signature_starter.custom_signature_field_name = 'Signature1 Emitente'
    signature_starter.certification_level = PkiExpress::PadesCertificationLevel::CERTIFIED_NO_CHANGES_ALLOWED

    # Set PDF to be signed.
    signature_starter.pdf_to_sign_path = get_data_path(@file_to_sign)

    # Set Base64-encoded certificate's content to signature starter.
    signature_starter.certificate_base64 = @cert_content

    # Set visual representation. We provide a class that represents the visual
    # representation model.
    signature_starter.visual_representation = get_visual_representation

    # Start the signature process. Receive as response a SignatureStartResult
    # instance containing the following fields:
    # - to_sign_hash: The hash to be signed.
    # - digest_algorithm_name: The digest algorithm's name that be used to
    # configure Web PKI component to compute the signature.
    # - digest_algorithm_oid: The digest algorithm's oid that be used to
    # configure Web PKI component to compute the signature.
    # - transfer_file_id: A temporary file's id to be passed to "complete" step.
    result = signature_starter.start

    @to_sign_hash = result.to_sign_hash
    @transfer_file_id = result.transfer_file_id
    @digest_algorithm = result.digest_algorithm_name
  end

  # POST /pades-signature-express/complete
  #
  # This action receives the form submission from the signature page. It will
  # perform a PAdES signature in three steps using PKI Express and Web PKI.
  def complete
    @file_to_sign = params[:file_id]
    @transfer_file_id = params[:transfer_file_id]
    signature = params[:signature]

    # Get an instance of the SignatureFinisher class, responsible for completing
    # the signature process.
    signature_finisher = PkiExpress::SignatureFinisher.new

    # Set PKI default options (see util.rb)
    set_pki_defaults(signature_finisher)

    # Set PDF to be signed. It's the same file we used on "start" step.
    signature_finisher.file_to_sign_path = get_data_path(@file_to_sign)

    # Set transfer file.
    signature_finisher.transfer_file_id = @transfer_file_id

    # Set the signature value.
    signature_finisher.signature = signature

    # Generate path for output file and add to signature finisher.
    signature_finisher.output_file_path = get_data_path(@file_to_sign)

    # Complete the signature process.
    @signer_cert = signature_finisher.complete

    @signed_pdf = @file_to_sign
  end
end