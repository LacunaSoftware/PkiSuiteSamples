<?php

/**
 * This file perform a local CAdES signature in one step using PKI Express.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\StandardSignaturePolicies;
use Lacuna\PkiExpress\CadesSigner;

try {
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

    // Get an instance of the CadesSigner class, responsible for receiving the
    // signature elements and performing the local signature.
    $signer = new CadesSigner();

    // Set PKI default options (see Util.php).
    Util::setPkiDefaults($signer);

    // Set signature policy.
    $signer->signaturePolicy = StandardSignaturePolicies::PKI_BRAZIL_CADES_ADR_BASICA;

    // Set file to be signed. If the file is a CMS, the PKI Express will recognize
    // that and will co-sign that file.
    $signer->setFileToSign(StorageMock::getDataPath($fileToSign));

    // The PKCS #12 certificate path.
    $signer->setPkcs12(StorageMock::getSampleCertificatePath());
    // Set the certificate's PIN.
    $signer->setCertPassword("1234");

    // Set 'encapsulate content' option (default: true).
    $signer->encapsulateContent = true;

    // Generate path for output file and add to signer object.
    $outputFile = StorageMock::generateFileId('p7s');
    $signer->setOutputFile(StorageMock::getDataPath($outputFile));

    // Perform the signature.
    $signer->sign();

    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <?php include '../shared/head.php' ?>
    </head>
    <body>

    <?php include '../shared/menu.php' ?>


    <div class="container content">
        <div id="messagePanel"></div>

        <h2 class="ls-title">CAdES Signature using a server key with PKI Express</h2>
        <h5 class="ls-subtitle">File signed successfully! <i class="fas fa-check-circle text-success"></i></h5>

        <div class="ls-content">
            <h3>Actions:</h3>
            <ul>
                <li><a href="/download?fileId=<?= $outputFile ?>">Download the signed file</a></li>
                <li><a href="/open-cades-express?fileId=<?= $outputFile ?>">Open/validate the signed file</a></li>
                <li><a href="/cades-signature-express?fileId=<?= $outputFile ?>">Co-sign with another certificate</a></li>
            </ul>
        </div>
    </div>

    <? include '../shared/scripts.php' ?>

    </body>
    </html>

<?php
    } catch (Exception $e) {
        include '../shared/catch-error.php';
    }
?>