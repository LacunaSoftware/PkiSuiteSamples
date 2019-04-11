<?php

/**
 * This block will be executed only when it's on the "complete" step. In this sample, the state is
 * set as "complete" programmatically after the Web PKI component perform the signature and submit
 * the form (see method sign() on content/js/signature-form.js).
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\SignatureFinisher;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get URL parameter "fileId"
$fileToSign = !empty($_GET['fileId']) ? $_GET['fileId'] : null;

// Recover variables from the POST arguments to be used on this step.
$certThumb = !empty($_POST['certThumb']) ? $_POST['certThumb'] : null;
$toSignHash = !empty($_POST['toSignHash']) ? $_POST['toSignHash'] : null;
$transferFile = !empty($_POST['transferFileId']) ? $_POST['transferFileId'] : null;
$digestAlgorithm = !empty($_POST['digestAlgorithm']) ? $_POST['digestAlgorithm'] : null;
$signature = !empty($_POST['signature']) ? $_POST['signature'] : null;

// Get an instance of the SignatureFinisher class, responsible for completing the signature process.
$signatureFinisher = new SignatureFinisher();

// Set PKI default options (see Util.php).
Util::setPkiDefaults($signatureFinisher);

// Set file to be signed. It's the same file we used on "start" step.
$signatureFinisher->setFileToSign(StorageMock::getDataPath($fileToSign));

// Set transfer file.
$signatureFinisher->setTransferFile($transferFile);

// Set the signature value.
$signatureFinisher->setSignature($signature);

// Generate path for output file and add to signature finisher.
StorageMock::createAppData(); // make sure the "app-data" folder exists (util.php)
$outputFile = uniqid() . ".p7s";
$signatureFinisher->setOutputFile(StorageMock::getDataPath($outputFile));

// Complete the signature process.
$signatureFinisher->complete();

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

    <h2 class="ls-title">CAdES Signature with PKI Express</h2>

    <p>File signed successfully!</p>

    <h3>Actions:</h3>
    <ul>
        <li><a href="/download?fileId=<?= $outputFile ?>">Download the signed file</a></li>
        <li><a href="/cades-signature-express?fileId=<?= $outputFile ?>">Co-sign with another certificate</a></li>
    </ul>
</div>

<? include '../scripts.php' ?>

</body>
</html>
