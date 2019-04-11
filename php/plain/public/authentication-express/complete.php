<?php

/**
 * This file completes the authentication, which was initialized on authentication-express/index.php
 * file.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\Authentication;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Recover variables from the POST arguments to be used on this step.
$nonce = !empty($_POST['nonce']) ? $_POST['nonce'] : null;
$certContent = !empty($_POST['certContent']) ? $_POST['certContent'] : null;
$signature = !empty($_POST['signature']) ? $_POST['signature'] : null;

// Get an instance of the Authentication class.
$auth = new Authentication();

// Set PKI Express default options (see Util.php).
Util::setPkiDefaults($auth);

// Set the nonce. This value is generated on "start" action and passed by a hidden field.
$auth->setNonce($nonce);

// Set the Base64-encoded certificate scripts.
$auth->setCertificateBase64($certContent);

// Set the signature.
$auth->setSignature($signature);

// Complete the authentication. Receive as response a AuthCompleteResult instance containing the
// following fields:
// - The certificate information;
// - The validation results.
$result = $auth->complete();

// Check the authentication result.
$vr = $result->validationResults;
if ($vr->isValid()) {
    $userCert = $result->certificate;
    // At this point, you have assurance that the certificate is valid according to the
    // SecurityContext specified on the file authentication.php and that the user is indeed the
    // certificate's subject. Now, you'd typically query your database for a user that matches one
    // of the certificate's fields, such as $userCert->emailAddress or $userCert->pkiBrazil->cpf
    // (the actual field to be used as key depends on your application's business logic) and set
    // the user as authenticated with whatever web security framework your application uses. For
    // demonstration purposes, we'll just render the user's certificate information.

} else {

    // If the authentication was not successful, we render a page showing that what went wrong.
    // The __toString() method of the ValidationResults object can be used to obtain the checks
    // performed, but the string contains tabs and new line characters for formatting, which we'll
    // convert the <br>'s and &nbsp;'s.
    $vrHtml = $vr;
    $vrHtml = str_replace("\n", '<br/>', $vrHtml);
    $vrHtml = str_replace("\t", '&nbsp;&nbsp;&nbsp;&nbsp;', $vrHtml);
}

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
    // We'll render different contents depending on whether the authentication succeeded or not.
    ?>
    <?php if ($vr->isValid()) { ?>

        <h5>Authentication succeeded <i class="fas fa-check-circle" style="color: green;"></i></h5>
        <p>
            User certificate information:
            <ul>
                <li>Subject: <?= $userCert->subjectName->commonName ?></li>
                <li>Email: <?= $userCert->emailAddress ?></li>
                <li>
                    ICP-Brasil fields
                    <ul>
                        <li>Tipo de certificado: <?= $userCert->pkiBrazil->certificateType ?></li>
                        <li>CPF: <?= $userCert->pkiBrazil->cpf ?></li>
                        <li>Responsavel: <?= $userCert->pkiBrazil->responsavel ?></li>
                        <li>Empresa: <?= $userCert->pkiBrazil->companyName ?></li>
                        <li>CNPJ: <?= $userCert->pkiBrazil->cnpj ?></li>
                        <li>RG: <?= $userCert->pkiBrazil->rgNumero." ".$userCert->pkiBrazil->rgEmissor." ".$userCert->pkiBrazil->rgEmissorUF ?></li>
                        <li>OAB: <?= $userCert->pkiBrazil->oabNumero." ".$userCert->pkiBrazil->oabUF ?></li>
                    </ul>
                </li>
            </ul>
        </p>

    <?php } else { ?>

        <h5>Authentication failed <i class="fas fa-times-circle" style="color: red;"></i></h5>
        <p><?= $vrHtml?></p>
        <a href="/authentication-express" class="btn btn-primary">Try Again</a>

    <?php } ?>
</div>

<?php include '../scripts.php' ?>

</body>
</html>
