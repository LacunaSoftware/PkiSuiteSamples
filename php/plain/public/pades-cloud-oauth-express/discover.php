<?php

/**
 * This action will be called after the user press the button "Search" on index page. It will
 * search for all PSCs that have a certificate with the provided CPF. Thus, it will start the
 * authentication process and return a URL to redirect the user to perform the authentication.
 *
 * After this action the user will be redirected, and to store the local data (fileId) to be user
 * after the user returns to your application. We use the parameter "customState", the last
 * parameter of the method discoverByCpfAndStartAuth(). This parameter will be recovered in the
 * next action.
 */
require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\PkiExpress\TrustServicesManager;
use Lacuna\PkiExpress\TrustServiceSessionTypes;

try {
    // Redirect URL where it's accessed after OAuth flow is finished.
    $REDIRECT_URL = "http://localhost:8000/pades-cloud-oauth-express/complete.php";

    // Only accepts POST requests.
    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
        die();
    }

    // Get URL parameter "fileId"
    $fileId = !empty($_GET['fileId']) ? $_GET['fileId'] : null;

    // Retrieve input values from submitted form.
    $cpf = $_POST['cpf'];

    // Process cpf, removing all formatting.
    $plainCpf = str_replace([".","-"], "", $cpf);

    // Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
    // and handling the OAuth flow.
    $manager = new TrustServicesManager();

    // Discover available PSCs.
    $services = $manager->discoverByCpfAndStartAuth($plainCpf, $REDIRECT_URL, TrustServiceSessionTypes::SIGNATURE_SESSION, $fileId);
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <?php include '../shared/head.php' ?>
    </head>
    <body>

    <?php include '../shared/menu.php' ?>

    <div class="container content">
        <h2 class="ls-title">PAdES Signature using cloud certificate with PKI Express (OAuth Flow)</h2>

        <?php if (sizeof($services) > 0) { ?>
            <h5 class="ls-subtitle">Trusted services were found with this CPF</h5>
            <div class="ls-content">
                <form id="oauthFlowForm" action="/pades-cloud-oauth-express/complete/<?= $fileId ?>" method="POST">
                    <div class="form-group">
                        <div class="px-0">
                            <label for="serviceField">Choose a trust provider:</label>
                            <select id="serviceField" name="service" class="form-control col col-sm-2" >
                                <?php foreach($services as $s) { ?>
                                    <option value="<?= $s->authUrl ?>"><?= $s->serviceInfo->service->name ?> (<?= $s->serviceInfo->provider ?>)</option>
                                <?php } ?>
                            </select>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="redirectUser()">
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

    <script fragment="scripts" type="text/javascript" inline="javascript">
        function redirectUser() {
            // Get redirect URL of the chosen provide.
            var redirectUrl = $('#serviceField').val();
            // Redirect user.
            window.location = redirectUrl;
        }
    </script>
    </body>
    </html>

<?php
    } catch (Exception $e) {
        include '../shared/catch-error.php';
    }
?>