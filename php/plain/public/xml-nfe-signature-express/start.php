<?php

/**
 * This block will be executed only when it's on the "start" step. In this sample, the state is set as "start"
 * programmatically after the user press the "Sign File" button (see method sign() on content/js/signature-form.js).
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\XmlSignatureStarter;
use Lacuna\PkiExpress\StandardSignaturePolicies;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

try {

    // Recover variables from the POST arguments to be used on this step.
    $certThumb = !empty($_POST['certThumb']) ? $_POST['certThumb'] : null;
    $certContent = !empty($_POST['certContent']) ? $_POST['certContent'] : null;

    // Get an instance of the XmlSignatureStarter class, responsible for receiving the signature elements and
    // start the signature process.
    $signatureStarter = new XmlSignatureStarter();

    // Set PKI default options (see Util.php).
    Util::setPkiDefaults($signatureStarter);

    // Set signature policy.
    $signatureStarter->signaturePolicy = StandardSignaturePolicies::NFE_PADRAO_NACIONAL;

    // Set the ID of the element to be signed.
    $signatureStarter->toSignElementId = 'NFe35141214314050000662550010001084271182362300';

    // Set the XML to be signed, a sample Brazilian fiscal invoice pre-generated.
    $signatureStarter->setXmlToSign(StorageMock::getSampleDocPath(SampleDocs::SAMPLE_NFE));

    // Set Base64-encoded certificate's content to signature starter.
    $signatureStarter->setCertificateBase64($certContent);

    // Start the signature process. Receive as response the following fields:
    // - $toSignHash: The hash to be signed.
    // - $digestAlgorithm: The digest algorithm that will inform the Web PKI component to compute the signature.
    // - $transferFile: A temporary file to be passed to "complete" step.
    $response = $signatureStarter->start();

    // Render the fields received from start() method as hidden fields to be used on the javascript or on the
    // "complete" step.
    $toSignHash = $response->toSignHash;
    $digestAlgorithm = $response->digestAlgorithm;
    $transferFileId = $response->transferFile;

} catch (Exception $ex) {
    // Save error information on session storage.
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['script'] = 'xml-nfe-signature-express/start.php';
    $_SESSION['message'] = $ex->getMessage();
    $_SESSION['trace'] = $ex->getTraceAsString();
    $_SESSION['status'] = 500;
    $_SESSION['error'] = 'Internal Server Error';
    header("Location: /error.php", true, 302);
    exit;
}


?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php' ?>
</head>
<body>

<?php include '../menu.php' ?>

<div class="container content">
    <div id="messagesPanel"></div>

    <h2 class="ls-title">Sign a Brazilian NFe stored on the server with PKI Express</h2>

    <form id="signForm" action="xml-nfe-signature-express/complete.php" method="POST">

        <?php
        // Hidden fields used to pass data from the server-side to the javascript and vice-versa.
        ?>
        <input type="hidden" id="certThumbField" name="certThumb" value="<?= $certThumb ?>">
        <input type="hidden" id="certContentField" name="certContent" value="<?= $certContent ?>">
        <input type="hidden" id="toSignHashField" name="toSignHash" value="<?= $toSignHash ?>">
        <input type="hidden" id="transferFileIdField" name="transferFileId" value="<?= $transferFileId ?>">
        <input type="hidden" id="digestAlgorithmField" name="digestAlgorithm" value="<?= $digestAlgorithm ?>">
        <input type="hidden" id="signatureField" name="signature">

        <a id="tryAgainButton" class="btn btn-primary" href="/xml-nfe-signature-express">Try Again</a>
    </form>
</div>

<?php include '../scripts.php' ?>

<?php
// The file below contains the JS lib for accessing the Web PKI component. For more
// information, see: https://webpki.lacunasoftware.com/#/Documentation
?>
<script type="text/javascript" src="https://get.webpkiplugin.com/Scripts/LacunaWebPKI/lacuna-web-pki-2.12.0.min.js"
        integrity="sha256-jDF8LDaAvViVZ7JJAdzDVGgY2BhjOUQ9py+av84PVFA="
        crossorigin="anonymous"></script>

<?php
// The file below contains the logic for calling the Web PKI component. It is only an example, feel,
// free to alter it to meet your application's needs. You can also bring the code into the
// javascript block below if you prefer.
?>
<script src="scripts/signature-complete-form.js"></script>

<script>
    $(document).ready(function () {
        // Once the page is ready, we call the init() function on the javascript code
        // (see signature-complete-form.js).
        signatureCompleteForm.init({
            form: $('#signForm'),                             // The form that should be submitted when the operation is complete.
            certThumbField: $('#certThumbField'),             // The "certThumb" field.
            toSignHashField: $('#toSignHashField'),           // The "toSignHash" field.
            digestAlgorithmField: $('#digestAlgorithmField'), // The "digestAlgorithm" field.
            signatureField: $('#signatureField')              // The "signature" field.
        });
    });
</script>

</body>
</html>


