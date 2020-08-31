<?php

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\Amplia\CreateOrderRequest;
use Lacuna\Amplia\CertificateKinds;
use Lacuna\Amplia\PkiBrazilCertificateParameters;

try{
    $RETURN_URL = 'http://localhost:8000/issue-cert-user-amplia/complete.php';

    // Retrieve input values from submitted form.
    $subjectName = $_POST['subjectName'];
    $cpf = $_POST['cpf'];
    $phoneNumber = $_POST['phoneNumber'];

    // Get an instance of the AmpliaClient, responsible to connect with Amplia and
    // perform the requests.
    $client = Util::getAmpliaClient();

    // Create an instance of the CreateOrderRequest class, which contains a class,
    // that inherits the CertificateParameters class. In this sample, we use a
    // PkiBrazilCertificateParameters class to emit a certificate with PKI Brazil
    // parameters.
    $createOrderRequest = new CreateOrderRequest();
    // Set the certificate authority's id. This authority will generate your
    // certificate. You can have a default CAId per application, in that case, there
    // is no need to set this parameter.
    $createOrderRequest->caId = getConfig()['amplia']['caId'];
    // Set the certificate validity. We've encapsulated to set 2 years from now.
    $createOrderRequest->validityEnd = Util::getDateYearsFromNow(2);
    // Set the kind of the certificate.
    $createOrderRequest->kind = CertificateKinds::PUBLIC_KEY;
    // Set the certificate parameters class with the desired parameters to your
    // certificate. In this sample, we use the ICP-Brazil model, and informed the
    // following fields:
    // - The subject name of the certificate;
    // - The CPF number;
    // - The phone number, used to confirm the user identity.
    $parameters = new PkiBrazilCertificateParameters();
    $parameters->name = $subjectName;
    $parameters->cpf = $cpf;
    $parameters->phoneNumber = $phoneNumber;
    $createOrderRequest->parameters = $parameters;

    // Call Amplia to create an order.
    $order = $client->createOrder($createOrderRequest);

    // After the order is create, get a redirect link to a remote page to issue
    // the certificate. We pass a return URL, to redirect the user after the
    // certificate is issued.
    $redirectLink = $client->getOrderIssueLink($order->id, $RETURN_URL);

    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <?php include '../shared/head.php' ?>
    </head>
    <body>

    <?php include '../shared/menu.php' ?>

    <div class="container content">
        <h2 class="ls-title">Issue a certificate storing the key on the user's machine with Amplia</h2>

        <div class="ls-content"></div>
    </div>

    <?php include '../shared/scripts.php' ?>

    <script>
        $(document).ready(function() {
            var timer = 3;
            $.blockUI({ message: 'You will be redirected in <span id="timer">' + timer + '</span> seconds...' });

            // Redirects after "timer" seconds.
            var intervalId = setInterval(function() {
                timer--;
                $('#timer').text(timer);

                if (timer <= 0) {
                    clearInterval(intervalId);
                    window.location.href = '<?= $redirectLink ?>';
                }
            }, 1000);
        });
    </script>
    </body>
    </html>

<?php
    } catch (Exception $e) {
        include '../shared/catch-error.php';
    }
?>