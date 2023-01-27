<?php

/**
 * This file is called asynchronously via AJAX by the batch signature page for
 * each document being signed. It receives the ID of the document and initiates
 * a PAdES signature using REST PKI and returns a JSON with the token, which
 * identifies this signature process, to be used in the next signature steps
 * (see batch-pades-signature-rest-form.js).
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\PadesSignatureStarter;
use Lacuna\RestPki\StandardSignaturePolicies;
use Lacuna\RestPki\PadesMeasurementUnits;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get the document id for this signature (received from the POST call, see
// batch-signature-form.js).
$id = $_POST['id'];
$cert = $_POST['certContent'];

$client = Util::getRestPkiClient();

// Instantiate the PadesSignatureStarter class, responsible for receiving the
// signature elements and start the signature process.
$signatureStarter = new PadesSignatureStarter($client);

// Set the signature policy.
$signatureStarter->signaturePolicy = StandardSignaturePolicies::PADES_BASIC;

// Set the security context. We have encapsulated the security context choice on
// Util.php.
$signatureStarter->securityContext = Util::getSecurityContextId();

// Set the unit of measurement used to edit the pdf marks and visual
// representations.
$signatureStarter->measurementUnits = PadesMeasurementUnits::CENTIMETERS;

// Set the visual representation to the signature. We have encapsulated this
// code (on util-pades.php) to be used on various PAdES examples.
$signatureStarter->visualRepresentation = PadesVisualElementsRest::getVisualRepresentation($client);

// Set the document to be signed based on its ID.
$signatureStarter->setPdfToSignFromPath(StorageMock::getBatchDocPath($id));

$signatureStarter->setSignerCertificateBase64($cert);

// Optionally, add marks to the PDF before signing. These differ from the
// signature visual they are actually changes done to the document prior to
// signing, not binded to any signature. Therefore, any number of marks can be
// added, for instance one per page, whereas there can only be one visual
// representation per signature. However, since the marks are in reality changes
// to the PDF, they can only be added to documents which have no previous
// signatures, otherwise such signatures would be made invalid by the changes to
// the document (see property PadesSignatureStarter::bypassMarksIfSigned). This
// problem does not occur with signature visual representations.
//
// We have encapsulated this code in a method to include several possibilities
// depending on the argument passed. Experiment changing the argument to see
// different examples of PDF marks. Once you decide which is best for your case,
// you can place the code directly here.
// array_push($signatureStarter->pdfMarks, getPdfMark(1));

// Call the startWithWebPki() method, which initiates the signature. This yields
// the token, a 43-character case-sensitive URL-safe string, which identifies
// this signature process. We'll use this value to call the signWithRestPki()
// method on the Web PKI component (see batch-pades-signature-rest-form.js)
// and also to complete the signature on the POST action below (this should not
// be mistaken with the API access token).

$toSign = $signatureStarter->start();


// Return a JSON with the token obtained from REST PKI (the page will use jQuery
// to decode this value).
echo json_encode($toSign);
