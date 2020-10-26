<?php
/**
 * This sample performs two signatures on the same XML document, one on each element,
 * according to the standard Certificación de Origen Digital (COD), from Asociación 
 * Latinoamericana de Integración (ALADI). For more information, please see:
 * 
 * - Spanish: http://www.aladi.org/nsfweb/Documentos/2327Rev2.pdf
 * - Portuguese: http://www.mdic.gov.br/images/REPOSITORIO/secex/deint/coreo/2014_09_19_-_Brasaladi_761_-_Documento_ALADI_SEC__di_2327__Rev_2_al_port_.pdf
 */

require __DIR__ . '/../../vendor/autoload.php';

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get URL parameter "fileId"
$xmlToSign = !empty($_GET['fileId']) ? $_GET['fileId'] : null;

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
    <h2 class="ls-title">COD XML signature (CODEH element) with PKI Express</h2>
    <div class="ls-content">
        <form id="signForm" action="xml-cod-signature-express/signCodehStart.php?fileId=<?= $xmlToSign ?>" method="POST">
            <?php
            // Hidden fields used to pass data from the server-side to the javascript and vice-versa.
            ?>
            <input type="hidden" id="certThumbField" name="certThumb">
            <input type="hidden" id="certContentField" name="certContent">
            <div class="form-group">
                <label>File to sign</label>
                <p>You are signing the <b>CODEH</b> element of <a href='/download?fileId=<?= $xmlToSign ?>'>this XML envelope</a>.</p>
            </div>

            <?php
            // Render a select (combo box) to list the user's certificates. For now it will be empty,
            // we'll populate it later on (see signature-start-form.js).
            ?>
            <div class="form-group">
                <label for="certificateSelect">Choose a certificate</label>
                <select id="certificateSelect" class="custom-select"></select>
            </div>

            <?php
            // Action buttons. Notice that the "Sign COD element" button is NOT a submit button. When the user
            // clicks the button, we must first use the Web PKI component to perform the client-side
            // computation necessary and only when that computation is finished we'll submit the form
            // programmatically (see signature-start-form.js).
            ?>

    <button id="signButton" type="button" class="btn btn-primary">Sign CODEH element</button>
    <button id="refreshButton" type="button" class="btn btn-outline-primary">Refresh Certificates</button>

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
<script src="../scripts/signature-start-form.js"></script>

<script>
$(document).ready(function () {
// Once the page is ready, we call the init() function on the javascript code
// (see signature-start-form.js).
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