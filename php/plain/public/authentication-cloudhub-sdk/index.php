<?php

/**
 * This sample is responsible to perform a flow using password to communicate with PSCs to perform a
 * signature. To perform this sample it's necessary to configure PKI Express with the credentials of
 * the services by executing the following sample:
 *
 *    pkie config --set trustServices:<provider>:<configuration>
 *
 * All standard providers:
 *    - BirdId
 *    - ViDaaS
 *    - NeoId
 *    - RemoteId
 *    - SafeId
 * It's possible to create a custom provider if necessary.
 *
 * All configuration available:
 *    - clientId
 *    - clientSecret
 *    - endpoint
 *    - provider
 *    - badgeUrl
 *    - protocolVariant (error handling purposes, it depends on the chosen provider)
 *
 * This sample will only show the PSCs that are configured.
 */

require __DIR__ . '/../../vendor/autoload.php';

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

    <h2 class="ls-title">PAdES Signature using cloud certificate with PKI Express (Password Flow)</h2>

    <div class="ls-content">
        <form id="selectFlowForm" action="/authentication-cloudhub-sdk/discover.php?fileId=<?= $fileId ?>" method="POST">
            <div class="form-group">
                <label>File to sign</label>
                <p>You are signing <a href='/download?fileId=<?= $fileId ?>'>this document</a>.</p>
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

</body>
</html>
