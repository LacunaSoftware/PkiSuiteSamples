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
 * This file is called once the "to-sign-hash" is signed using the user's certificate. After signature,
 * we'll redirect the user to the SignCodResult file to show the signed file.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\SignatureFinisher;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}
try {

    // Get URL parameter "fileId"
    $xmlToSign = !empty($_GET['fileId']) ? $_GET['fileId'] : null;

    // Recover variables from the POST arguments to be used on this step.
    $certThumb = !empty($_POST['certThumb']) ? $_POST['certThumb'] : null;
    $toSignHash = !empty($_POST['toSignHash']) ? $_POST['toSignHash'] : null;
    $transferFileId = !empty($_POST['transferFileId']) ? $_POST['transferFileId'] : null;
    $digestAlgorithm = !empty($_POST['digestAlgorithm']) ? $_POST['digestAlgorithm'] : null;
    $signature = !empty($_POST['signature']) ? $_POST['signature'] : null;

    // Get an instance of the SignatureFinisher class, responsible for completing the signature process.
    $signatureFinisher = new SignatureFinisher();

    // Set PKI default options (see Util.php).
    Util::setPkiDefaults($signatureFinisher);

    // Set the XML to be signed. It's the same we used on "start" step.
    $signatureFinisher->setFileToSign(StorageMock::getDataPath($xmlToSign));

    // Set transfer file.
    $signatureFinisher->setTransferFile($transferFileId);

    // Set the signature value.
    $signatureFinisher->setSignature($signature);

    // Generate path for output file and add to signature finisher.
    $outputFile = StorageMock::generateFileId('xml');
    $signatureFinisher->setOutputFile(StorageMock::getDataPath($outputFile));

    // Complete the signature process.
    $signatureFinisher->complete();

} catch (Exception $ex) {
    // Save error information on session storage to be shown on error.php script.
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['script'] = 'xml-cod-signature-express/signatureInfo.php';
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
    <?php include '../shared/head.php' ?>
</head>
<body>

<?php include '../shared/menu.php' ?>

<div class="container content">
    <div id="messagesPanel"></div>
    <h2 class="ls-title">COD XML signature (CODEH element) with PKI Express</h2>
    <h5 class="ls-subtitle">CODEH element signed successfully! <i class="fas fa-check-circle text-success"></i></h5>

<div class="ls-content">
    <h3>Actions:</h3>
    <ul>
        <li><a href="/download?fileId=<?= $outputFile ?>">Download XML with signed COD and CODEH elements</a></li>
    </ul>
</div>
</div>

<? include '../shared/scripts.php' ?>

</body>
</html>