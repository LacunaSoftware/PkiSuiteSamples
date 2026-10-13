<?php

/**
 * This file adds a document timestamp to a PDF using REST PKI Core and renders a page with a link
 * to download the timestamped PDF. It is a server-only operation: no signature is made and Web PKI
 * is not involved. The user reaches it after uploading a PDF on upload.php, which redirects here
 * passing the file's id on the "fileId" URL argument.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\RestPkiService;

try {
    // Only accepts GET requests.
    if ($_SERVER['REQUEST_METHOD'] != 'GET') {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
    }

    // Verify if the fileId correspond to an existing file on our StorageMock class.
    $fileId = isset($_GET['fileId']) ? $_GET['fileId'] : null;
    if (!StorageMock::exists($fileId)) {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
    }

    // Build the request to stamp the PDF. Its fields follow the StampPdfRequest model of the REST
    // PKI Core API (see https://core.pki.rest/swagger).
    $request = [

        // The PDF to be timestamped, Base64-encoded.
        'file' => [
            'content' => base64_encode(StorageMock::read($fileId)),
            'contentType' => 'application/pdf',
            'name' => StorageMock::retrieveFilename($fileId),
        ],

        // The timestamp tier determines which timestamp authority issues the timestamp. Here we use
        // the PKI Brazil tier (ICP-Brasil timestamps), by its ID. The API accepts a tier's ID or
        // name, and leaving this field out uses your subscription's default tier.
        'timestampTier' => 'a402df41-8559-47b2-a05c-be555bf66310',
    ];

    // Call REST PKI Core to add the document timestamp. The PHP client library has no method for
    // this call, so we make it with the library's REST client, which sends the API key, encodes the
    // request as JSON and throws an exception if REST PKI Core returns an error. The response is a
    // StampPdfResponse.
    $client = Util::getRestPkiCoreClient();
    $response = $client->getRestClient()->post('api/pdf/stamp', $request)->getBodyAsJson();

    // At this point, you'd typically store the timestamped PDF on your database. REST PKI Core
    // returns it on the "file" field, either inline ("content", Base64-encoded) or as a temporary
    // link ("url"). For demonstration purposes, we'll store it with our StorageMock class.
    if (!empty($response->file->content)) {
        $stampedContent = base64_decode($response->file->content);
    } else {
        $service = new RestPkiService($client);
        $stampedContent = $service->getContent($response->file->url);
    }
    $stampedPdf = StorageMock::store($stampedContent, 'pdf', StorageMock::retrieveFilename($fileId));

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

        <h2 class="ls-title">Timestamp a PDF with REST PKI Core</h2>
        <h5 class="ls-subtitle">Timestamp added successfully! <i class="fas fa-check-circle text-success"></i></h5>

        <div class="ls-content">

            <h3>Actions:</h3>
            <ul>
                <li><a href="/download?fileId=<?= $stampedPdf ?>">Download the timestamped file</a></li>
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
