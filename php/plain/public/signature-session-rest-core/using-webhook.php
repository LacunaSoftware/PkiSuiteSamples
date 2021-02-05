<?php

/*
 * This file initiates a PAdES signature session using REST PKI Core Webhook flow.
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

    // RestPkiService Configuration
    $client = Util::getRestPkiCoreClient();
    $service = new RestPkiService($client);

    $request = new CreateSignatureSessionRequest();
    // Set enableBackgroundProcessing to TRUE to use Webhook
    $request->enableBackgroundProcessing = true;

    // Create Signature Session using Webhook
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
        <h2 class="ls-title">Signature Session with REST PKI Core (Webhook flow)</h2>
            <div class="ls-content">
                <p>
                    The REST PKI will open on a new tab and after the signature is 
                    finished it will notify the webhook event handler.
                    <br/>
                    The process will be logged on the file WebhookHandler.log
                    <br/>
                    <code><?=StorageMock::getWebhookHandlerLogPath()?></code>
                    <br/>
                    For this sample to work, you need to configure the webhook handler public URL at REST PKI.
                    <br/>
                </p>
                <button type="button" class="btn btn-primary" onclick="redirectUser()">
                    <i class="fas fa-file-signature"></i> Go to REST PKI
                </button>
            </div>
    </div>

    <?php include '../shared/scripts.php' ?>
    <script fragment="scripts" type="text/javascript" inline="javascript">
        function redirectUser() {
            // Redirect user.
            window.open(
           '<?=$response->redirectUrl?>',
            '_blank'
            );
        }
    </script>
    </body>
    </html>
<?php
    } catch (Exception $e) {
        include '../shared/catch-error.php';
    }
?>