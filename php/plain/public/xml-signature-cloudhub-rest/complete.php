<?php

/**
 * This file receives the form submission from pades-signature.php. We'll call REST PKI to complete
 * the signature.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\Cloudhub\CloudhubClient;
use Lacuna\Cloudhub\SignHashRequest;
use Lacuna\Cloudhub\Util as CloudhubUtil;
use Lacuna\PkiExpress\XmlSignatureStarter;
use Lacuna\RestPki\DigestAlgorithm;
use Lacuna\RestPki\DigestAlgorithmAndValue;
use Lacuna\RestPki\FullXmlSignatureStarter;
use Lacuna\RestPki\StandardSignaturePolicies;
use Lacuna\RestPki\XmlSignatureFinisher;

try {
	// Get the token for this signature (rendered in a hidden input field, see
	// pades-signature-restpki/index.php).
	$session = $_GET['session'];
	$client = Util::getCloudhubClient();
	$cert = $client->getCertificateAsync($session);

	// Instantiate the FullXmlSignatureStarter class, 
    // responsible for receiving the xml and starting
    // the signature process
    $signatureStarter = new FullXmlSignatureStarter(Util::getRestPkiClient());
    $signatureStarter->setSignerCertificateBase64($cert);

    // Set the XML to be signed, a sample Brazilian fiscal invoice pre-generated.
    $signatureStarter->setXmlToSignFromPath(StorageMock::getSampleDocPath(SampleDocs::SAMPLE_XML));

    // Set the signature policy
    $signatureStarter->signaturePolicy = StandardSignaturePolicies::XML_ICPBR_ADR_BASICA;

     // Set the security context. We have encapsulated the security context choice on util.php.
     $signatureStarter->securityContext = Util::getSecurityContextId();

     // Call the startWithWebPki() method, which initiates the signature. This yields the token, a 43-character
     // case-sensitive URL-safe string, which identifies this signature process. We'll use this value to call the
     // signWithRestPki() method on the Web PKI component (see javascript below) and also to complete the signature after
     // the form is submitted (see file xml-element-signature-action.php). This should not be mistaken with the API access
     // token.
    $res = $signatureStarter->start();
    $signHashRequest = new SignHashRequest($session, CloudhubUtil::base64Convert($res->toSignHash), null, $res->digestAlgorithmOid, null);
	$signHashResponse = $client->signHashAsync($signHashRequest);

    // Instantiate the XmlSignatureFinisher class, responsible for completing the signature process.
    $signatureFinisher = new XmlSignatureFinisher(Util::getRestPkiClient());
    $signatureFinisher->setSignatureBase64($signHashResponse);

    // Set the token.
    $signatureFinisher->token = $res->token;

    // Call the finish() method, which finalizes the signature process and returns the signed XML.
    $signedXml = $signatureFinisher->finish();

    // Get information about the certificate used by the user to sign the file. This method must only be called after
    // calling the finish() method.
    $signerCert = $signatureFinisher->getCertificateInfo();

    // At this point, you'd typically store the signed XML on your database. For demonstration purposes, we'll
    // store the PDF on a temporary folder publicly accessible and render a link to it.
    $filename = StorageMock::store($signedXml, 'xml');
    ?><!DOCTYPE html>
<html>
<head>
    <?php include '../shared/head.php' ?>
</head>
    <body>

    <?php include '../shared/menu.php' ?>

    <div class="container content">
        <div id="messagesPanel"></div>

        <h2 class="ls-title">XML Signature with REST PKI</h2>
        <h5 class="ls-subtitle">File signed successfully!<i class="fas fa-check-circle text-success"></i></h5>

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
                <li><a href="/download?fileId=<?= $filename ?>">Download the signed file</a></li>
                <li><a href="/open-xml-rest?fileId=<?= $filename ?>">Open/validate the signed file</a></li>
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