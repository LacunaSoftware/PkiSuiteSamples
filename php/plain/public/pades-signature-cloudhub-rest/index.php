<?php

/**
 * This sample is responsible for performing a flow using OAuth to communicate with PSCs to perform a
 * signature.
 *
 * All standard providers:
 *    - BirdId
 *    - ViDaaS
 *    - NeoId
 *    - RemoteId
 *    - SafeId
 * 
 * The providers will be listed according to the user's identifier
 */

require __DIR__ . '/../../vendor/autoload.php';

try {
    // Only accepts GET requests.
    if ($_SERVER['REQUEST_METHOD'] != 'GET') {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
    }

    // Verify if the fileId corresponds to an existing file on our StorageMock class.
    $fileId = isset($_GET['fileId']) ? $_GET['fileId'] : null;
    if (!StorageMock::exists($fileId)) {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
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
    <div id="messagesPanel"></div>

    <h2 class="ls-title">PAdES Signature using cloud certificate with CloudHub API</h2>

    <div class="ls-content">
        <form id="selectFlowForm" action="/pades-signature-cloudhub-rest/discover.php?fileId=<?= $fileId ?>" method="POST">
            <div class="form-group">
                <label>File to sign</label>
                <p>You are signing <a href='/download?fileId=<?= $fileId ?>'>this document</a>.</p>
            </div>
            <div class="px-0 col col-sm-2">
                <label for="cpfField">Enter your CPF:</label>
                <input id="cpfField" class="form-control" type="text" name="cpf" placeholder="000.000.000-00" required/>
            </div>

            <button id="searchButton" type="submit" class="btn btn-primary mt-2">
                <i class="fas fa-search"></i> Search
            </button>

        </form>
    </div>
</div>

<?php include '../shared/scripts.php' ?>

<?php
} catch (Exception $e) {
        include '../shared/catch-error.php';
}
?>
</body>
</html>
