<?php

/**
 * This file perform a local PAdES signature in one step using PKI Express.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\StandardSignaturePolicies;
use Lacuna\PkiExpress\PadesSigner;

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Verify if the fileId correspond to an existing file on our StorageMock class.
$fileToSign = isset($_GET['fileId']) ? $_GET['fileId'] : null;
if (!StorageMock::exists($fileToSign)) {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get an instance of the PadesSigner class, responsible for receiving the
// signature elements and performing the local signature.
$signer = new PadesSigner();

// Set PKI default options. (see Util.php)
Util::setPkiDefaults($signer);

// Set signature policy.
$signer->signaturePolicy = StandardSignaturePolicies::PADES_BASIC_WITH_LTV;

// Set PDF to be signed.
$signer->setPdfToSign(StorageMock::getDataPath($fileToSign));

// The PKCS #12 certificate path.
$signer->setPkcs12(StorageMock::getSampleCertificatePath());
// Set the certificate's PIN.
$signer->setCertPassword("1234");

// Set a file reference for the stamp file. Note that this file can be
// referenced later by "fref://stamp" at the "url" field on the visual
// representation (see content/vr.json file or getVisualRepresentation($case)
// method).
$signer->addFileReference('stamp', StorageMock::getPdfStampPath());

// Set visual representation. We provide a PHP class that represents the visual
// representation model.
$signer->setVisualRepresentation(PadesVisualElementsExpress::getVisualRepresentation());

// Generate path for output file and add to signer object.
$outputFile = StorageMock::generateFileId('pdf');
$signer->setOutputFile(StorageMock::getDataPath($outputFile));

// Perform the signature.
$signer->sign();

?><!DOCTYPE html>
<html>
<head>
    <?php include '../shared/head.php' ?>
</head>
<body>

<?php include '../shared/menu.php' ?>


<div class="container content">
    <div id="messagePanel"></div>

    <h2 class="ls-title">PAdES Signature using a server key with PKI Express</h2>
    <h5 class="ls-subtitle">File signed successfully! <i class="fas fa-check-circle text-success"></i></h5>

    <div class="ls-content">
        <h3>Actions:</h3>
        <ul>
            <li><a href="/download?fileId=<?= $outputFile ?>">Download the signed file</a></li>
            <li><a href="/pades-signature-express?fileId=<?= $outputFile ?>">Co-sign with another certificate</a></li>
        </ul>
    </div>
</div>

<? include '../shared/scripts.php' ?>

</body>
</html>