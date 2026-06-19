<?php
/**
 * This sample performs two signatures on the same XML document, one on each element,
 * according to the standard Certificación de Origen Digital (COD), from Asociación
 * Latinoamericana de Integración (ALADI). For more information, please see:
 *
 * - Spanish: https://cod.certificadoorigen.com.ar/ALADI_SEC_di2327_Rev13.pdf
 * - Official page: https://www.aladi.org/agenda-digital/certificado-de-origen-digital/
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\XmlElementSignatureStarter;
use Lacuna\RestPki\StandardSignaturePolicies;

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get URL parameter "fileId" (uploaded by the user via upload.php).
$fileId = !empty($_GET['fileId']) ? $_GET['fileId'] : null;
if (empty($fileId)) {
    header("Location: /upload.php?rc=xml-cod-signature-rest", true, 302);
    exit;
}

// Read the XML content from storage (explicit read so we can validate before sending to REST PKI).
$xmlContent = StorageMock::read($fileId);
if ($xmlContent === false || $xmlContent === '') {
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['script'] = 'xml-cod-signature-rest/index.php';
    $_SESSION['message'] = "Could not read the uploaded file (fileId: $fileId). Please upload the file again.";
    $_SESSION['status'] = 500;
    $_SESSION['error'] = 'Internal Server Error';
    header("Location: /error.php", true, 302);
    exit;
}

try {

    // Instantiate the XmlElementSignatureStarter class, responsible for receiving the signature
    // elements and starting the signature process.
    $signatureStarter = new XmlElementSignatureStarter(Util::getRestPkiClient());

    // Set the XML to be signed — the file uploaded by the user.
    $signatureStarter->setXmlToSignFromContentRaw($xmlContent);

    // Set the ID of the element to be signed.
    $signatureStarter->toSignElementId = 'COD';

    // Set the signature policy.
    $signatureStarter->signaturePolicy = StandardSignaturePolicies::XML_COD_SHA1;

    // Set the security context. We have encapsulated the security context choice on util.php.
    $signatureStarter->securityContext = Util::getSecurityContextId();

    // Call the startWithWebPki() method, which initiates the signature. This yields the token, a
    // 43-character case-sensitive URL-safe string, which identifies this signature process. We'll
    // use this value to call the signWithRestPki() method on the Web PKI component (see javascript
    // below) and also to complete the signature after the form is submitted (see complete.php).
    $token = $signatureStarter->startWithWebPki();

} catch (Exception $ex) {
    // Save error information on session storage.
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['script'] = 'xml-cod-signature-rest/index.php';
    $_SESSION['message'] = $ex->getMessage();
    $_SESSION['trace'] = $ex->getTraceAsString();
    $_SESSION['status'] = 500;
    $_SESSION['error'] = 'Internal Server Error';
    header("Location: /error.php", true, 302);
    exit;
}

// The token acquired above can only be used for a single signature attempt. In order to retry the
// signature it is necessary to get a new token. This can be a problem if the user uses the back
// button of the browser, since the browser might show a cached page that we rendered previously,
// with a now stale token. To prevent this from happening, we call the function setExpiredPage(),
// located in util.php, which sets HTTP headers to prevent caching of the page.
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

    <h2 class="ls-title">COD XML signature (COD element) with REST PKI</h2>

    <div class="ls-content">
        <form id="signForm" action="xml-cod-signature-rest/complete.php" method="POST">

            <?php // Render the $token in a hidden input field. ?>
            <input type="hidden" name="token" value="<?= $token ?>">

            <div class="form-group">
                <label>File to sign</label>
                <p>You are signing the <b>COD</b> element of <a href='/download?fileId=<?= $fileId ?>'>this document</a>.</p>
            </div>

            <?php
            // Render a select (combo box) to list the user's certificates. For now it will be empty,
            // we'll populate it later on (see signature-form.js).
            ?>
            <div class="form-group">
                <label for="certificateSelect">Choose a certificate</label>
                <select id="certificateSelect" class="custom-select"></select>
            </div>

            <?php
            // Action buttons. Notice that the "Sign COD element" button is NOT a submit button. When
            // the user clicks the button, we must first use the Web PKI component to perform the
            // client-side computation necessary and only when that computation is finished we'll
            // submit the form programmatically (see signature-form.js).
            ?>
            <button id="signButton" type="button" class="btn btn-primary">Sign COD element</button>
            <button id="refreshButton" type="button" class="btn btn-outline-primary">Refresh Certificates</button>
        </form>
    </div>
</div>

<?php include '../shared/scripts.php' ?>

<?php
// The file below contains the JS lib for accessing the Web PKI component. For more
// information, see: https://webpki.lacunasoftware.com/#/Documentation
?>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/libs/web-pki/lacuna-web-pki-2.14.0.min.js"
        integrity="sha256-m0Wlj4Pp61wsYSB4ROM/W5RMnDyTpqXTJCOYPBNm300="
        crossorigin="anonymous"></script>

<?php
// The file below contains the logic for calling the Web PKI component. It is only an example, feel
// free to alter it to meet your application's needs. You can also bring the code into the javascript
// block below if you prefer.
?>
<script src="../scripts/signature-form.js"></script>
<script>
    $(document).ready(function () {
        // Once the page is ready, we call the init() function on the javascript code
        // (see signature-form.js).
        signatureForm.init({
            token: '<?= $token ?>',                     // The token acquired from REST PKI.
            form: $('#signForm'),                       // The form that should be submitted when the operation is complete.
            certificateSelect: $('#certificateSelect'), // The <select> element (combo box) to list the certificates.
            refreshButton: $('#refreshButton'),         // The "refresh" button.
            signButton: $('#signButton')                // The button that initiates the operation.
        });
    });
</script>

</body>
</html>
