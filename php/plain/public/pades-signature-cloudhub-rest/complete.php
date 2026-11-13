<?php

/**
 * This file is called when the provider redirects the user back after the authorization (see the
 * redirect URI in discover.php). We'll start the signature with REST PKI, sign the hash with
 * CloudHub and call REST PKI to complete the signature.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\Cloudhub\CloudhubClient;
use Lacuna\Cloudhub\SignHashRequest;
use Lacuna\Cloudhub\Util as CloudhubUtil;
use Lacuna\RestPki\DigestAlgorithm;
use Lacuna\RestPki\DigestAlgorithmAndValue;
use Lacuna\RestPki\PadesSignatureStarter;
use Lacuna\RestPki\StandardSignaturePolicies;
use Lacuna\RestPki\PadesMeasurementUnits;
use Lacuna\RestPki\SignatureAlgorithmParameters;
use Lacuna\RestPki\PadesSignatureFinisher2;

try {
	// Get the file id and the CloudHub session (URL parameters of the redirect) and get the
	// user's certificate from CloudHub.
	$fileId = $_GET['fileId'];
	$session = $_GET['session'];
	$client = Util::getCloudhubClient();
	$cert = $client->getCertificateAsync($session);

	// Instantiate the PadesSignatureStarter class, responsible for receiving the signature elements and
	// starting the signature process.
	$signatureStarter = new PadesSignatureStarter(Util::getRestPkiClient());
	$signatureStarter->setSignerCertificateBase64($cert);
    // Set the PDF to be signed.
    $signatureStarter->setPdfToSignFromPath(StorageMock::getDataPath($fileId));
    $signatureStarter->signaturePolicy = StandardSignaturePolicies::PADES_BASIC;

    // Set the security context. We have encapsulated the security context choice on Util.php.
    $signatureStarter->securityContext = Util::getSecurityContextId();

    // Set the unit of measurement used to edit the pdf marks and visual representations.
    $signatureStarter->measurementUnits = PadesMeasurementUnits::CENTIMETERS;

    // Set the visual representation to the signature. We have encapsulated this code (in
    // PadesVisualElementsRest.php) to be used on various PAdES examples.
    $signatureStarter->visualRepresentation = PadesVisualElementsRest::getVisualRepresentation();

	$res = $signatureStarter->start();
	$signHashRequest = new SignHashRequest($session, CloudhubUtil::base64Convert($res->toSignHash), null, $res->digestAlgorithmOid, null);
	$signHashResponse = $client->signHashAsync($signHashRequest);

	$signatureFinisher = new PadesSignatureFinisher2(Util::getRestPkiClient());
	// Set the token.
	$signatureFinisher->token = $res->token;
	$signatureFinisher->signatureBase64 = $signHashResponse;

	// Call the finish() method, which finalizes the signature process and returns a SignatureResult
	// object.
	$signatureResult = $signatureFinisher->finish();

	// The "certificate" property of the SignatureResult object contains information about the
	// certificate used by the user to sign the file.
	$signerCert = $signatureResult->certificate;

	// At this point, you'd typically store the signed PDF on your database. For demonstration purposes,
	// we'll store the PDF on a temporary folder publicly accessible and render a link to it.

	$filename = StorageMock::generateFileId('pdf');

	// The SignatureResult object has functions for writing the signature file to a local file
	// (writeToFile()) and to get its raw contents (getContent()). For large files, use writeToFile() in
	// order to avoid memory allocation issues.
	$signatureResult->writeToFile(StorageMock::getDataPath($filename));

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

		<h2 class="ls-title">PAdES Signature using cloud certificate with CloudHub API</h2>
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
						<li>Responsável: <?= $signerCert->pkiBrazil->responsavel ?></li>
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
				<li><a href="/download?fileId=<?= $filename ?>">Download the signed file</a></li>
				<li><a href="/open-pades-rest?fileId=<?= $filename ?>">Open/validate the signed file</a></li>
				<li><a href="/pades-signature-rest?fileId=<?= $filename ?>">Co-sign with another certificate</a></li>
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