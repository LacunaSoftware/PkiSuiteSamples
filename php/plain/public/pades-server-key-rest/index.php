<?php

/**
 * This file perform a local CAdES signature in one step using PKI Express.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\StandardSignaturePolicies;
use Lacuna\RestPki\PadesSignatureStarter;
use Lacuna\RestPki\PadesMeasurementUnits;
use Lacuna\RestPki\PadesSignatureFinisher2;

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

    // Read the PKCS #12 file,
    if (!$certData = file_get_contents(StorageMock::getSampleCertificatePath())) {
        throw new \Exception("Unable to read PKCS #12 file");
    }

    if (!openssl_pkcs12_read($certData, $certObj, "1234")) {
        throw new \Exception("Unable to open the PKCS #12 file");
    }

    // Get restPkiClient (see Util.php)
    $client = Util::getRestPkiClient();

    // Instantiate the PadesSignatureStarter class, responsible for receiving the signature elements and
    // start the signature process.
    $signatureStarter = new PadesSignatureStarter($client);
    
    // Set PKI default options (see Util.php).
    Util::setPkiDefaults($signatureStarter);
    // Set the signature policy.
    $signatureStarter->signaturePolicy = StandardSignaturePolicies::PADES_BASIC;

    // Set the security context. We have encapsulated the security context choice on util.php.
    $signatureStarter->securityContext = Util::getSecurityContextId();

    // Set the unit of measurement used to edit the pdf marks and visual representations.
    $signatureStarter->measurementUnits = PadesMeasurementUnits::CENTIMETERS;

    // Set the visual representation to the signature. We have encapsulated this code (on util-pades.php) to be used on
    // various PAdES examples.
    $signatureStarter->visualRepresentation = PadesVisualElementsRest::getVisualRepresentation();

    // Set the PDF to be signed.
    $signatureStarter->setPdfToSignFromPath(StorageMock::getDataPath($fileToSign));

     // Read certificate
    $privateKey = $certObj['pkey'];
    $certificate = $certObj['cert'];
 
    // Set the signer certificate
    $signatureStarter->setSignerCertificateRaw($certificate);

    $response = $signatureStarter->start();
    
    // Get response values
    $token = $response->token;
    $toSignData = $response->toSignData;
    $digestAlgorithm = $response->digestAlgorithm;
    $transferFileId = $response->transferFile;
    $openSslSignatureAlgorithm = $response->openSslSignatureAlgorithm;

    // Sign the hash with your private key  
    openssl_sign($toSignData, $signature, $privateKey, $openSslSignatureAlgorithm);

    // Instantiate the PadesSignatureFinisher2 class, responsible for completing the signature process.
	$signatureFinisher = new PadesSignatureFinisher2(Util::getRestPkiClient());

	// Set the token.
	$signatureFinisher->token = $token;
    
    // Set the signature done in a previous step
    // $signatureFinisher->signatureBase64 = $signature;
    $signatureFinisher->setSignatureRaw($signature);

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

		<h2 class="ls-title">PAdES Signature with Server Key</h2>
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