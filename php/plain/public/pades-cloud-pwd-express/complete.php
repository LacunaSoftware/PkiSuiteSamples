<?php

/**
 * This action is called after the form after the user press the button "Sign". This action will
 * receive the user's CPF and current password.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\StandardSignaturePolicies;
use Lacuna\PkiExpress\PadesSigner;
use Lacuna\PkiExpress\TrustServicesManager;
use Lacuna\PkiExpress\TrustServiceSessionTypes;

try{
    // Only accepts POST requests.
    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
    }

    // Get URL parameter "fileId"
    $fileId = $_GET['fileId'];

    // Retrieve input values from submitted form.
    $cpf = $_POST['cpf'];
    $service = $_POST['service'];
    $password = $_POST['password'];

    // Process cpf, removing all formatting.
    $plainCpf = str_replace([".","-"], "", $cpf);

    // Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
    // and handling the password flow.
    $manager = new TrustServicesManager();

    // Complete authentication using CPF and current password. The following method has three
    // sessionTypes:
    // - SINGLE_SIGNATURE: The returned token can only be used for one single signature request.
    // - MULTI_SIGNATURE: The returned token can only be used for one multi signature request.
    // - SIGNATURE_SESSION: The return token can only be used for one or more signature requests.
    $result = $manager->passwordAuthorize($service, $plainCpf, $password, TrustServiceSessionTypes::SIGNATURE_SESSION);

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

        <h2 class="ls-title">PAdES Signature using cloud certificate with PKI Express (Password Flow)</h2>
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