<?php

/**
 * This file perform a local PAdES signature in one step using PKI Express.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\StandardSignaturePolicies;
use Lacuna\PkiExpress\PadesSigner;
use Lacuna\PkiExpress\Pkcs12Generator;

function generatePkcs12($certId, $password)
{
    // Get an instance of the Pkcs12Generator class, responsible for
    // generate a PKCS #12 from a generated key and certificate file. This
    // certificate will be used to sign the uploaded PDF.
    $keyJson = StorageMock::read($certId . ".json");
    $pkcs12Generator = new Pkcs12Generator();
    $pkcs12Generator->key = $keyJson;

    // Set PKI default options. (see Util.php)
    Util::setPkiDefaults($pkcs12Generator);

    // Set the certificate file.
    $pkcs12Generator->setCertFile(StorageMock::getKeyPath($certId, ".cer"));

    // Generate PKCS #12 file using the default password.
    return $pkcs12Generator->generate($password);
}

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

    // Verify if the certId is passed. Provided by issue-cert-server example.
    $certId = isset($_GET['certId']) ? $_GET['certId'] : null;

    // Get an instance of the PadesSigner class, responsible for receiving the
    // signature elements and performing the local signature.
    $signer = new PadesSigner();

    // Set PKI default options. (see Util.php)
    Util::setPkiDefaults($signer);

    // Set signature policy.
    $signer->signaturePolicy = StandardSignaturePolicies::PADES_BASIC_WITH_LTV;

    // Set PDF to be signed.
    $signer->setPdfToSign(StorageMock::getDataPath($fileToSign));

    // Set the PKCS #12 certificate path. We have an logic for choosing the generate the PKCS #12
    // from "issue certificate" samples or a sample PKCS #12.
    if (isset($certId)) {

        // Verify if the files provided by "certId" parameters exists.
        if (!StorageMock::exists($certId .".json") || !StorageMock::exists($certId . ".cer")) {
            header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
            die();
        }

        // Use a default password configured on config.php.
        $defaultPassword = getConfig()['pkiExpress']['pkcs12Password'];

        // Generate PKCS #12. We have encapsulated this operation on generatePkcs12() method.
        $pkcs12GenResult = generatePkcs12($certId, $defaultPassword);

        // Set the generated PKCS #12 and its password on PadesSigner instance.
        $signer->setPkcs12Content($pkcs12GenResult->pfx->getContentRaw());
        $signer->setCertPassword($defaultPassword);


    } else {
        // The PKCS #12 certificate path.
        $signer->setPkcs12(StorageMock::getSampleCertificatePath());
        // Set the certificate's PIN.
        $signer->setCertPassword("1234");
    }

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