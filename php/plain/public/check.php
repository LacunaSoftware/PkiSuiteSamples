<?php

require __DIR__ . '/../vendor/autoload.php';

use Lacuna\RestPki\PadesSignatureExplorer;
use Lacuna\RestPki\StandardSignaturePolicies;

// Get document ID from query string.
$formattedCode = isset($_GET['c']) ? $_GET['c'] : null;
if (!isset($formattedCode)) {
    throw new \Exception("No code was provided");
}

// On printer-friendly-version.php, we stored the unformatted version of the verification code (without hyphens) but
// used the formatted version (with hyphens) on the printer-friendly PDF. Now, we remove the hyphen before looking it
// up.
$verificationCode = StorageMock::parseVerificationCode($formattedCode);

// Get document associated with verification code.
$fileId = StorageMock::lookupVerificationCode($verificationCode);
if ($fileId == null) {
    // Invalid code given!
    // Small delay to slow down brute-force attacks (if you want to be extra careful you might want to add a CAPTCHA to
    // the process).
    sleep(2);

    // Inform that the file was not found.
    die('File not found');
}

// Open and validate signature with Rest PKI.
$sigExplorer = new PadesSignatureExplorer(Util::getRestPkiClient());

// Set the PDF file to be inspected.
$sigExplorer->setSignatureFileFromPath(StorageMock::getDataPath($fileId));

// Specify that we want to validate the signatures in the file, not only inspect them.
$sigExplorer->validate = true;

// Accept any valid PAdES signature as long as the signer is trusted by the security context.
$sigExplorer->defaultSignaturePolicy = StandardSignaturePolicies::PADES_BASIC;

// Specify the security context. We have encapsulated choice on util.php.
$sigExplorer->securityContext = Util::getSecurityContextId();

// Call the open() method, which returns the signature file's information.
$signature = $sigExplorer->open();

?>
    <!DOCTYPE html>
    <html>
    <head>
        <?php include 'shared/head.php' ?>
    </head>
    <body>

    <?php include 'shared/menu.php' ?>

    <div class="container content">
        <div id="messagesPanel"></div>

        <h2>Check signatures on printer-friendly PDF</h2>
        <h3 class="ls-subtitle">The given file contains <?= count($signature->signers) ?> signatures:</h3>

        <div class="ls-content">
            <div id="accordion">
                <?php for ($i = 0; $i < count($signature->signers); $i++) {

                    $signer = $signature->signers[$i];
                    $collapseId = "signer_" . $i . "_collapse";
                    $headingId = "signer_" . $i . "_heading";

                    ?>
                    <div class="card">
                        <div class="card-header open-header" id="<?= $headingId ?>">
                            <a class="collapsed" role="button" data-toggle="collapse" href="#<?= $collapseId ?>" aria-expanded="true" aria-controls="<?= $collapseId ?>"><?= $signer->certificate->subjectName->commonName ?></a>
                            <?php if ($signer->validationResults != null) { ?>
                                <?php if ($signer->validationResults->isValid()) { ?>
                                    <i class="fas fa-check-circle text-success"></i>
                                <?php } else { ?>
                                    <i class="fas fa-times-circle text-danger"></i>
                                <?php } ?>
                            <?php } ?>
                        </div>
                        <div id="<?= $collapseId ?>" class="collapse" role="tabpanel" aria-labelledby="<?= $headingId ?>" data-parent="#accordion">
                            <div class="card-body">
                                <?php if ($signer->signingTime != null) { ?>
                                    <p><strong>Signing time</strong>: <?= date("d/m/Y H:i", strtotime($signer->signingTime)) ?></p>
                                <?php } ?>

                                <p><strong>Message digest</strong>: <?= $signer->messageDigest->algorithm->name . " " . strtoupper($signer->messageDigest->hexValue) ?></p>
                                <?php if ($signer->signaturePolicy != null) { ?>
                                    <p>Signature policy: <?= $signer->signaturePolicy->oid ?></p>
                                <?php } ?>

                                <p><strong>Signer information</strong>:</p>
                                <ul>
                                    <li><strong>Subject</strong>: <?= $signer->certificate->subjectName->commonName ?></li>
                                    <li><strong>Email</strong>: <?= $signer->certificate->emailAddress ?></li>
                                    <li>
                                        <strong>ICP-Brasil fields</strong>
                                        <ul>
                                            <li><strong>Tipo de certificado</strong>: <?= $signer->certificate->pkiBrazil->certificateType ?></li>
                                            <li><strong>CPF</strong>: <?= $signer->certificate->pkiBrazil->cpfFormatted ?></li>
                                            <li><strong>Responsavel</strong>: <?= $signer->certificate->pkiBrazil->responsavel ?></li>
                                            <li><strong>Empresa</strong>: <?= $signer->certificate->pkiBrazil->companyName ?></li>
                                            <li><strong>CNPJ</strong>: <?= $signer->certificate->pkiBrazil->cnpjFormatted ?></li>
                                            <li><strong>RG</strong>: <?= $signer->certificate->pkiBrazil->rgNumero . " " . $signer->certificate->pkiBrazil->rgEmissor . " " . $signer->certificate->pkiBrazil->rgEmissorUF ?></li>
                                            <li><strong>OAB</strong>: <?= $signer->certificate->pkiBrazil->oabNumero . " " . $signer->certificate->pkiBrazil->oabUF ?></li>
                                        </ul>
                                    </li>
                                </ul>
                                <?php if ($signer->validationResults != null) { ?>
                                    <label for="validations">Validation results:</label>
                                    <textarea id=" validations" style="width: 100%;" rows="20"><?= $signer->validationResults ?></textarea>
                                <?php } ?>
                            </div>
                        </div>
                    </div>

                <?php } ?>
            </div>
        </div>
    </div>

    <?php include 'shared/scripts.php' ?>

    </body>
</html>