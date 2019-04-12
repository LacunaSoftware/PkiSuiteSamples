<?php
/**
 * GET /authentication-express
 *
 * This file will initiate and authentication with the PKI Express's "start-auth" command and will
 * render the authentication page.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\Authentication;

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get an instance of the Authentication class, responsible for contacting PKI Express to start and
// compute the authentication.
$auth = new Authentication();

// Set PKI Express default options (see Util.php).
Util::setPkiDefaults($auth);

// Start the authentication. Receive as response a AuthStartResult instance containing the following
// fields:
// - nonce: The nonce to be signed. This value is also used on "complete" action;
// - digestAlgorithm: The digest algorithm that will inform the Web PKI component to compute the
//                    signature.
$result = $auth->start();

// The token acquired above can only be used for a single authentication. In order to retry
// authenticating it is necessary to get a new token. This can be a problem if the user uses the
// back button of the browser, since the browser might show a cached page that we rendered
// previously, with a now stale token. To prevent this from happening, we call the function
// setExpiredPage(), located in Util.php, which sets HTTP headers to prevent caching of the page.
Util::setExpiredPage();

?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php' ?>
</head>
<body>

<?php include '../menu.php' ?>

<div class="container content">
    <div id="messagesPanel"></div>

    <h2 class="ls-title">Authentication with PKI Express</h2>

    <?php
    // This form will be shown initially and when this page is rendered to perform the signature using Web PKI
    // component.
    ?>
    <form id="signInForm" action="authentication-express/complete.php" method="POST">

        <?php // Hidden fields used to pass data from the server-side to the javascript and vice-versa. ?>
        <input type="hidden" id="digestAlgorithmField" name="digestAlgorithm" value="<?= $result->digestAlgorithm ?>">
        <input type="hidden" id="nonceField" name="nonce" value="<?= $result->nonce ?>">
        <input type="hidden" id="certContentField" name="certContent">
        <input type="hidden" id="signatureField" name="signature">

        <?php
        // Render a select (combo box) to list the user's certificates. For now it will be empty, we'll populate
        // it later on (see authentication-form.js).
        ?>
        <div class="form-group">
            <label for="certificateSelect">Choose a certificate</label>
            <select id="certificateSelect" class="form-control"></select>
        </div>

        <?php
        // Action buttons. Notice that the "Sign File" button is NOT a submit button. When the user clicks the
        // button, we must first use the Web PKI component to perform the client-side computation necessary and
        // only when that computation is finished we'll submit the form programmatically (see authentication-form.js).
        ?>
        <button id="signInButton" type="button" class="btn btn-primary">Sign In</button>
        <button id="refreshButton" type="button" class="btn btn-outline-primary">Refresh Certificates</button>

    </form>
</div>

<?php include '../scripts.php' ?>

<?php
// The file below contains the JS lib for accessing the Web PKI component. For more
// information, see: https://webpki.lacunasoftware.com/#/Documentation
?>
<script type="text/javascript" src="https://get.webpkiplugin.com/Scripts/LacunaWebPKI/lacuna-web-pki-2.12.0.min.js"
        integrity="sha256-jDF8LDaAvViVZ7JJAdzDVGgY2BhjOUQ9py+av84PVFA="
        crossorigin="anonymous"></script>

<?php
// The file below contains the logic for calling the Web PKI component. It is only an example, feel free to alter it
// to meet your application's needs. You can also bring the code into the javascript block below if you prefer.
?>
<script src="scripts/authentication-form.js"></script>
<script>

    $(document).ready(function () {
        // Once the page is ready, we call the init() function on the javascript code
        // (see authentication-form.js)
        authenticationForm.init({
            form: $('#signInForm'),                           // The form that should be submitted when the operation is complete
            certificateSelect: $('#certificateSelect'),       // the select element (combo box) to list the certificates
            refreshButton: $('#refreshButton'),               // the "refresh" button
            signInButton: $('#signInButton'),                 // the button that initiates the operation
            digestAlgorithmField: $('#digestAlgorithmField'), // the field "digestAlgorithm"
            nonceField: $('#nonceField'),                     // the field "nonce"
            certContentField: $('#certContentField'),         // the field "certContent"
            signatureField: $('#signatureField')              // the field "signature"
        });
    });

</script>

</body>
</html>
