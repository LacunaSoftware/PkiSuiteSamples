<?php

require __DIR__ . '/../../vendor/autoload.php';

use Lacuna\Amplia\CreateOrderRequest;
use Lacuna\Amplia\CertificateKinds;
use Lacuna\Amplia\PkiBrazilCertificateParameters;
use Lacuna\PkiExpress\KeyGenerator;
use Lacuna\PkiExpress\SupportedKeySizes;
use Lacuna\PkiExpress\KeyFormats;

try{

    // Retrieve input values from submitted form.
    $subjectName = $_POST['subjectName'];
    $cpf = $_POST['cpf'];

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
    $createOrderRequest->parameters = $parameters;

    // Call Amplia to create an order.
    $order = $client->createOrder($createOrderRequest);

    // Get an instance of the KeyGenerator class, responsible for generating a
    // private key and the corresponding CSR.
    $keyGenerator = new KeyGenerator();

    // Set key size as 2048 (Available size: 1024, 2048, and 4096)
    $keyGenerator->keySize = SupportedKeySizes::S2048;
    $keyGenerator->keyFormat = KeyFormats::JSON;
    // Set the option to generate the CSR value.
    $keyGenerator->genCsr = true;

    // Generate private key and CSR.
    $genKey = $keyGenerator->generate();

    // Call Amplia in order to issue the certificate referred by the created
    // order's id and passing the generate CSR.
    $cert = $client->issueCertificate($order->getId(), $genKey->csr);

    // Store the key encrypted using a local key.
    StorageMock::storeKey($genKey->key, ".json", $cert->id);

    // Store certificate.
    StorageMock::storeKey($cert->getContentRaw(), ".cer", $cert->id);

    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <?php include '../shared/head.php' ?>
    </head>
    <body>

    <?php include '../shared/menu.php' ?>

    <div class="container content">
        <h2 class="ls-title">Issue a certificate storing the key on the server with Amplia</h2>
        <h5 class="ls-subtitle">The certificate was successful issued <i class="fas fa-check-circle text-success"></i></h5>

        <div class="ls-content">

            <p>Certificate Information</p>
            <ul>
                <li><strong>ID</strong> <?= $cert->id ?></li>
                <li><strong>Subject</strong> <?= $cert->subjectName->commonName ?></li>
                <li><strong>CPF</strong> <?= $cert->parameters->cpf ?></li>
            </ul>

            <h3>Actions:</h3>
            <ul>
                <li><a href="/download/cert.php?fileId=<?= $cert->id ?>">Download the .CER file</a></li>
                <li><a href="/upload.php?rc=pades-server-key-express&certId=<?= $cert->id ?>">Use the certificate to sign a PDF using PKI Express</a></li>
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