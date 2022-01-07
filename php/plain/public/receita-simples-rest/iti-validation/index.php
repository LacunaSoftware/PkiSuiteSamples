<?php

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// To run this sample we recommend using ngrok
$baseUrl = '<YOUR PUBLIC URL>/';

$format = !empty($_GET['_format']) ? $_GET['_format'] : null;
$secretCode = !empty($_GET['_secretCode']) ? $_GET['_secretCode'] : null;
// $type = !empty($_GET['type']) ? $_GET['type'] : null;
// $customParam = !empty($_GET['customParam']) ? $_GET['customParam'] : null;

$prescricaoURL = $baseUrl . 'download?fileId=' . $secretCode . '_pdf';

header("Content-Type: application/json");

$response = array(
    'version' => '1.0.0',
    'prescription' => array(
        'signatureFiles' => array(
            'url' => $prescricaoURL
        )
    )
);

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
exit;