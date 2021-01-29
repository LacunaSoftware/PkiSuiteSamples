<?php

/**
 * This file receives the REST PKI NG's webhook event notification
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\RestPkiService;
use Lacuna\RestPki\WebhookEvent;
use Lacuna\RestPki\WebhookEventTypes;

try {
    // Only accepts POST requests.
    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
    }

    // Recover POST content.
    $model = json_decode(file_get_contents('php://input'));
    $event = new WebhookEvent($model);
    
    // Verify Webhook Event Type.
    if($event->type == WebhookEventTypes::DOCUMENT_SIGNATURE_COMPLETED){
        // RestPkiService configuration.
        $client = Util::getRestPkiCoreClient();
        $service = new RestPkiService($client);
        
        // Get the link to download the signedFile.
        $downloadLink = $event->document->signedFile->location;

        // Get the signed file content.
        $signedContent = $service->getContent($downloadLink);

        // Store file content.
        $outputFile = StorageMock::Store($signedContent, ".pdf");
        StorageMock::logWebhookHandler("Signed file stored - " . $outputFile);
    }
} catch (Exception $e) {
    StorageMock::logWebhookHandler("ERROR - " . $e->getMessage());
}