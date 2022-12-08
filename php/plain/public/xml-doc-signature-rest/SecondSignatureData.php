<?php

/*
 * This file receives the form submission from xml-element-signature.php. We'll call REST PKI to complete the signature.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\XmlSignatureFinisher;

try {

    // Get the token for this signature (rendered in a hidden input field, see xml-element-signature.php).
    $token = $_POST['token'];

    // Instantiate the XmlSignatureFinisher class, responsible for completing the signature process.
    $signatureFinisher = new XmlSignatureFinisher(Util::getRestPkiClient());

    // Set the token.
    $signatureFinisher->token = $token;

    // Call the finish() method, which finalizes the signature process and returns the signed XML.
    $signedXml = $signatureFinisher->finish();

    // Get information about the certificate used by the user to sign the file. This method must only be called after
    // calling the finish() method.
    $signerCert = $signatureFinisher->getCertificateInfo();

    // At this point, you'd typically store the signed XML on your database. For demonstration purposes, we'll
    // store the PDF on a temporary folder publicly accessible and render a link to it.

    $filename = StorageMock::store($signedXml, 'xml');

} catch (Exception $ex) {
    // Save error information on session storage.
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['script'] = 'xml-nfe-signature-rest/complete.php';
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

    <h2 class="ls-title">Assinatura de documentação acedemica</h2>
    <h5 class="ls-subtitle">File signed successfully! <i class="fas fa-check-circle text-success"></i></h5>

    <div class="ls-content">
        <p><strong>Signer information</strong>:</p>
        <ul>
            <li><strong>Subject</strong>: <?= $signerCert->subjectName->commonName ?></li>
            <li><strong>Email</strong>: <?= $signerCert->emailAddress ?></li>
            <li>
                <strong>ICP-Brasil fields</strong>:
                <ul>
                    <li><strong>Tipo de certificado</strong>: <?= $signerCert->pkiBrazil->certificateType ?></li>
                    <li><strong>CPF</strong>: <?= $signerCert->pkiBrazil->cpf ?></li>
                    <li><strong>Responsavel</strong>: <?= $signerCert->pkiBrazil->responsavel ?></li>
                    <li><strong>Empresa</strong>: <?= $signerCert->pkiBrazil->companyName ?></li>
                    <li><strong>CNPJ</strong>: <?= $signerCert->pkiBrazil->cnpj ?></li>
                    <li><strong>RG</strong>: <?= $signerCert->pkiBrazil->rgNumero . " " . $signerCert->pkiBrazil->rgEmissor . " " . $signerCert->pkiBrazil->rgEmissorUF ?></li>
                    <li><strong>OAB</strong>: <?= $signerCert->pkiBrazil->oabNumero . " " . $signerCert->pkiBrazil->oabUF ?></li>
                </ul>
            </li>
        </ul>

        <h3>Actions:</h3>
        <ul>
            <li><a href="xml-doc-signature-rest/FinalStep.php">Next Signature Step</a></li>
        </ul>
    </div>
</div>

<? include '../shared/scripts.php' ?>

</body>
</html>
