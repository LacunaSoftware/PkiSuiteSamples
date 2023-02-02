<?php

/**
 * This action will be called after the user press the button "Search" on index page. It will
 * search for all PSCs that have a certificate with the provided CPF. In this page, there will be
 * a form field asking for user current password. In BirdId provider, this password is called
 * OTP.
 */

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\CloudHub\CloudHubClient;
use Lacuna\CloudHub\SessionCreateRequest;
use Lacuna\CloudHub\TrustServiceSessionTypes as CloudHubTrustServiceSessionTypes;


try {
    $res = null;
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
    $plainCpf = str_replace([".", "-"], "", $cpf);

    // Get an instance of the TrustServiceManager class, responsible for communicating with PSCs
    // and handling the password flow.
    $manager = new CloudHubClient("https://cloudhub.lacunasoftware.com/", "mR1j0v7L12lBHnxpgxVkIdikCN9Gm89rn8I9qet3UHo=");
    $redirectUri = "http://localhost:8000/pades-signature-cloudhub-rest/complete.php?fileId=". $fileId;

    // Discover available PSCs.
    $createSessionRequest = new SessionCreateRequest($plainCpf, $redirectUri, CloudHubTrustServiceSessionTypes::SingleSignature);
    $res = $manager->createSessionAsync($createSessionRequest);
    $services = $res->services;

?>
    <!DOCTYPE html>
    <html>

    <head>
        <?php include '../shared/head.php' ?>
    </head>

    <body>

        <?php include '../shared/menu.php' ?>
        <div class="container content">
            <h2 class="ls-title">PAdES Signature using cloud certificate with CloudHub API</h2>
            <?php if (sizeof($services) > 0) { ?>
                <div class='w-100'>
                    <div>
                        <b> Choose one of the available cloud providers:</b>
                        <div class="container px-0 pt-2">
                            <div class="row">
                                <?php foreach ($services as $s) { ?>
                                    <div class="col-md-3">
                                        <div class="card shadow rounded-0 min-vh-75" style="width: 18rem;">
                                            <?php if ($s->serviceInfo->badgeUrl != null) { ?>
                                                <img src="<?= $s->serviceInfo->badgeUrl ?>" class="card-img-top" style="width: 100%; height: 150px" />
                                            <?php } else { ?>
                                                <div class="bg-light" style="width: 100%; height: 150px">
                                                    <div class="pt-5">
                                                        <p class="text-center">Empty BadgeUrl</p>
                                                    </div>
                                                </div>
                                            <?php } ?>
                                            <div class="card-body">
                                                <button id="service-click" type="button" class="provider-btn btn btn-dark" 
                                                value="<?= $s->authUrl ?>">Sign With <?= $s->serviceInfo->provider ?></button>
                                            </div>
                                        </div>
                                    </div>
                                <?php } ?>
                            </div>
                        </div>
                    </div>
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
                        following commands on the terminal: <br />
                        <code>pkie config --set trustServices:{provider}:clientId={value}</code><br />
                        <code>pkie config --set trustServices:{provider}:clientSecret={value}</code>
                    </p>
                    <p>For customized providers you neet to also configure the endpoint:<br />
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


        </div>

        <?php include '../shared/scripts.php' ?>
        <script fragment="scripts" type="text/javascript" inline="javascript">
            $(document).ready(function() {
                $(".provider-btn").click(redirectUser);
            });
            
            function redirectUser() {
                // Get redirect URL of the chosen provide.
                var redirectUrl = $(this).val();
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