<?php

/**
 * This file is called when the user chooses a sample file. It will get the
 * file's content and will store it on a temporary folder using our StorageMock
 * class.
 */

require __DIR__ . '/../../vendor/autoload.php';

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Retrieve "rc" parameter from url
$rc = isset($_GET['rc']) ? $_GET['rc'] : null;

// Retrieve these fields from the previous form on index.php file.
$chosenFileId = isset($_POST['chosenFileId']) ? $_POST['chosenFileId'] : null;
$isCmsCoSign = isset($_POST['isCmsCoSign']) ? filter_var($_POST['isCmsCoSign'], FILTER_VALIDATE_BOOLEAN) : null;

$path = StorageMock::getSampleDocPath($chosenFileId);
$filename = StorageMock::getSampleDocName($chosenFileId);

// Copy file to the temporary folder, where the upload files are stored.
$content = file_get_contents($path);
$fileId = StorageMock::store($content, 'pdf', $filename);

// Only the REST PKI sample needs to pass this file as "cosign" variable when
// cosigning a CMS file.
if ($rc == 'cades-signature-rest' && $isCmsCoSign) {
    header("Location: /{$rc}?cosign={$fileId}", true, 302);
    exit;
} else {
    header("Location: /{$rc}?fileId={$fileId}", true, 302);
    exit;
}
