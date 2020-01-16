<?php

/**
 * This block will be executed only when it's on the "complete" step. In this sample, the state is set as "complete"
 * programmatically after the Web PKI component perform the signature and submit the form (see method sign() on
 * content/js/signature-form.js).
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\SignatureFinisher;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

try {


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
    $signatureFinisher->setFileToSign(StorageMock::getSampleDocPath(SampleDocs::SAMPLE_NFE));

    // Set transfer file.
    $signatureFinisher->setTransferFile($transferFileId);

    // Set the signature value.
    $signatureFinisher->setSignature($signature);

    // Generate path for output file and add to signature finisher.
    StorageMock::createAppData(); // make sure the "app-data" folder exists (util.php).
    $outputFile = uniqid() . ".xml";
    $signatureFinisher->setOutputFile(StorageMock::getDataPath($outputFile));

    // Complete the signature process.
    $signatureFinisher->complete();

} catch (Exception $ex) {
    // Save error information on session storage to be shown on error.php script.
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['script'] = 'xml-nfe-signature-express/complete.php';
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

    <h2 class="ls-title">Sign a Brazilian NFe stored on the server with PKI Express</h2>
    <h5 class="ls-subtitle">File signed successfully! <i class="fas fa-check-circle text-success"></i></h5>

    <div class="ls-content">
        <h3>Actions:</h3>
        <ul>
            <li><a href="/download?fileId=<?= $outputFile ?>">Download the signed file</a></li>
        </ul>
    </div>
</div>

<? include '../shared/scripts.php' ?>

</body>
</html>

