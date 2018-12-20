<?php

require __DIR__ . '/../../vendor/autoload.php';

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get fileId from URL.
$fileId = $_GET['fileId'];

if (empty($fileId)) {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

if (!StorageMock::exists($fileId)) {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

$path = StorageMock::getDataPath($fileId);

header('Content-Disposition: attachment; filename="'. basename($path) .'"');
header('Content-Length: ' . filesize($path));
readfile($path);
exit;