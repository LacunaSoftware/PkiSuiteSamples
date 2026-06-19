<?php
/**
 * This sample performs two signatures on the same XML document, one on each element,
 * according to the standard Certificación de Origen Digital (COD), from Asociación
 * Latinoamericana de Integración (ALADI). For more information, please see:
 *
 * - Spanish: http://www.aladi.org/nsfweb/Documentos/2327Rev2.pdf
 * - Portuguese: http://www.mdic.gov.br/images/REPOSITORIO/secex/deint/coreo/2014_09_19_-_Brasaladi_761_-_Documento_ALADI_SEC__di_2327__Rev_2_al_port_.pdf
 */

/**
 * This file receives the form submission from index.php. We'll call REST PKI to complete the
 * signature of the COD element.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\XmlSignatureFinisher;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

try {

    // Get the token for this signature (rendered in a hidden input field, see index.php).
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
    $_SESSION['script'] = 'xml-cod-signature-rest/complete.php';
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

    <h2 class="ls-title">COD XML signature (COD element) with REST PKI</h2>
    <h5 class="ls-subtitle">COD element signed successfully! <i class="fas fa-check-circle text-success"></i></h5>

    <div class="ls-content">
        <h3>Actions:</h3>
        <ul>
            <li><a href="/download?fileId=<?= $outputFile ?>">Download XML with signed COD element</a></li>
            <li><a href="/xml-cod-signature-rest/signCodeh.php?fileId=<?= $outputFile ?>">Sign CODEH element</a></li>
        </ul>
    </div>
</div>

<?php include '../shared/scripts.php' ?>

</body>
</html>
