<?php

/**
 * This action will be called after the user press the button "Search" on index page. It will
 * search for all PSCs that have a certificate with the provided CPF. In this page, there will be
 * a form field asking for user current password. In BirdId provider, this password is called
 * OTP.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\TrustServicesManager;

// Only accepts POST requests.
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get URL parameter "fileId"
$fileId = $_GET['fileId'];

// Retrieve input values from submitted form.
$cpf = $_POST['cpf'];

// Process cpf, removing all formatting.
$plainCpf = str_replace([".","-"], "", $cpf);

// Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
// and handling the password flow.
$manager = new TrustServicesManager();

// Discover available PSCs.
$services = $manager->discoverByCpf($cpf);
?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../shared/head.php' ?>
</head>
<body>

<?php include '../shared/menu.php' ?>

<div class="container content">
    <h2 class="ls-title">PAdES Signature using cloud certificate with PKI Express (Password Flow)</h2>

    <?php if (sizeof($services) > 0) { ?>
        <h5 class="ls-subtitle">Trusted services were found with this CPF</h5>
        <div class="ls-content">
            <form id="pwdFlowForm" action="/pades-cloud-pwd-express/complete.php?fileId=<?= $fileId ?>" method="POST">
                <?php
                // Hidden field used to pass data from the server-side to the
                // javascript and vice-versa.
                ?>
                <input type="hidden" id="cpfField" name="cpf" value="<?= $cpf ?>">
                <div class="form-group">
                    <div class="px-0">
                        <label for="serviceField">Choose a trust provider:</label>
                        <select id="serviceField" name="service" class="form-control col col-sm-2" >
                            <?php foreach($services as $s) { ?>
                                <option value="<?= $s->service->name ?>"><?= $s->service->name ?> (<?= $s->provider ?>)</option>
                            <?php } ?>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <div class="px-0">
                        <label for="passwordField">Inform your password authorization:</label>
                        <input id="passwordField" class="form-control col col-sm-2" type="password" name="password" />
                    </div>
                </div>
        
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-file-signature"></i> Sign
                </button>
            </form>
        </div>
    <?php } else { ?>
        <h5 class="ls-subtitle">No trusted services were found with this CPF</h5>
        <div class="ls-content">
            <p>Possible reasons include:
                <ul>
                    <li>The given CPF does not exist on trusted services</li>
                    <li>The PKI Express was not correctly configured</li>
                </ul>
            </p>
            <p>To configure the PKI Express you need to configure all providers by running the 
                following commands on the terminal: <br/>
                <code>pkie config --set trustServices:{provider}:clientId={value}</code><br/>
                <code>pkie config --set trustServices:{provider}:clientSecret={value}</code>
            </p>
            <p>For customized providers you neet to also configure the endpoint:<br/>
                <code>pkie config --set trustServices:{provider}:endpoint={value}</code>
            </p>
            <p>The standard providers are:
                <ul>
                    <li>BirdID (Soluti)</li>
                    <li>ViDaaS (VALID)</li>
                    <li>NeoID (SERPRO)</li>
                    <li>RemoteID (Certisign)</li>
                    <li>SafeID (Safeweb)</li>
                </ul>
            </p>
            <button onclick="window.history.back()" class="btn btn-primary">Try Again</button>
        </div>
    <?php } ?>


</div>

<?php include '../shared/scripts.php' ?>
</body>
</html>