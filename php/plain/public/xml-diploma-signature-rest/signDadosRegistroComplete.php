<?php
/**
 * This sample performs the three signatures required on a Brazilian digital diploma XML. See
 * index.php for an overview.
 */

/**
 * This file receives the form submission from signDadosRegistro.php. We'll call REST PKI to
 * complete the signature of the DadosRegistro element.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\XmlSignatureFinisher;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

try {

    // Get the token for this signature (rendered in a hidden input field, see
    // signDadosRegistro.php).
    $token = $_POST['token'];

    // Instantiate the XmlSignatureFinisher class, responsible for completing the signature process.
    $signatureFinisher = new XmlSignatureFinisher(Util::getRestPkiClient());

    // Set the token.
    $signatureFinisher->token = $token;

    // Call the finish() method, which finalizes the signature process and returns the signed XML.
    $signedXml = $signatureFinisher->finish();

    // At this point, you'd typically store the signed XML on your database. For demonstration
    // purposes, we'll store the XML on a temporary folder publicly accessible and render a link.
    $outputFile = StorageMock::store($signedXml, 'xml');

} catch (Exception $ex) {
    // Save error information on session storage.
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['script'] = 'xml-diploma-signature-rest/signDadosRegistroComplete.php';
    $_SESSION['message'] = $ex->getMessage();
    $_SESSION['trace'] = $ex->getTraceAsString();
    $_SESSION['status'] = 500;
    $_SESSION['error'] = 'Internal Server Error';
    header("Location: /error.php", true, 302);
    exit;
}

?><!DOCTYPE html>
<html>
<head>
    <?php include '../shared/head.php' ?>
</head>
<body>

<?php include '../shared/menu.php' ?>

<div class="container content">
    <div id="messagesPanel"></div>

    <h2 class="ls-title">XML Diploma Signature with REST PKI</h2>
    <h5 class="ls-subtitle">Element <i>DadosRegistro</i> signed successfully! <i class="fas fa-check-circle text-success"></i></h5>

    <div class="ls-content">
        <h3>Actions:</h3>
        <ul>
            <li><a href="/download?fileId=<?= $outputFile ?>">Download the signed file</a></li>
            <li><a href="/xml-diploma-signature-rest/signDiploma.php?fileId=<?= $outputFile ?>">Last step of signature process (sign the whole diploma)</a></li>
        </ul>
    </div>
</div>

<?php include '../shared/scripts.php' ?>

</body>
</html>
