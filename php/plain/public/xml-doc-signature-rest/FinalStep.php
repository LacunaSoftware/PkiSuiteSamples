<?php

/*
 * This file initiates a XML signature of an element of the XML using REST PKI and renders the signature page. The form
 * is posted to another file, xml-element-signature-action.php, which calls REST PKI again to complete the signature.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\FullXmlSignatureStarter;
use Lacuna\RestPki\XmlElementSignatureStarter;
use Lacuna\RestPki\StandardSignaturePolicies;

try {

    // Instantiate the XmlElementSignatureStarter class, responsible for receiving the signature elements and start the
    // signature process
    $signatureStarter = new FullXmlSignatureStarter(Util::getRestPkiClient());

    // Set the XML to be signed, a sample Brazilian fiscal invoice pre-generated.
    $signatureStarter->setXmlToSignFromPath(StorageMock::getSampleDocPath(SampleDocs::SAMPLE_NFE));

    // Set the signature policy
    $signatureStarter->signaturePolicy = StandardSignaturePolicies::XML_XADES_BES;

    // Set the security context. We have encapsulated the security context choice on util.php.
    $signatureStarter->securityContext = Util::getSecurityContextId();

    // Call the startWithWebPki() method, which initiates the signature. This yields the token, a 43-character
    // case-sensitive URL-safe string, which identifies this signature process. We'll use this value to call the
    // signWithRestPki() method on the Web PKI component (see javascript below) and also to complete the signature after
    // the form is submitted (see file xml-element-signature-action.php). This should not be mistaken with the API access
    // token.
    $token = $signatureStarter->startWithWebPki();

} catch (Exception $ex) {
    // Save error information on session storage.
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    $_SESSION['script'] = 'xml-nfe-signature-rest/index.php';
    $_SESSION['message'] = $ex->getMessage();
    $_SESSION['trace'] = $ex->getTraceAsString();
    $_SESSION['status'] = 500;
    $_SESSION['error'] = 'Internal Server Error';
    header("Location: /error.php", true, 302);
    exit;
}

// The token acquired above can only be used for a single signature attempt. In order to retry the signature it is
// necessary to get a new token. This can be a problem if the user uses the back button of the browser, since the
// browser might show a cached page that we rendered previously, with a now stale token. To prevent this from happening,
// we call the function setExpiredPage(), located in util.php, which sets HTTP headers to prevent caching of the page.
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

    <h2 class="ls-title">Assinatura de documentação acedemica</h2>

    <div class="ls-content">
        <?php // Notice that we'll post to a different PHP file. ?>
        <form id="signForm" action="xml-nfe-signature-rest/LastSignatureData.php" method="POST">

            <?php // Render the $token in a hidden input field. ?>
            <input type="hidden" name="token" value="<?= $token ?>">
            <?php
            // Render a select (combo box) to list the user's certificates. For now it will be empty, we'll populate it
            // later on (see signature-form.js).
            ?>
            <div class="form-group">
                <label for="certificateSelect">Choose a certificate</label>
                <select id="certificateSelect" class="custom-select"></select>
            </div>

            <?php
            // Action buttons. Notice that the "Sign File" button is NOT a submit button. When the user clicks the button,
            // we must first use the Web PKI component to perform the client-side computation necessary and only when
            // that computation is finished we'll submit the form programmatically (see signature-form.js).
            ?>
            <button id="signButton" type="button" class="btn btn-primary">Sign File</button>
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
// The file below contains the logic for calling the Web PKI component. It is only an example, feel free to alter it
// to meet your application's needs. You can also bring the code into the javascript block below if you prefer.
?>
<script src="../scripts/signature-form.js"></script>
<script>
    $(document).ready(function () {
        // Once the page is ready, we call the init() function on the javascript code (see signature-form.js).
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
