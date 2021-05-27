<!DOCTYPE html>
<html>
<head>
    <?php include 'shared/head.php' ?>
    <link rel="stylesheet" href="https://cdn.lacunasoftware.com/pki-suite-samples/styles.c87e17c78cd2c969b0f3.css"/>
</head>
<body>

<?php include 'shared/menu.php' ?>

<div class="container content">
    <div id="messagesPanel"></div>
    <app-root></app-root>
</div>

<?php include 'shared/scripts.php' ?>
<script type="text/javascript">
    SampleRoutes = {
        authCert: {
            express: '/check-express.php?rc=authentication',
            restpki: '/check-rest-token.php?rc=authentication'
        },
        cosignCms: {
            express: '/check-express.php?rc=server-files&fwd=cades-signature&op=cosignCms',
            restpki: '/check-rest-token.php?rc=server-files&fwd=cades-signature&op=cosignCms'
        },
        cosignPdf: {
            express: '/check-express.php?rc=server-files&fwd=pades-signature&op=cosignPdf',
            restpki: '/check-rest-token.php?rc=server-files&fwd=pades-signature&op=cosignPdf'
        },
        issueCertServer: {
            amplia: '/check-amplia-key.php?rc=issue-cert-server'
        },
        issueCertUser: {
            amplia: '/check-amplia-key.php?rc=issue-cert-user'
        },
        // listCert: { },
        // mergeCmsSigs: { },
        // printerFriendlyCms: { },
        // printerFriendlyPdf: { },
        // readCert: { },
        // rsa: { },
        signCmsServer: {
            express: '/check-express.php?rc=server-files&fwd=cades-signature&op=signCms',
            restpki: '/check-rest-token.php?rc=server-files&fwd=cades-signature&op=signCms'
        },
        signCmsUser: {
            express: '/check-express.php?rc=upload.php&fwd=cades-signature',
            restpki: '/check-rest-token.php?rc=upload.php&fwd=cades-signature'
        },
        signCmsServerKey: {
            express: '/check-express.php?rc=upload.php&fwd=cades-server-key'
        },
        signCod: { 
            express: '/check-express.php?rc=xml-cod-signature'
        },
        // signMultiCmsServer: { },
        // signMultiCmsUser: { },
        signMultiPdfServer: {
            express: '/check-express.php?rc=batch-pades-signature',
            restpki: '/check-rest-token.php?rc=batch-pades-signature'
        },
        // signMultiPdfUser: { },
        signNfe: {
            express: '/check-express.php?rc=xml-nfe-signature',
            restpki: '/check-rest-token.php?rc=xml-nfe-signature'
        },
        signPdfServer: {
            express: '/check-express.php?rc=server-files&fwd=pades-signature&op=signPdf',
            restpki: '/check-rest-token.php?rc=server-files&fwd=pades-signature&op=signPdf'
        },
        signPdfUser: {
            express: '/check-express.php?rc=upload.php&fwd=pades-signature',
            restpki: '/check-rest-token.php?rc=upload.php&fwd=pades-signature'
        },
        signPdfServerKey: {
            express: '/check-express.php?rc=upload.php&fwd=pades-server-key'
        },
        signPdfCloudPwd: {
            express: '/check-express.php?rc=upload.php&fwd=pades-cloud-pwd'
        },
        signPdfCloudOAuth: {
            express: '/check-express.php?rc=upload.php&fwd=pades-cloud-oauth'
        },
        // signXmlServer: { },
        // signXmlServerKey: { },
        // signaturePackage: { },
        validateCmsSig: {
            express: '/check-express.php?rc=upload.php&fwd=open-cades',
            restpki: '/check-rest-token.php?rc=upload.php&fwd=open-cades'
        },
        validatePdfSig: {
            express: '/check-express.php?rc=upload.php&fwd=open-pades',
            restpki: '/check-rest-token.php?rc=upload.php&fwd=open-pades'
        },
        validateXmlSig: {
            // express: '',
            restpki: '/check-rest-token.php?rc=upload.php&fwd=open-xml'
        }
    };
</script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/pki-suite-samples/runtime.a66f828dca56eeb90e02.js"></script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/pki-suite-samples/polyfills.4fad4f57426952c5568b.js"></script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/pki-suite-samples/main.2f29231baf2b86312281.js"></script>

</body>
</html>