<?php
/**
 * This sample performs the three signatures required on a Brazilian digital diploma XML. See
 * index.php for an overview.
 */

/**
 * This file initiates the signature of the whole diploma, usually with an e-CNPJ, on the diploma
 * signed by signDadosRegistroComplete.php. The form is posted to signDiplomaComplete.php.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\FullXmlSignatureStarter;
use Lacuna\RestPki\StandardSignaturePolicies;

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get URL parameter "fileId" (the diploma with the DadosDiploma and DadosRegistro elements already
// signed). This sample can only execute if the provided file exists.
$fileId = !empty($_GET['fileId']) ? $_GET['fileId'] : null;
if (empty($fileId) || !StorageMock::exists($fileId)) {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

try {

    // Instantiate the FullXmlSignatureStarter class, responsible for receiving the signature
    // elements and starting the signature process.
    $signatureStarter = new FullXmlSignatureStarter(Util::getRestPkiClient());

    // Set the XML to be signed, the diploma signed in the previous steps.
    $signatureStarter->setXmlToSignFromPath(StorageMock::getDataPath($fileId));

    // Set the signature policy. The whole diploma is signed with the AD-RA (archiving) policy.
    $signatureStarter->signaturePolicy = StandardSignaturePolicies::XML_ICPBR_ADR_ARQUIVAMENTO;

    // Set the security context. We have encapsulated the security context choice on util.php.
    $signatureStarter->securityContext = Util::getSecurityContextId();

    // Call the startWithWebPki() method, which initiates the signature and returns the token.
    $token = $signatureStarter->startWithWebPki();

} catch (Exception $ex) {
    // Save error information on session storage.
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['script'] = 'xml-diploma-signature-rest/signDiploma.php';
    $_SESSION['message'] = $ex->getMessage();
    $_SESSION['trace'] = $ex->getTraceAsString();
    $_SESSION['status'] = 500;
    $_SESSION['error'] = 'Internal Server Error';
    header("Location: /error.php", true, 302);
    exit;
}

// Prevent caching of this page so that a stale token is never reused.
Util::setExpiredPage();

?><!DOCTYPE html>
<html>
<head>
    <?php include '../shared/head.php' ?>
</head>
<body>

<?php include '../shared/menu.php' ?>

<div class="container content">
    <div id="messagesPanel"></div>

    <h2 class="ls-title">XML Diploma Signature with REST PKI</h2>

    <div class="ls-content">
        <form id="signForm" action="xml-diploma-signature-rest/signDiplomaComplete.php" method="POST">

            <?php // Render the $token in a hidden input field. ?>
            <input type="hidden" name="token" value="<?= $token ?>">

            <div class="form-group">
                <label>File to sign</label>
                <p>You are signing <a href='/download?fileId=<?= $fileId ?>'>this whole diploma</a>, usually with an e-CNPJ.</p>
            </div>

            <?php
            // Render a select (combo box) to list the user's certificates. For now it will be empty,
            // we'll populate it later on (see signature-form.js).
            ?>
            <div class="form-group">
                <label for="certificateSelect">Choose a certificate</label>
                <select id="certificateSelect" class="custom-select"></select>
            </div>

            <button id="signButton" type="button" class="btn btn-primary">Sign diploma</button>
            <button id="refreshButton" type="button" class="btn btn-outline-primary">Refresh Certificates</button>
        </form>
    </div>
</div>

<?php include '../shared/scripts.php' ?>

<script type="text/javascript" src="https://cdn.lacunasoftware.com/libs/web-pki/lacuna-web-pki-2.14.0.min.js"
        integrity="sha256-m0Wlj4Pp61wsYSB4ROM/W5RMnDyTpqXTJCOYPBNm300="
        crossorigin="anonymous"></script>

<script src="../scripts/signature-form.js"></script>
<script>
    $(document).ready(function () {
        signatureForm.init({
            token: '<?= $token ?>',
            form: $('#signForm'),
            certificateSelect: $('#certificateSelect'),
            refreshButton: $('#refreshButton'),
            signButton: $('#signButton')
        });
    });
</script>

</body>
</html>
