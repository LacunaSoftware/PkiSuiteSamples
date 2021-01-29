<?php

/*
 * This file initiates a PAdES signature session using REST PKI NG simple flow.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\RestPkiService;
use Lacuna\RestPki\CreateSignatureSessionRequest;

try {
    // Only accepts GET requests.
    if ($_SERVER['REQUEST_METHOD'] != 'GET') {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
    }

    // Define the return URL
    $RETURN_URL = "http://localhost:8000/signature-session-rest-ng/complete.php";

    // RestPkiService Configuration
    $client = Util::getRestPkiCoreClient();
    $service = new RestPkiService($client);

    // When using the simple flow, without Webhook, you must give the return URL
    $request = new CreateSignatureSessionRequest($RETURN_URL);

    // Create Signature Session
    $response = $service->createSignatureSession($request);
?>
    <!DOCTYPE html>
    <html>
    <head>
        <?php include '../shared/head.php' ?>
    </head>
    <body>

    <?php include '../shared/menu.php' ?>

    <div class="container content">
        <h2 class="ls-title">Signature Session with REST PKI NG (Simple flow)</h2>
            <div class="ls-content">
                <p>
                    We will redirect you to REST PKI.
                    After you finish the signature, REST PKI NG will redirect you back.
                </p>
                <button type="button" class="btn btn-primary" onclick="redirectUser()">
                    <i class="fas fa-file-signature"></i> Go to REST PKI NG
                </button>
            </div>
    </div>

    <?php include '../shared/scripts.php' ?>
    <script fragment="scripts" type="text/javascript" inline="javascript">
        function redirectUser() {
            // Redirect to REST PKI NG that will return to the $RETURN_URL once 
            // the signature session is finished
            window.open('<?=$response->redirectUrl?>');
        }
    </script>
    </body>
    </html>
<?php
    } catch (Exception $e) {
        include '../shared/catch-error.php';
    }
?>