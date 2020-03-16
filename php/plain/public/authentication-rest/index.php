<?php
/**
 * This file initiates an authentication with REST PKI and renders the
 * authentication page. The form is posted to another file,
 * authentication-action.php, which calls REST PKI again to validate the data
 * received.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\Authentication;

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get an instance of the Authentication class, responsible for starting and
// completing the authentication process.
$auth = new Authentication(Util::getRestPkiClient());

// Call the startWithWebPki() method, which initiates the authentication. This
// yields the "token", a 22-character case-sensitive URL-safe string, which
// represents this authentication process. We'll use this value to call the
// signWithRestPki() method on the Web PKI component (see signature-form.js
// below) and also the call the completeWithWebPki() method on the complete.php
// file. This should NOT be mistaken with the API access token. We have
// encapsulated the security context choice on Util.php.
$token = $auth->startWithWebPki(Util::getSecurityContextId());

// The token acquired above can only be used for a single authentication. In
// order to retry authenticating it is necessary to get a new token. This can be
// a problem if the user uses the back button of the browser, since the browser
// might show a cached page that we rendered previously, with a now stale token.
// To prevent this from happening, we call the function setExpiredPage(),
// located in Util.php, which sets HTTP headers to prevent caching of the page.
Util::setExpiredPage();

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

    <h2 class="ls-title">Authentication with REST PKI</h2>

    <div class="ls-content">

        <?php // Notice that we'll POST to a different PHP file. ?>
        <form id="authForm" action="authentication-rest/complete.php" method="POST">

            <?php // render the $token in a hidden input field. ?>
            <input type="hidden" name="token" value="<?= $token ?>">

            <?php
            // Render a select (combo box) to list the user's certificates.
            // For now it will be empty, we'll populate it later on
            // (see signature-form.js).
            ?>
            <div class="form-group">
                <label for="certificateSelect">Choose a certificate</label>
                <select id="certificateSelect" class="form-control"></select>
            </div>

            <?php
            // Action buttons. Notice that the "Sign In" button is NOT a submit button. When the user
            // clicks the button, we must first use the Web PKI component to perform the client-side
            // computation necessary and only when that computation is finished we'll submit the form
            // programmatically (see signature-form.js).
            ?>
            <button id="signInButton" type="button" class="btn btn-primary">Sign In</button>
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
// only an example, feel, free to alter it to meet your application's needs. You
// can also bring the code into the javascript block below if you prefer.
?>
<script src="../scripts/signature-form.js"></script>
<script>
    $(document).ready(function () {
        // Once the page is ready, we call the init() function on the javascript
        // code (see signature-form.js).
        signatureForm.init({
            token: '<?= $token ?>',                     // The token acquired from REST PKI.
            form: $('#authForm'),                       // The form that should be submitted when the operation is complete.
            certificateSelect: $('#certificateSelect'), // The <select> element (combo box) to list the certificates.
            refreshButton: $('#refreshButton'),         // The "refresh" button.
            signButton: $('#signInButton')              // The button that initiates the operation.
        });
    });
</script>

</body>
</html>
