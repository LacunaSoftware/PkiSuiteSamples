<?php
/**
 * This sample performs the three signatures required on a Brazilian digital diploma XML. See
 * index.php for an overview.
 */

/**
 * This file initiates the signature of the DadosRegistro element, usually with an e-CPF, on the
 * diploma signed by complete.php. The form is posted to signDadosRegistroComplete.php.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\XmlElementSignatureStarter;
use Lacuna\RestPki\XmlInsertionOptions;
use Lacuna\RestPki\StandardSignaturePolicies;

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get URL parameter "fileId" (the diploma with the DadosDiploma element already signed). This
// sample can only execute if the provided file exists.
$fileId = !empty($_GET['fileId']) ? $_GET['fileId'] : null;
if (empty($fileId) || !StorageMock::exists($fileId)) {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

try {

    // Instantiate the XmlElementSignatureStarter class, responsible for receiving the signature
    // elements and starting the signature process.
    $signatureStarter = new XmlElementSignatureStarter(Util::getRestPkiClient());

    // Set the XML to be signed, the diploma signed in the previous step.
    $signatureStarter->setXmlToSignFromPath(StorageMock::getDataPath($fileId));

    // Set the ID of the element to be signed (the DadosRegistro element).
    $signatureStarter->toSignElementId = 'Reg35141214314050000662550010001084271182362300';

    // Append the signature as the last child of the signed element.
    $signatureStarter->setSignatureElementLocation('.', XmlInsertionOptions::APPEND_CHILD);

    // Set the signature policy.
    $signatureStarter->signaturePolicy = StandardSignaturePolicies::XML_ICPBR_ADR_TEMPO;

    // Set the security context. We have encapsulated the security context choice on util.php.
    $signatureStarter->securityContext = Util::getSecurityContextId();

    // Call the startWithWebPki() method, which initiates the signature and returns the token.
    $token = $signatureStarter->startWithWebPki();

} catch (Exception $ex) {
    // Save error information on session storage.
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['script'] = 'xml-diploma-signature-rest/signDadosRegistro.php';
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
        <form id="signForm" action="xml-diploma-signature-rest/signDadosRegistroComplete.php" method="POST">

            <?php // Render the $token in a hidden input field. ?>
            <input type="hidden" name="token" value="<?= $token ?>">

            <div class="form-group">
                <label>File to sign</label>
                <p>You are signing the <b>DadosRegistro</b> element of <a href='/download?fileId=<?= $fileId ?>'>this diploma</a>, usually with an e-CPF.</p>
            </div>

            <?php
            // Render a select (combo box) to list the user's certificates. For now it will be empty,
            // we'll populate it later on (see signature-form.js).
            ?>
            <div class="form-group">
                <label for="certificateSelect">Choose a certificate</label>
                <select id="certificateSelect" class="custom-select"></select>
            </div>

            <button id="signButton" type="button" class="btn btn-primary">Sign DadosRegistro element</button>
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
