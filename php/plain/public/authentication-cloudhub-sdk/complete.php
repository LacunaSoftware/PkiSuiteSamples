<?php

/**
 * This file receives the form submission from pades-signature.php. We'll call REST PKI to complete
 * the signature.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\PadesSignatureFinisher2;

try {
	// Get the token for this signature (rendered in a hidden input field, see
	// pades-signature-restpki/index.php).
	$token = $_POST['token'];

	// Instantiate the PadesSignatureFinisher2 class, responsible for completing the signature process.
	$signatureFinisher = new PadesSignatureFinisher2(Util::getRestPkiClient());

	// Set the token.
	$signatureFinisher->token = $token;

	// Call the finish() method, which finalizes the signature process and returns a SignatureResult
	// object.
	$signatureResult = $signatureFinisher->finish();

	// The "certificate" property of the SignatureResult object contains information about the
	// certificate used by the user
	// to sign the file.
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

		<h2 class="ls-title">PAdES Signature with REST PKI</h2>
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
				<li><a href="/download?fileId=<?= $filename ?>">Download the signed file</a></li>
				<li><a href="/open-pades-rest?fileId=<?= $filename ?>">Open/validate the signed file</a></li>
				<li><a href="/pades-signature-rest?fileId=<?= $filename ?>">Co-sign with another certificate</a></li>
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