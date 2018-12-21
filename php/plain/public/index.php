<!DOCTYPE html>
<html>
<head>
    <?php include 'head.php' ?>
    <link rel="stylesheet" href="https://cdn.lacunasoftware.com/pki-suite-samples/styles.c87e17c78cd2c969b0f3.css"/>
</head>
<body>

<?php include 'menu.php' ?>

<div class="body-content container">
    <div id="messagesPanel"></div>
    <app-root></app-root>
</div>

<?php include 'scripts.php' ?>

<script type="text/javascript">
    SampleRoutes = {
        authCert: {
            express: '/check-pki-express.php?rc=authentication',
            restpki: '/check-restpki-token.php?rc=authentication'
        },
        // cosignCms: {
        //     express: '/check-pki-express.php?rc=server-files&fwd=cades-signature&op=cosignCms',
        //     restpki: '/check-restpki-token.php?rc=server-files&fwd=cades-signature&op=cosignCms'
        // },
        // cosignPdf: {
        //     express: '/check-pki-express.php?rc=server-files&fwd=pades-signature&op=cosignPdf',
        //     restpki: '/check-restpki-token.php?rc=server-files&fwd=pades-signature&op=cosignPdf'
        // },
        // issueCertServer: { },
        // issueCertUser: { },
        // listCert: { },
        // mergeCmsSigs: { },
        // printerFriendlyCms: { },
        // printerFriendlyPdf: { },
        // readCert: { },
        // rsa: { },
        // signCmsServer: {
        //     express: '/check-pki-express.php?rc=server-files&fwd=cades-signature&op=signCms',
        //     restpki: '/check-restpki-token.php?rc=server-files&fwd=cades-signature&op=signCms'
        // },
        signCmsUser: {
            express: '/check-pki-express.php?rc=upload.php&fwd=cades-signature',
            restpki: '/check-restpki-token.php?rc=upload.php&fwd=cades-signature'
        },
        // signCmsServerKey: { },
        // signCod: { },
        // signMultiCmsServer: { },
        // signMultiCmsUser: { },
        signMultiPdfServer: {
            express: '/check-pki-express.php?rc=batch-pades-signature',
            restpki: '/check-restpki-token.php?rc=batch-pades-signature'
        },
        // signMultiPdfUser: { },
        // signNfe: { },
        // signPdfServer: {
        //     express: '/check-pki-express.php?rc=server-files&fwd=pades-signature&op=signPdf',
        //     restpki: '/check-restpki-token.php?rc=server-files&fwd=pades-signature&op=signPdf'
        // },
        signPdfUser: {
            express: '/check-pki-express.php?rc=upload.php&fwd=pades-signature',
            restpki: '/check-restpki-token.php?rc=upload.php&fwd=pades-signature'
        }
        // signPdfServerKey: { },
        // signXmlServer: { },
        // signXmlServerKey: { },
        // signaturePackage: { },
        // validateCmsSig: { },
        // validatePdfSig: { },
        // validateXmlSig: { }
    };
</script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/pki-suite-samples/runtime.a66f828dca56eeb90e02.js"></script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/pki-suite-samples/polyfills.27ba7ccfa975df7b6881.js"></script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/pki-suite-samples/main.2f92b47836100959fd77.js"></script>