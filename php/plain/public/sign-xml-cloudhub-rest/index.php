<?php

/**
 * This sample is responsible to perform a flow using OAuth to communicate with PSCs to perform a
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

    <h2 class="ls-title">XML Signature using cloud certificate with Cloudhub API</h2>

    <div class="ls-content">
        <form id="selectFlowForm" action="/sign-xml-cloudhub-rest/discover.php" method="POST">
            <div class="form-group">
                <label>File to sign</label>
                <p>You are signing this entire <a href='/download/sample.php?docId=SAMPLE_XML'> sample XML</a>.</p>
            </div>
            <div class="px-0 col col-sm-2">
                <label for="cpfField">Inform your CPF:</label>
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
