<?php

/**
 * This file is called by the REST PKI Core once the signature session is finished.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\RestPkiService;
use Lacuna\RestPki\SignatureSessionStatus;

try {
    // RestPkiService Configuration
    $client = Util::getRestPkiCoreClient();
    $service = new RestPkiService($client);

    // Get URL parameters
    $sessionId = !empty($_GET['signatureSessionId']) ? $_GET['signatureSessionId'] : null;

    // Get session information
    $session = $service->getSignatureSession($sessionId);

    if ($session->status == SignatureSessionStatus::COMPLETED){
        // If signature completed, get document information
        $docId = $session->documents[0]->id;
        $doc = $service->getDocument($docId);
    }
?>
    <!DOCTYPE html>
    <html>
    <head>
        <?php include '../shared/head.php' ?>
    </head>
    <body>

    <?php include '../shared/menu.php' ?>

    <div class="container content">
        <h2 class="ls-title">Signature Session with REST PKI Core (Simple flow)</h2>
        <?php if ($session->status == SignatureSessionStatus::COMPLETED){ ?>
            <h5 class="ls-subtitle">File signed successfully! <i class="fas fa-check-circle text-success"></i></h5>

            <div class="ls-content">
                <h3>Actions:</h3>
                <ul>
                    <li><a href="<?= $doc->originalFile->location ?>">Download the original file</a></li>
                    <li><a href="<?= $doc->signedFile->location ?>">Download the signed file</a></li>
                </ul>
            </div>
        <?php } else if ($session->status == SignatureSessionStatus::USER_CANCELLED){ ?>
            <h5 class="ls-subtitle">Signature Session Cancelled by the user! <i class="fas fa-check-circle text-danger"></i></h5>
        <?php } ?>

    </div>

    <? include '../shared/scripts.php' ?>

    </body>
    </html>

<?php
    } catch (Exception $e) {
        include '../shared/catch-error.php';
    }
?>