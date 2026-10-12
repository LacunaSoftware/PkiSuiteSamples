<?php

/**
 * This file is called after Web PKI signs the hash and submits the form (see method sign() on
 * scripts/signature-complete-form.js). It asks REST PKI Core to complete the signature.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\ApiRoutes;
use Lacuna\RestPki\RestPkiService;

try {
    // Only accepts POST requests.
    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
    }

    // Recover variables from the POST arguments to be used on this step.
    $state = !empty($_POST['state']) ? $_POST['state'] : null;
    $signature = !empty($_POST['signature']) ? $_POST['signature'] : null;

    // Call REST PKI Core to complete the signature, passing the state returned on the "start" step
    // and the signature value computed by Web PKI. The request follows the
    // CompleteSignatureRequestV2 model and the response is a DocumentModel.
    $client = Util::getRestPkiCoreClient();
    $document = $client->getRestClient()->post(ApiRoutes::SIGNATURE . '/completion', [
        'state' => $state,
        'signature' => $signature,
    ])->getBodyAsJson();

    // At this point, you'd typically store the signed PDF on your database. The "signedFile"
    // field holds a temporary link to it. For demonstration purposes, we'll download the signed
    // PDF and store it with our StorageMock class.
    $service = new RestPkiService($client);
    $signedContent = $service->getContent($document->signedFile->location);
    $signedPdf = StorageMock::store($signedContent, 'pdf', $document->signedFile->name);

    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <?php include '../shared/head.php' ?>
    </head>
    <body>

    <?php include '../shared/menu.php' ?>

    <div class="container content">
        <div id="messagesPanel"></div>

        <h2 class="ls-title">PAdES Signature with REST PKI Core</h2>
        <h5 class="ls-subtitle">File signed successfully! <i class="fas fa-check-circle text-success"></i></h5>

        <div class="ls-content">

            <h3>Actions:</h3>
            <ul>
                <li><a href="/download?fileId=<?= $signedPdf ?>">Download the signed file</a></li>
                <li><a href="/pades-signature-rest-core?fileId=<?= $signedPdf ?>">Co-sign with another certificate</a></li>
            </ul>
        </div>
    </div>

    <?php include '../shared/scripts.php' ?>

    </body>
    </html>

<?php
    } catch (Exception $e) {
        include '../shared/catch-error.php';
    }
?>
