<?php

/**
 * This file is called asynchronously via AJAX by the batch signature page for
 * each document being signed. It receives the ID of the document and the
 * signer's certificate scripts and initiates a PAdES signature using PKI
 * Express and returns a JSON with the parameters for the client-side signature
 * using Web PKI (see batch-pades-signature-express-form.js).
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\PadesSignatureStarter;
use Lacuna\PkiExpress\StandardSignaturePolicies;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get the parameters for this signature (received from the POST call via AJAX,
// see batch-pades-signature-express-form.js).
$id = $_POST['id'];
$certContent = $_POST['certContent'];

// Get an instance of the PadesSignatureStarter class, responsible for receiving
// the signature elements and start the signature process.
$signatureStarter = new PadesSignatureStarter();

// Set PKI default options (see Util.php).
Util::setPkiDefaults($signatureStarter);

// Set signature policy.
$signatureStarter->signaturePolicy = StandardSignaturePolicies::PADES_BASIC_WITH_LTV;

// Set PDF to be signed.
$signatureStarter->setPdfToSign(StorageMock::getBatchDocPath($id));

// Set Base64-encoded certificate's scripts to signature starter.
$signatureStarter->setCertificateBase64($certContent);

// Set a file reference for the stamp file. Note that this file can be
// referenced later by "fref://stamp" at the "url" field on the visual
// representation (see resources/vr.json file or getVisualRepresentation($case)
// method).
$signatureStarter->addFileReference('stamp', StorageMock::getPdfStampPath());

// Set visual representation. We provide a PHP class that represents the visual
// representation model.
$signatureStarter->setVisualRepresentation(PadesVisualElementsExpress::getVisualRepresentation());

// Start the signature process. Receive as response the following fields:
// - $toSignHash: The hash to be signed.
// - $digestAlgorithm: The digest algorithm that will inform the Web PKI
//                     component to compute the signature.
// - $transferFile: A temporary file to be passed to "complete" step.
$response = $signatureStarter->start();

// Respond this request with the fields received from start() method to be used
// on the javascript or on the complete action.
echo json_encode($response);