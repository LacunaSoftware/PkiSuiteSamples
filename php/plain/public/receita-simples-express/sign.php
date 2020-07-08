<?php

/**
 * This file generates the Receita Simples file and it performs a PAdES 
 * signature in three steps using PKI Express and Web PKI.
 */
require __DIR__ . '/../../vendor/autoload.php';

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

$nomeMedico = !empty($_POST['name']) ? $_POST['name'] : null;
$crm = !empty($_POST['crm']) ? $_POST['crm'] : null;
$crmUf = !empty($_POST['crmUf']) ? $_POST['crmUf'] : null;

$ufs = array('AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 
'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO');

$defaultFieldName = array( "03_Telefone Local de Atendimento", "03_Endereço Local de Atendimento",
    "03_Data Emissão_af_date", "03_Cidade Local de Atendimento", "01_Nome do Paciente",
    "03_Nome Local de Atendimento", "02_Prescrição", "03_Bairro Local de Atendimento", "03_CNES",
    "03_UF Local de atendimento" );
$defaultFieldLabel = array( "Telefone", "Endereço", "Data de Emissão", "Cidade", 
    "Nome do Paciente", "Nome Local de Atendimento", "Prescrição", "Bairro", "CNES", "UF" );
$defaultFieldValues = array( "+00 (00) 0000-0000", "Complexo Hospitalar", "00/00/0000",
    "Brasília", "Maria da Silva", "Clínica Local", "Dipirona ----------- 1 comprimido de 12 em 12 horas por 3 dias",
    "Bairro do Mar", "0000000", "DF" );

// Guarantees tha the 'app-data' folder exists.
StorageMock::createAppData();

$fileId = StorageMock::generateFilename(".pdf", null) . ".pdf";
$filePath = StorageMock::APP_DATA_PATH . $fileId;

// create new PDF document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
// remove default header/footer
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
// set font
$pdf->SetFont('helvetica', '', 10, '', false);
// add a page
$pdf->AddPage();
// ---------------------------------------------------------
// set default form properties
$pdf->setFormDefaultProp(array(
    'lineWidth'=>1,
    'borderStyle'=>'solid',
    'fillColor'=>array(255, 255, 200), 
    'strokeColor'=>array(255, 128, 128)));

// Add form field

// Field "Tipo de Documento". This text field identifies the type of
// document is being generated. It's a hidden field because this type
// is identified by the field name and NOT by the value of this field.
$pdf->TextField(DocumentType::PRESCRICAO_MEDICAMENTO, 0, 0, array(
    'hidden' => 'true',
    'readonly' => 'true',
    'value'=>''));

$pdf->SetFont('helvetica', 'BI', 20);
$pdf->Cell(0, 5, 'RECEITUÁRIO SIMPLES', 0, 1, 'C');
$pdf->Ln(10);

$pdf->SetFont('helvetica', '', 12);

// Add Field - Nome Completo Emitente
$pdf->Cell(55, 7, 'NOME DO(A) MÉDICO(A):');
$pdf->TextField('03_Nome Completo Emitente', 100, 7, array(
    'readonly' => 'true',
    'value'=> $nomeMedico));
$pdf->Ln(8);

// Add Field - CRM
$pdf->Cell(55, 7, 'CRM:');
$pdf->TextField(FieldName::CRM, 100, 7, array(
    'readonly' => 'true',
    'value'=> $crm));
$pdf->Ln(8);

// Add Field - CRM UF
$pdf->Cell(55, 7, 'CRM UF:');
$pdf->ComboBox(FieldName::CRM_UF, 100, 7, $ufs, array('value'=> $crmUF));
$pdf->Ln(8);

// Add other fields
$length = count($defaultFieldLabel);
for ($i=0; $i < $length ; $i++) { 
    $pdf->Cell(55, 7, $defaultFieldLabel[$i]);
    $pdf->TextField($defaultFieldName[$i], 140, 7, array(
        'readonly' => 'true',
        'value'=> $defaultFieldValues[$i]));
    $pdf->Ln(8);
}

//Close and output PDF document
$pdf->Output($filePath, 'F');

?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../shared/head.php' ?>
</head>
<body>

<?php include '../shared/menu.php' ?>

<div class="container content">
    <div id="messagesPanel"></div>

    <h2 class="ls-title">Receita Simples with PKI Express</h2>

    <div class="ls-content">
        <form id="signForm" action="receita-simples-express/start.php?fileId=<?= $fileId ?>" method="POST">

            <?php
            // Hidden fields used to pass data from the server-side to the
            // javascript and vice-versa.
            ?>
            <input type="hidden" id="certThumbField" name="certThumb">
            <input type="hidden" id="certContentField" name="certContent">

            <div class="form-group">
                <label>File to sign</label>
                <p>You are signing <a href='/download?fileId=<?= $fileId ?>'>this document</a>.</p>
            </div>

            <?php
            // Render a select (combo box) to list the user's certificates. For now
            // it will be empty, we'll populate it later on (see
            // signature-start-form.js).
            ?>
            <div class="form-group">
                <label for="certificateSelect">Choose a certificate</label>
                <select id="certificateSelect" class="form-control"></select>
            </div>

            <?php
            // Action buttons. Notice that the "Sign File" button is NOT a submit button. When the user
            // clicks the button, we must first use the Web PKI component to perform the client-side
            // computation necessary and only when that computation is finished we'll submit the form
            // programmatically (see signature-start-form.js).
            ?>
            <button id="signButton" type="button" class="btn btn-primary">Sign File</button>
            <button id="refreshButton" type="button" class="btn btn-outline-primary">Refresh Certificates</button>
        </form>
    </div>
</div>

<?php include '../shared/scripts.php' ?>

<?php
// The file below contains the JS lib for accessing the Web PKI component. For
// more information, see: https://webpki.lacunasoftware.com/#/Documentation
?>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/libs/web-pki/lacuna-web-pki-2.14.0.min.js"
        integrity="sha256-m0Wlj4Pp61wsYSB4ROM/W5RMnDyTpqXTJCOYPBNm300="
        crossorigin="anonymous"></script>

<?php
// The file below contains the logic for calling the Web PKI component. It is
// only an example, feel, free to alter it to meet your application's needs. You
// can also bring the code into the javascript block below if you prefer.
?>
<script src="../scripts/signature-start-form.js"></script>

<script>
    $(document).ready(function () {
        // Once the page is ready, we call the init() function on the javascript
        // code (see signature-start-form.js).
        signatureStartForm.init({
            form: $('#signForm'),                       // The form that should be submitted when the operation is complete.
            certificateSelect: $('#certificateSelect'), // The <select> element (combo box) to list the certificates.
            refreshButton: $('#refreshButton'),         // The "refresh" button.
            signButton: $('#signButton'),               // The button that initiates the operation.
            certThumbField: $('#certThumbField'),       // The "certThumb" field.
            certContentField: $('#certContentField')    // The "certContent" field.
        });
    });
</script>

</body>
</html>
