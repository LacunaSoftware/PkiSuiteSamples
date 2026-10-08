<?php

/**
 * This file performs a PAdES signature using REST PKI and a PKCS #12 file located on the server-side.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\PadesSignatureStarter;
use Lacuna\RestPki\PadesSignatureFinisher2;
use Lacuna\RestPki\StandardSignaturePolicies;
use Lacuna\RestPki\PadesMeasurementUnits;

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

    // Read the PKCS #12 file. We use a copy of the sample certificate encrypted with AES-256, since
    // the original one uses a legacy algorithm which is not supported by default on OpenSSL 3.
    $pkcs12Content = file_get_contents(StorageMock::getSampleCertificateAesPath());
    if ($pkcs12Content === false) {
        throw new \Exception('Unable to read the PKCS #12 file');
    }

    // Open the PKCS #12 file using the certificate's PIN, obtaining the signer certificate and its
    // private key.
    if (!openssl_pkcs12_read($pkcs12Content, $pkcs12, '1234')) {
        throw new \Exception('Unable to open the PKCS #12 file: ' . openssl_error_string());
    }

    // 1. Start the signature with REST PKI

    // Instantiate the PadesSignatureStarter class, responsible for receiving the signature elements and
    // start the signature process.
    $signatureStarter = new PadesSignatureStarter(Util::getRestPkiClient());

    // Set the PDF to be signed.
    $signatureStarter->setPdfToSignFromPath(StorageMock::getDataPath($fileToSign));

    // Set the signer certificate. The certificate returned by openssl_pkcs12_read() is PEM-encoded, so
    // we remove the PEM header and footer to obtain its base64-encoded DER contents.
    $signatureStarter->setSignerCertificateBase64(preg_replace('/-----[A-Z ]+-----|\s+/', '', $pkcs12['cert']));

    // Set the signature policy.
    $signatureStarter->signaturePolicy = StandardSignaturePolicies::PADES_BASIC;

    // Set the security context. We have encapsulated the security context choice on Util.php. Notice
    // that the sample certificate "Pierre de Fermat" is only accepted if the Lacuna Test PKI is
    // trusted (see "trustLacunaTestRoot" on config.php).
    $signatureStarter->securityContext = Util::getSecurityContextId();

    // Set the unit of measurement used to edit the pdf marks and visual representations.
    $signatureStarter->measurementUnits = PadesMeasurementUnits::CENTIMETERS;

    // Set the visual representation to the signature. We have encapsulated this code (on
    // PadesVisualElementsRest.php) to be used on various PAdES examples.
    $signatureStarter->visualRepresentation = PadesVisualElementsRest::getVisualRepresentation();

    // Call the start() method, which initiates the signature. This yields the parameters for the
    // signature using the certificate.
    $signatureParams = $signatureStarter->start();

    // 2. Perform the signature

    // Perform the signature using the parameters returned by REST PKI with the private key extracted
    // from the PKCS #12 file.
    if (!openssl_sign($signatureParams->toSignData, $signature, $pkcs12['pkey'], $signatureParams->openSslSignatureAlgorithm)) {
        throw new \Exception('Unable to perform the signature: ' . openssl_error_string());
    }

    // 3. Complete the signature with REST PKI

    // Instantiate the PadesSignatureFinisher2 class, responsible for completing the signature process.
    $signatureFinisher = new PadesSignatureFinisher2(Util::getRestPkiClient());

    // Set the token.
    $signatureFinisher->token = $signatureParams->token;

    // Set the signature.
    $signatureFinisher->setSignatureRaw($signature);

    // Call the finish() method, which finalizes the signature process and returns a SignatureResult
    // object.
    $signatureResult = $signatureFinisher->finish();

    // The "certificate" property of the SignatureResult object contains information about the
    // certificate used to sign the file.
    $signerCert = $signatureResult->certificate;

    // At this point, you'd typically store the signed PDF on your database. For demonstration purposes,
    // we'll store the PDF on a temporary folder publicly accessible and render a link to it.
    $outputFile = StorageMock::generateFileId('pdf');

    // The SignatureResult object has functions for writing the signature file to a local file
    // (writeToFile()) and to get its raw contents (getContent()). For large files, use writeToFile() in
    // order to avoid memory allocation issues.
    $signatureResult->writeToFile(StorageMock::getDataPath($outputFile));

    ?><!DOCTYPE html>
    <html>
    <head>
        <?php include '../shared/head.php' ?>
    </head>
    <body>

    <?php include '../shared/menu.php' ?>

    <div class="container content">
        <div id="messagesPanel"></div>

        <h2 class="ls-title">PAdES Signature using a server key with REST PKI</h2>
        <h5 class="ls-subtitle">File signed successfully! <i class="fas fa-check-circle text-success"></i></h5>

        <div class="ls-content">
            <p>
                Signer information:
            <ul>
                <li>Subject: <?= $signerCert->subjectName->commonName ?></li>
                <li>Email: <?= $signerCert->emailAddress ?></li>
                <li>
                    ICP-Brasil fields
                    <ul>
                        <li>Tipo de certificado: <?= $signerCert->pkiBrazil->certificateType ?></li>
                        <li>CPF: <?= $signerCert->pkiBrazil->cpf ?></li>
                        <li>Responsavel: <?= $signerCert->pkiBrazil->responsavel ?></li>
                        <li>Empresa: <?= $signerCert->pkiBrazil->companyName ?></li>
                        <li>CNPJ: <?= $signerCert->pkiBrazil->cnpj ?></li>
                        <li>
                            RG: <?= $signerCert->pkiBrazil->rgNumero . " " . $signerCert->pkiBrazil->rgEmissor . " " . $signerCert->pkiBrazil->rgEmissorUF ?></li>
                        <li>OAB: <?= $signerCert->pkiBrazil->oabNumero . " " . $signerCert->pkiBrazil->oabUF ?></li>
                    </ul>
                </li>
            </ul>
            </p>

            <h3>Actions:</h3>
            <ul>
                <li><a href="/download?fileId=<?= $outputFile ?>">Download the signed file</a></li>
                <li><a href="/printer-friendly-pades-rest?fileId=<?= $outputFile ?>">Download a printer-friendly version of the signed file</a></li>
                <li><a href="/open-pades-rest?fileId=<?= $outputFile ?>">Open/validate the signed file</a></li>
                <li><a href="/pades-signature-rest?fileId=<?= $outputFile ?>">Co-sign with another certificate</a></li>
            </ul>
        </div>
    </div>

    <?php include '../shared/scripts.php' ?>

    </body>
    </html>

<?php
    } catch (Exception $e) {
        include '../shared/catch-error.php';
    }
?>
