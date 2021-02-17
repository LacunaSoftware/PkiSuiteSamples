<?php

/**
 * This file validate the file uploaded to REST PKI Core.
 */

require __DIR__ . '/../vendor/autoload.php';

use Lacuna\RestPki\ValidateFileRequest;
use Lacuna\RestPki\ValidateFileResponse;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Recover POST content.
$model = json_decode(file_get_contents('php://input'));
$request = new ValidateFileRequest($model);

// List invalid file names.
$badNames = ["P111111.pdf", "P222222.pdf", "P333333.pdf",
             "P444444.pdf", "P555555.pdf", "P666666.pdf",
             "P777777.pdf", "P888888.pdf", "P999999.pdf"];

// Validate file.
if ($request->length < 5)
{
    $response = new ValidateFileResponse(false, "The file is too small.");
}
else if ($request->contentType != "application/pdf")
{
    $response = new ValidateFileResponse(false, "The file is not a PDF.");
}
else if (in_array($request->name, $badNames))
{
    $response = new ValidateFileResponse(false, "The file name is invalid.");
}
else
{
    $response = new ValidateFileResponse(true);
}

// Generate json.
header("Content-Type: application/json");

$json = json_encode($response);
if ($json === false) {
    // Avoid echo of empty string (which is invalid JSON), and
    // JSONify the error message instead:
    $json = json_encode(["jsonError" => json_last_error_msg()]);
    if ($json === false) {
        // This should not happen, but we go all the way now:
        $json = '{"jsonError":"unknown"}';
    }
    // Set HTTP response status code to: 500 - Internal Server Error
    http_response_code(500);
}

// Respond POST.
echo $json;
?>