<?php

/**
 * This file receives the form submission from authentication/index.php. We'll call REST PKI to
 * validate the authentication.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\RestPki\Authentication;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get the token for this authentication (rendered in a hidden input field, see
// authentication-restpki/index.php).
$token = $_POST['token'];

// Get an instance for this authentication class.
$auth = new Authentication(Util::getRestPkiClient());

// Call the completeWithWebPki() method with the token, which finalizes the authentication process.
// The call yields a ValidationResults which denotes whether the authentication was successful or
// not (we'll use it to render the page accordingly, see below).
$vr = $auth->completeWithWebPki($token);

if ($vr->isValid()) {

    $userCert = $auth->getCertificate();
    // At this point, you have assurance that the certificate is valid according to the
    // SecurityContext specified on the file authentication.php and that the user is indeed the
    // certificate's subject. Now, you'd typically query your database for a user that matches one
    // of the certificate's fields, such as $userCert->emailAddress or $userCert->pkiBrazil->cpf
    // (the actual field to be used as key depends on your application's business logic) and set
    // the user as authenticated with whatever web security framework your application uses. For
    // demonstration purposes, we'll just render the user's certificate information.

} else {

    // If the authentication was not successful, we render a page showing that what went wrong.
    // The __toString() method of the ValidationResults object can be used to obtain the checks performed, but
    // the string contains tabs and new line characters for formatting, which we'll convert the <br>'s and
    // &nbsp;'s.
    $vrHtml = $vr;
    $vrHtml = str_replace("\n", '<br/>', $vrHtml);
    $vrHtml = str_replace("\t", '&nbsp;&nbsp;&nbsp;&nbsp;', $vrHtml);
}

?>
<!DOCTYPE html>
<html>
<head>
    <?php // The head elements, containing the stylesheet imports, page title. ?>
    <?php include '../head.php' ?>
</head>
<body>

<?php // The top menu, this can be removed entirely. ?>
<?php include '../menu.php' ?>

<div class="container content">
    <div id="messagesPanel"></div>

    <h2 class="ls-title">Authentication with REST PKI</h2>

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
        <a href="/authentication-restpki" class="btn btn-primary">Try Again</a>

    <?php } ?>
</div>

<? include '../scripts.php' ?>

</body>
</html>
