<?php
/**
 * This sample performs two signatures on the same XML document, one on each element,
 * according to the standard Certificación de Origen Digital (COD), from Asociación
 * Latinoamericana de Integración (ALADI). For more information, please see:
 *
 * - Spanish: http://www.aladi.org/nsfweb/Documentos/2327Rev2.pdf
 * - Portuguese: http://www.mdic.gov.br/images/REPOSITORIO/secex/deint/coreo/2014_09_19_-_Brasaladi_761_-_Documento_ALADI_SEC__di_2327__Rev_2_al_port_.pdf
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\XmlElementSignatureStarter;
use Lacuna\RestPki\StandardSignaturePolicies;

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get URL parameter "fileId" (the XML already signed with the COD element).
$fileId = !empty($_GET['fileId']) ? $_GET['fileId'] : null;

try {

    // Instantiate the XmlElementSignatureStarter class, responsible for receiving the signature
    // elements and starting the signature process.
    $signatureStarter = new XmlElementSignatureStarter(Util::getRestPkiClient());

    // Set the XML to be signed — the same file that was signed in the COD step.
    $signatureStarter->setXmlToSignFromPath(StorageMock::getDataPath($fileId));

    // Set the ID of the element to be signed.
    $signatureStarter->toSignElementId = 'CODEH';

    // Set the signature policy.
    $signatureStarter->signaturePolicy = StandardSignaturePolicies::XML_COD_SHA1;

    // Set the security context. We have encapsulated the security context choice on util.php.
    $signatureStarter->securityContext = Util::getSecurityContextId();

    // Call the startWithWebPki() method, which initiates the signature and returns the token.
    $token = $signatureStarter->startWithWebPki();

} catch (Exception $ex) {
    // Save error information on session storage.
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['script'] = 'xml-cod-signature-rest/signCodeh.php';
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

    <h2 class="ls-title">COD XML signature (CODEH element) with REST PKI</h2>

    <div class="ls-content">
        <form id="signForm" action="xml-cod-signature-rest/signCodehComplete.php?fileId=<?= $fileId ?>" method="POST">

            <?php // Render the $token in a hidden input field. ?>
            <input type="hidden" name="token" value="<?= $token ?>">

            <div class="form-group">
                <label>File to sign</label>
                <p>You are signing the <b>CODEH</b> element of <a href='/download?fileId=<?= $fileId ?>'>this XML envelope</a>.</p>
            </div>

            <?php
            // Render a select (combo box) to list the user's certificates. For now it will be empty,
            // we'll populate it later on (see signature-form.js).
            ?>
            <div class="form-group">
                <label for="certificateSelect">Choose a certificate</label>
                <select id="certificateSelect" class="custom-select"></select>
            </div>

            <button id="signButton" type="button" class="btn btn-primary">Sign CODEH element</button>
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
