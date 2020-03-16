<?php

/**
 * This file renders a page to show the available server files to be used on the
 * sample referred by "rc" parameter.
 */
require __DIR__ . '/../../vendor/autoload.php';

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

$rc = isset($_GET['rc']) ? $_GET['rc'] : null;
$op = isset($_GET['op']) ? $_GET['op'] : null;

$availableFiles = [];
$isCmsCoSign = false;

// It is up to your application's business logic to determine which server
// documents to be available for the signature.
switch ($op) {
    case 'cosignCms':
        $isCmsCoSign = true;
        array_push($availableFiles, new ServerFile(SampleDocs::CMS_SIGNED_ONCE, 'A sample CMS file that was signed once.'));
        array_push($availableFiles, new ServerFile(SampleDocs::CMS_SIGNED_TWICE, 'A sample CMS file that was signed twice.'));
        break;
    case 'cosignPdf':
    case 'printerFriendly':
        array_push($availableFiles, new ServerFile(SampleDocs::PDF_SIGNED_ONCE, 'A sample PDF that was signed just once.'));
        array_push($availableFiles, new ServerFile(SampleDocs::PDF_SIGNED_TWICE, 'A sample PDF that was signed twice.'));
        break;
    case 'signCms':
    case 'signPdf':
        array_push($availableFiles, new ServerFile(SampleDocs::SAMPLE_PDF, 'A sample PDF document (size: 25kb) with no signatures.'));
        break;
    default:
        throw new \Exception('Invalid operation');
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

    <h2 class="ls-title">Choose one of the available files on the server</h2>
    <h5 class="ls-subtitle">You will be redirected to route <b>/<?= $rc ?></b></h5>

    <div class="ls-content">
        <form id="filesForm" method="POST" action="server-files/action.php?rc=<?= $rc ?>">
            <input type="hidden" id="isCmsCoSignField" name="isCmsCoSign" value="<?= $isCmsCoSign ? 'true' : 'false' ?>" />
            <input type="hidden" id="chosenFileIdField" name="chosenFileId" />

            <?
            // Group of cards containing the server file's information. On each card its possible to choose it to be
            // used on the next operation or to download the server file. This is only an example of choosing a server
            // file, you can change this file or use your own logic. The operation only requires the content of this
            // document or its path.
            ?>
            <div class="form-group">
                <div class="row">
                    <?php for ($index = 0; $index < count($availableFiles); $index++) { ?>
                        <div class="col col-md-3">
                            <div id="<?= $availableFiles[$index]->id ?>-card" class="card server-file shadow">
                                <h5 class="card-header text-center">Document #<?= $index + 1 ?></h5>

                                <div class="card-body">
                                    <p><?= $availableFiles[$index]->description ?></p>
                                </div>

                                <div class="buttons">
                                    <?
                                    // Button used to choose a sample file. It will execute the function chooseFile() on
                                    // the javascript below. The field "id" from the Thymeleaf's variable "file" has the
                                    // task of identifying the document on server side after submitting this form.
                                    ?>
                                    <button id="<?= $availableFiles[$index]->id ?>-choice-btn"
                                            type="button"
                                            class="choose-file btn btn-primary"
                                            onclick="chooseFile('<?= $availableFiles[$index]->id ?>')">
                                        <i class="fas fa-check"></i> Use this
                                    </button>

                                    <?
                                    // Link to download the server file.
                                    ?>
                                    <a id="<?= $availableFiles[$index]->id ?>-download-btn"
                                       href="<?= $availableFiles[$index]->getDownloadUrl() ?>"
                                       class="btn btn-outline-primary">
                                        <i class="fas fa-file-download"></i> Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    <?php } ?>
                </div>
            </div>
        </form>
    </div>
</div>

<?php include '../shared/scripts.php' ?>

<?
// This javascript is only an optional feature for this upload page. It will use jQuery to improve the UX of the page.
// Feel free to alter it however you want.
?>
<script>
    // -----------------------------------------------------------------------------------------------------------------
    // Function called when the user clicks the "Use This" button. It will store the file's id on the hidden <input>
    // (#chosenFileIdField), which will be passed to server when submitting the <form> (#filesForm). After this, it
    // submits the form#filesForm.
    // -----------------------------------------------------------------------------------------------------------------
    function chooseFile(chosenFileId) {

        // Store the file's id on hidden <input> (#chosenFileIdField).
        $('#chosenFileIdField').val(chosenFileId);

        // Highlight card referred to the chosen file.

        $('#' + chosenFileId + '-card')
            .addClass('border border-success text-success');

        $('#' + chosenFileId + '-choice-btn')
            .removeClass('btn-primary')
            .addClass('btn-success');

        $('#' + chosenFileId + '-download-btn')
            .removeClass('btn-outline-primary')
            .addClass('btn-outline-success');

        // Show message, informing that will redirect to some other page, which will happen on
        // server-side after submission.
        $.blockUI({message: 'Redirecting ...'});
        setTimeout(function () {

            // Submit form.
            $('#filesForm').submit();

        }, 1000);
    }
</script>

</body>
</html>
