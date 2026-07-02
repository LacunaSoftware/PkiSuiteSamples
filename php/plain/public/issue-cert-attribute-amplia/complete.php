<?php

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\Amplia\CreateOrderRequest;
use Lacuna\Amplia\CertificateKinds;
use Lacuna\Amplia\CieCertificateParameters;
use Lacuna\Amplia\CieInstitution;

try {

    // Retrieve input values from submitted form.
    $name = $_POST['name'];
    $cpf = $_POST['cpf'];
    $eea = $_POST['eea'];
    $degree = $_POST['degree'];
    $course = $_POST['course'];
    $registrationNumber = $_POST['registrationNumber'];
    $institutionName = $_POST['institutionName'];
    $institutionCity = $_POST['institutionCity'];
    $institutionState = $_POST['institutionState'];

    // Get an instance of the AmpliaClient, responsible to connect with Amplia and
    // perform the requests.
    $client = Util::getAmpliaClient();

    // Create an instance of the CreateOrderRequest class, which contains a class,
    // that inherits the CertificateParameters class. In this sample, we use a
    // CieCertificateParameters class to emit an attribute certificate.
    $createOrderRequest = new CreateOrderRequest();
    // Set the certificate authority's id. This authority will generate your
    // certificate. Attribute certificates require a CA configured to issue this
    // kind of certificate, which is different from the CA used to issue regular
    // (public key) certificates.
    $createOrderRequest->caId = "c5882160-08d0-4c66-be63-019f13c60683";
    // Set the certificate validity. We've encapsulated to set 2 years from now.
    $createOrderRequest->validityEnd = Util::getDateYearsFromNow(2);
    // Set the kind of the certificate.
    $createOrderRequest->kind = CertificateKinds::ATTRIBUTE;
    // Set the certificate parameters class with the desired parameters to your
    // certificate. In this sample, we use the CIE model, informing the holder's
    // name, CPF, EEA and the academic information related to the attribute.
    $parameters = new CieCertificateParameters();
    $parameters->name = $name;
    $parameters->cpf = $cpf;
    $parameters->eea = $eea;
    $parameters->degree = $degree;
    $parameters->course = $course;
    $parameters->registrationNumber = $registrationNumber;

    // Set the institution responsible for the academic degree.
    $institution = new CieInstitution();
    $institution->name = $institutionName;
    $institution->city = $institutionCity;
    $institution->state = $institutionState;
    $parameters->institution = $institution;

    $createOrderRequest->parameters = $parameters;

    // Call Amplia to create an order.
    $order = $client->createOrder($createOrderRequest);

    // Call Amplia in order to issue the certificate referred by the created
    // order's id. Unlike a public key certificate, an attribute certificate has
    // no key pair of its own, so no CSR is passed.
    $cert = $client->issueCertificate($order->getId(), null);

    // At this point, you'd typically store the certificate on your database. For
    // demonstration purposes, we'll store it on a temporary folder publicly
    // accessible and render a link to it. An attribute certificate has no
    // standard file extension, so we store it as a ".ac" file.
    $fileId = StorageMock::store($cert->getContentRaw(), '.ac');

    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <?php include '../shared/head.php' ?>
    </head>
    <body>

    <?php include '../shared/menu.php' ?>

    <div class="container content">
        <h2 class="ls-title">Issue an attribute certificate storing the key on the server with Amplia</h2>
        <h5 class="ls-subtitle">The certificate was successful issued <i class="fas fa-check-circle text-success"></i></h5>

        <div class="ls-content">

            <p>Certificate Information</p>
            <ul>
                <li><strong>ID</strong> <?= $cert->id ?></li>
                <li><strong>Subject</strong> <?= $cert->subjectName->commonName ?></li>
                <li><strong>CPF</strong> <?= $cpf ?></li>
            </ul>

            <h3>Actions:</h3>
            <ul>
                <li><a href="/download?fileId=<?= $fileId ?>">Download the .AC file</a></li>
            </ul>
        </div>
    </div>

    <?php include '../shared/scripts.php' ?>

    </body>
    </html>

<?php
} catch (Exception $e) {
    include '../shared/catch-error.php';
}
?>
