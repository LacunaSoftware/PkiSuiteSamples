<?php

/**
 * This action renders the batch signature page.
 *
 * Notice that the only thing we'll do on the server-side at this point is determine the IDs of the
 * documents to be signed. The page will handle each document one by one and will call the server
 * asynchronously to start and complete each signature.
 */

require __DIR__ . '/../../vendor/autoload.php';

// It is up to your application's business logic to determine which documents will compose the
// batch.
$documentsIds = array_map(function ($id) {
    return sprintf("%02d", $id);
}, range(1, 30));

?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php' ?>
</head>
<body>

<?php include '../menu.php' ?>

<div class="body-content container">
    <div id="messagesPanel"></div>

    <?php // Messages about the signature process will be rendered in here ?>
    <div id="messagesPanel"></div>

    <h2 class="ls-title">Batch Signature with REST PKI</h2>

    <form id="signForm" method="POST">


        <div class="form-group">
            <label>File to sign</label>

            <p>
                You'll be signing the following files:
                <?php
                // UL element to hold the batch's documents (we'll render these programmatically,
                // see batch-pades-signature-restpki-form.js).
                ?>
                <ul id="docList"/>
            </p>
        </div>

        <?php
        // Render a select (combo box) to list the user's certificates. For now it will be
        // empty, we'll populate it later on (see batch-pades-signature-restpki-form.js).
        ?>
        <div class="form-group">
            <label for="certificateSelect">Choose a certificate</label>
            <select id="certificateSelect" class="form-control"></select>
        </div>

        <?php
        // Action buttons. Notice that the "Sign File" button is NOT a submit button. When the user
        // clicks the button, we must first use the Web PKI component to perform the client-side
        // computation necessary and only when that computation is finished we'll submit the form
        // programmatically (see batch-pades-signature-restpki-form.js).
        ?>
        <button id="signButton" type="button" class="btn btn-primary">Sign Batch</button>
        <button id="refreshButton" type="button" class="btn btn-outline-primary">Refresh Certificates</button>

    </form>
</div>

<?php include '../scripts.php' ?>

<?php
// The file below contains the JS lib for accessing the Web PKI component. For more information,
// see: https://webpki.lacunasoftware.com/#/Documentation
?>
<script type="text/javascript" src="https://get.webpkiplugin.com/Scripts/LacunaWebPKI/lacuna-web-pki-2.12.0.min.js"
        integrity="sha256-jDF8LDaAvViVZ7JJAdzDVGgY2BhjOUQ9py+av84PVFA="
        crossorigin="anonymous"></script>

<?php
// The file below contains the logic for calling the Web PKI component. It is only an example, feel
// free to alter it to meet your application's needs. You can also bring the code into the
// javascript block below if you prefer.
?>
<script src="scripts/batch-signature-restpki-form.js"></script>

<script>

    $(document).ready(function () {
        // Once the page is ready, we call the init() function on the javascript code (see batch-pades-signature-restpki-form.js).
        batchSignatureRestPkiForm.init({
            documentsIds: <?= json_encode($documentsIds); ?>,  // The documents IDs.
            docList: $('#docList'),                            // The reference to the list of documents.
            certificateSelect: $('#certificateSelect'),        // The <select> element (combo box) to list the certificates.
            refreshButton: $('#refreshButton'),                // The "refresh" button.
            signButton: $('#signButton')                       // The button that initiates the operation.
        });
    });

</script>

</body>
</html>
