<?php
/*
 * This file submits a Xml file to Rest PKI for inspection and renders the results.
 */

require __DIR__ . '../../vendor/autoload.php';

use Lacuna\RestPki\StandardSignaturePolicies;
use Lacuna\RestPki\XmlSignatureExplorer;

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Verify if the fileId correspond to an existing file on our StorageMock class.
$fileId = isset($_GET['fileId']) ? $_GET['fileId'] : null;
if (!StorageMock::exists($fileId)) {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get an instance of the XmlSignatureExplorer class, used to open/validate XML signatures
$sigExplorer = new XmlSignatureExplorer(Util::getRestPkiClient());

// Set the XML file
$sigExplorer->setSignatureFileFromPath(StorageMock::getDataPath($fileId));

// Specify that we want to validate the signatures in the file, not only inspect them
$sigExplorer->validate = true;

// Accept any valid XmlDSig signature as long as the signer has an ICP-Brasil certificate as long as the signer is
// trusted by the security context.
$sigExplorer->defaultSignaturePolicy = StandardSignaturePolicies::XML_DSIG_BASIC;

// Specify the security context. We have encapsulated the security context choice on util.php.
$sigExplorer->securityContext = Util::getSecurityContextId();

// Call the open() method, which returns the signature file's information
$signatures = $sigExplorer->open();

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

    <h2 class="ls-title">Open/validate signatures on an existing XML with REST PKI</h2>
    <h3 class="ls-subtitle">The given file contains <?= count($signatures) ?> signatures:</h3>

    <div class="ls-content">
        <div id="accordion">
            <?php for ($i = 0; $i < count($signatures); $i++) {

                $signature = $signatures[$i];
                $collapseId = "signer_" . $i . "_collapse";
                $headingId = "signer_" . $i . "_heading";

                ?>
                <div class="card">
                    <div class="card-header open-header" id="<?= $headingId ?>">
                        <a class="collapsed" role="button" data-toggle="collapse" href="#<?= $collapseId ?>" aria-expanded="true" aria-controls="<?= $collapseId ?>"><?= $signature->certificate->subject->commonName ?></a>
                        <?php if ($signature->validationResults != null) { ?>
                            <span>&nbsp;</span>
                            <?php if ($signature->validationResults->isValid()) { ?>
                                <i class="fas fa-check-circle text-success"></i>
                            <?php } else { ?>
                                <i class="fas fa-times-circle text-danger"></i>
                            <?php } ?>
                        <?php } ?>
                    </div>
                    <div id="<?= $collapseId ?>" class="collapse" role="tabpanel" aria-labelledby="<?= $headingId ?>" data-parent="#accordion">
                        <div class="card-body">
                            <?php if ($signature->signingTime != null) { ?>
                                <p><strong>Signing time</strong>: <?= date("d/m/Y H:i", strtotime($signature->signingTime)) ?></p>
                            <?php } ?>

                            <p><strong>Message digest</strong>: <?= $signature->messageDigest->algorithm->name . " " . strtoupper($signature->messageDigest->hexValue) ?></p>
                            <?php if ($signature->signaturePolicy != null) { ?>
                                <p>Signature policy: <?= $signature->signaturePolicy->oid ?></p>
                            <?php } ?>

                            <p><strong>Signer information</strong>:</p>
                            <ul>
                                <li><strong>Subject</strong>: <?= $signature->certificate->subjectName->commonName ?></li>
                                <li><strong>Email</strong>: <?= $signature->certificate->emailAddress ?></li>
                                <li>
                                    <strong>ICP-Brasil fields</strong>
                                    <ul>
                                        <li><strong>Tipo de certificado</strong>: <?= $signature->certificate->pkiBrazil->certificateType ?></li>
                                        <li><strong>CPF</strong>: <?= $signature->certificate->pkiBrazil->cpfFormatted ?></li>
                                        <li><strong>Responsavel</strong>: <?= $signature->certificate->pkiBrazil->responsavel ?></li>
                                        <li><strong>Empresa</strong>: <?= $signature->certificate->pkiBrazil->companyName ?></li>
                                        <li><strong>CNPJ</strong>: <?= $signature->certificate->pkiBrazil->cnpjFormatted ?></li>
                                        <li><strong>RG</strong>: <?= $signature->certificate->pkiBrazil->rgNumero . " " . $signature->certificate->pkiBrazil->rgEmissor . " " . $signature->certificate->pkiBrazil->rgEmissorUF ?></li>
                                        <li><strong>OAB</strong>: <?= $signature->certificate->pkiBrazil->oabNumero . " " . $signature->certificate->pkiBrazil->oabUF ?></li>
                                    </ul>
                                </li>
                            </ul>
                            <?php if ($signature->validationResults != null) { ?>
                                <label for="validations">Validation results:
                                    <textarea id=" validations" style="width: 100%;" rows="20"><?= $signature->validationResults ?></textarea>
                                </label>
                            <?php } ?>
                        </div>
                    </div>
                </div>

            <?php } ?>
        </div>
    </div>
</div>

</body>
</html>
