<?php

require __DIR__ . '/../../vendor/autoload.php';

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get sampleId from URL.
$id = $_GET['id'];

switch ($id) {
    case 'SAMPLE_PDF':
        $sampleId = SampleDocs::SAMPLE_PDF;
        break;
    case 'PDF_SIGNED_ONCE':
        $sampleId = SampleDocs::PDF_SIGNED_ONCE;
        break;
    case 'PDF_SIGNED_TWICE':
        $sampleId = SampleDocs::PDF_SIGNED_TWICE;
        break;
    case 'CMS_SIGNED_ONCE':
        $sampleId = SampleDocs::CMS_SIGNED_ONCE;
        break;
    case 'CMS_SIGNED_TWICE':
        $sampleId = SampleDocs::CMS_SIGNED_TWICE;
        break;
    case 'SAMPLE_NFE':
        $sampleId = SampleDocs::SAMPLE_NFE;
        break;
    case 'SAMPLE_XML':
        $sampleId = SampleDocs::SAMPLE_XML;
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