<?php

/*
 * This file generates the Receita Simples file and it initiates a PAdES signature 
 * using REST PKI and renders the signature page. The form is posted to another 
 * file, receita-simples-rest.php/complete, which calls REST PKI again to complete
 * the signature.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\PadesSignatureStarter;
use Lacuna\RestPki\StandardSignaturePolicies;
use Lacuna\RestPki\PadesMeasurementUnits;
use Lacuna\RestPki\PadesCertificationLevels;

try {
    // Only accepts GET requests.
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

    /* Generate File */

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
    $pdf->ComboBox(FieldName::CRM_UF, 100, 7, $ufs, array('value'=> $crmUf));
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

    // Add QR Code - optional
    // To run this sample with QR Code, we recommend using ngrok to simulate public URL
    $qrCode = '<YOUR PUBLIC URL>/receita-simples-rest/iti-validation';
    if ($qrCode != null){
        $style = array(
            'border' => 2,
            'vpadding' => 'auto',
            'hpadding' => 'auto',
            'fgcolor' => array(0,0,0),
            'bgcolor' => false, //array(255,255,255)
            'module_width' => 1, // width of a single module in points
            'module_height' => 1 // height of a single module in points
        );
        $pdf->write2DBarcode($qrCode, 'QRCODE,H', 137, 210, 50, 50, $style, 'N');
        $pdf->Text(135, 260, 'Use o QR Code acima para ');
        $pdf->Text(135, 265, 'validar o documento em');
        $pdf->Text(135, 270, 'https://assinaturadigital.iti.gov.br/');
    }

    //Close and output PDF document
    $pdf->Output($filePath, 'F');

    /* Start Signature */

    $client = Util::getRestPkiClient();

    // Instantiate the PadesSignatureStarter class, responsible for receiving the signature elements and
    // start the signature process.
    $signatureStarter = new PadesSignatureStarter($client);

    // REQUIRED!
    // Use a policy accepted by ICP-Brasil.
    $signatureStarter->signaturePolicy = StandardSignaturePolicies::PADES_BASIC_WITHOUT_LTV;

    // Set the security context. We have encapsulated the security context choice on util.php.
    $signatureStarter->securityContext = Util::getSecurityContextId();

    // Set the unit of measurement used to edit the pdf marks and visual representations.
    $signatureStarter->measurementUnits = PadesMeasurementUnits::CENTIMETERS;

    // REQUIRED!
    // Use a custom signature field name. This field MUST have the 
    // "Emitente" keyword as the last keyword.
    $signatureStarter->customSignatureFieldName = "Signature1 Emitente";

    // REQUIRED!
    // Set Certification Level to not allow changes after signed.
    $signatureStarter->certificationLevel = PadesCertificationLevels::CERTIFIED_NO_CHANGES_ALLOWED;

    // Set the visual representation to the signature. We have encapsulated this code (on util-pades.php) to be used on
    // various PAdES examples.
    $signatureStarter->visualRepresentation = PadesVisualElementsRest::getVisualRepresentation();

    // Set the PDF to be signed.
    $signatureStarter->setPdfToSignFromPath(StorageMock::getDataPath($fileId));

    // Call the startWithWebPki() method, which initiates the signature.
    $token = $signatureStarter->startWithWebPki();

    // The token acquired above can only be used for a single signature attempt. In order to retry the signature it is
    // necessary to get a new token. This can be a problem if the user uses the back button of the browser, since the
    // browser might show a cached page that we rendered previously, with a now stale token. To prevent this from happening,
    // we call the function setExpiredPage(), located in util.php, which sets HTTP headers to prevent caching of the page.
    Util::setExpiredPage();

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

        <h2 class="ls-title">Receita Simples with REST PKI</h2>

        <div class="ls-content">
        <?php // Notice that we'll post to a different PHP file. ?>
            <form id="signForm" action="receita-simples-rest/complete.php" method="POST">

            <?php // Render the $token in a hidden input field. ?>
                <input type="hidden" name="token" value="<?= $token ?>">

                <div class="form-group">
                    <label>File to sign</label>
                    <p>You are signing <a href='/download?fileId=<?= $fileId ?>'>this document</a>.</p>
                </div>

            <?php
            // Render a select (combo box) to list the user's certificates. For now it will be empty,
            // we'll populate it later on (see signature-form.js).
            ?>
                <div class="form-group">
                    <label for="certificateSelect">Choose a certificate</label>
                    <select id="certificateSelect" class="form-control"></select>
                </div>

            <?php
            // Action buttons. Notice that the "Sign File" button is NOT a submit button. When the user
            // clicks the button, we must first use the Web PKI component to perform the client-side
            // computation necessary and only when that computation is finished we'll submit the form
            // programmatically (see signature-form.js).
            ?>
                <div class="form-group">
                    <button id="signButton" type="button" class="btn btn-primary">Sign File</button>
                    <button id="refreshButton" type="button" class="btn btn-outline-primary">Refresh Certificates</button>
                </div>

            </form>
        </div>

    </div>

    <?php include '../shared/scripts.php' ?>

    <?php
    // The file below contains the JS lib for accessing the Web PKI component. For more
    // information, see: https://webpki.lacunasoftware.com/#/Documentation
    ?>
    <script type="text/javascript" src="https://cdn.lacunasoftware.com/libs/web-pki/lacuna-web-pki-2.14.0.min.js"
            integrity="sha256-m0Wlj4Pp61wsYSB4ROM/W5RMnDyTpqXTJCOYPBNm300="
            crossorigin="anonymous"></script>

    <?php
    // The file below contains the logic for calling the Web PKI component. It is only an example, feel,
    // free to alter it to meet your application's needs. You can also bring the code into the
    // javascript block below if you prefer.
    ?>
    <script src="../scripts/signature-form.js"></script>
    <script>
        $(document).ready(function () {
            // Once the page is ready, we call the init() function on the javascript code
            // (see signature-form.js).
            signatureForm.init({
                token: '<?= $token ?>',                     // The token acquired from REST PKI.
                form: $('#signForm'),                       // The form that should be submitted when the operation is complete.
                certificateSelect: $('#certificateSelect'), // The <select> element (combo box) to list the certificates.
                refreshButton: $('#refreshButton'),         // The "refresh" button.
                signButton: $('#signButton')                // The button that initiates the operation.
            });
        });
    </script>

    </body>
    </html>

<?php
    } catch (Exception $e) {
        include '../shared/catch-error.php';
    }
?>