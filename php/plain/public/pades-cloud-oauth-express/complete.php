<?php

/**
 * This action will complete the authentication process and create a signature using a session
 * token returned by user. Also, we recover the parameter "customState" containing the id of the
 * file that will be signed.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\StandardSignaturePolicies;
use Lacuna\PkiExpress\PadesSigner;
use Lacuna\PkiExpress\TrustServicesManager;
use Lacuna\PkiExpress\TrustServiceSessionTypes;

try{
    // Only accepts POST requests.
    if ($_SERVER['REQUEST_METHOD'] != 'GET') {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
    }

    // Get URL parameters
    $authorizationCode = $_GET['code'];
    $state = $_GET['state'];

    // Process cpf, removing all formatting.
    $plainCpf = str_replace([".","-"], "", $cpf);

    // Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
    // and handling the OAuth flow.
    $manager = new TrustServicesManager();

    // Complete the authentication process, recovering the session info to be used on the
    // signature and the custom state (fileId).
    $result = $manager->completeAuth($authorizationCode, $state);

    // Recover file to be signed on custom state parameter.
    $fileId = $result->customState;

    // Get an instance of the PadesSigner class, responsible for receiving the
    // signature elements and performing the local signature.
    $signer = new PadesSigner();

    // Set PKI default options. (see Util.php)
    Util::setPkiDefaults($signer);

    // Set signature policy.
    $signer->signaturePolicy = StandardSignaturePolicies::PADES_BASIC_WITH_LTV;

    // Set PDF to be signed.
    $signer->setPdfToSign(StorageMock::getDataPath($fileId));

    // Set trust session acquired on the following steps of this sample.
    $signer->setTrustServiceSession($result->session);

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

        <h2 class="ls-title">PAdES Signature using cloud certificate with PKI Express (OAuth Flow)</h2>
        <h5 class="ls-subtitle">File signed successfully! <i class="fas fa-check-circle text-success"></i></h5>

        <div class="ls-content">
            <h3>Actions:</h3>
            <ul>
                <li><a href="/download?fileId=<?= $outputFile ?>">Download the signed file</a></li>
                <li><a href="/open-pades-express?fileId=<?= $outputFile ?>">Open/validate the signed file</a></li>
                <li><a href="/pades-signature-express?fileId=<?= $outputFile ?>">Co-sign with another certificate</a></li>
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