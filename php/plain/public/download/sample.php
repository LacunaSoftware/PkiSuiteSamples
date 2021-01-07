<?php

require __DIR__ . '/../../vendor/autoload.php';

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get sampleId from URL.
$id = $_GET['docId'];

switch ($id) {
    case SampleDocs::SAMPLE_PDF:
    case SampleDocs::PDF_SIGNED_ONCE:
    case SampleDocs::PDF_SIGNED_TWICE:
    case SampleDocs::CMS_SIGNED_ONCE:
    case SampleDocs::CMS_SIGNED_TWICE:
    case SampleDocs::SAMPLE_NFE:
    case SampleDocs::SAMPLE_XML:
    case SampleDocs::SAMPLE_COD_ENVELOPE:
        $sampleId = $id;
        break;
    default:
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
}

$path = StorageMock::getSampleDocPath($sampleId);
header('Content-Disposition: attachment; filename="'. basename($path) .'"');
header('Content-Length: ' . filesize($path));
readfile($path);
exit;