<?php

/**
 * This action renders the batch signature page.
 *
 * Notice that the only thing we'll do on the server-side at this point is
 * determine the IDs of the documents to be signed. The page will handle each
 * document one by one and will call the server asynchronously to start and
 * complete each signature.
 */
require __DIR__ . '/../../vendor/autoload.php';

// It is up to your application's business logic to determine which documents
// will compose the batch.
$documentsIds = array_map(function($id) {
    return sprintf("%02d", $id);
}, range(1, 30));

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

    <?php // Messages about the signature process will be rendered in here. ?>
    <div id="messagesPanel"></div>

    <h2 class="ls-title">Batch of CAdES Signature with PKI Express</h2>

    <div class="ls-content">
        <form id="signForm" method="POST">

            <div class="form-group">
                <label>File to sign</label>

                <p>
                    You'll be signing the following files:
                    <?php
                    // UL element to hold the batch's documents (we'll render
                    // these programatically, see batch-signature-form.js).
                    ?>
                <ul id="docList"/>
                </p>
            </div>

            <?php
            // Render a select (combo box) to list the user's certificates. For now
            // it will be empty, we'll populate it later on
            // (see batch-signature-form.js).
            ?>
            <div class="form-group">
                <label for="certificateSelect">Choose a certificate</label>
                <select id="certificateSelect" class="form-control"></select>
            </div>

            <?php
            // Action buttons. Notice that the "Sign Batch" button is NOT a submit
            // button. When the user clicks the button, we must first use the
            // Web PKI component to perform the client-side computation necessary
            // and only when that computation is finished we'll submit the form
            // programmatically (see batch-signature-form.js).
            ?>
            <button id="signButton" type="button" class="btn btn-primary">Sign Batch</button>
            <button id="refreshButton" type="button" class="btn btn-outline-primary">Refresh Certificates</button>

        </form>
    </div>
</div>

<?php include '../shared/scripts.php' ?>

<?php
// The file below contains the JS lib for accessing the Web PKI component. For
// more information, see: https://webpki.lacunasoftware.com/#/Documentation
?>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/libs/web-pki/lacuna-web-pki-2.14.0.min.js"
        integrity="sha256-m0Wlj4Pp61wsYSB4ROM/W5RMnDyTpqXTJCOYPBNm300="
        crossorigin="anonymous"></script>

<?php
// The file below contains the logic for calling the Web PKI component. It is
// only an example, feel free to alter it to meet your application's needs. You
// can also bring the code into the javascript block below if you prefer.
?>
<script src="../scripts/batch-signature-express-form.js"></script>

<script>

    $(document).ready(function () {
        // Once the page is ready, we call the init() function on the javascript
        // code (see batch-signature-form.js).
        batchSignatureExpressForm.init({
            documentsIds: <?= json_encode($documentsIds); ?>,  // The documents IDs.
            docList: $('#docList'),                            // The reference to the list of documents.
            certificateSelect: $('#certificateSelect'),        // The <select> element (combo box) to list the certificates.
            refreshButton: $('#refreshButton'),                // The "refresh" button.
            signButton: $('#signButton'),                      // The button that initiates the operation.
            ctrlEndpoint: '/batch-cades-signature-express'     // The API controller endpoint to be called by Ajax.
        });
    });

</script>

</body>
</html>
