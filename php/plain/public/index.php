<!DOCTYPE html>
<html>
<head>
    <?php include 'shared/head.php' ?>
    <link rel="stylesheet" href="https://cdn.lacunasoftware.com/pki-suite-samples/styles.ef46db3751d8e999.css"/>
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
        // readCert: { },
        // rsa: { },
        printerFriendlyPdf: {
            restpki: '/check-rest-token.php?rc=server-files&fwd=printer-friendly-pades&op=printerFriendly' 
        },
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
        signMultiCmsServer: {
            express: '/check-express.php?rc=batch-cades-signature'
        },
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
        signXml: {
            restpki: '/check-rest-token.php?rc=xml-doc-signature-rest'
        },
        signPdfServer: {
            express: '/check-express.php?rc=server-files&fwd=pades-signature&op=signPdf',
            restpki: '/check-rest-token.php?rc=server-files&fwd=pades-signature&op=signPdf'
        },
        signPdfUser: {
            express: '/check-express.php?rc=upload.php&fwd=pades-signature',
            restpki: '/check-rest-token.php?rc=upload.php&fwd=pades-signature'
        },
        signPdfCloudhubUser: {
            restpki: "/check-rest-token.php?rc=upload.php&fwd=pades-signature-cloudhub&op=signPdf"
        },
         signPdfCloudhubServer: {
            restpki: "/check-rest-token.php?rc=server-files&fwd=pades-signature-cloudhub&op=signPdf"
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
        signXmlServer: {
            restpki: '/check-rest-token.php?rc=xml-signature'
        },
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
            express: '/check-express.php?rc=upload.php&fwd=open-xml',
            restpki: '/check-rest-token.php?rc=upload.php&fwd=open-xml'
        }
    };
</script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/pki-suite-samples/runtime.29926b5c8448d756.js"></script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/pki-suite-samples/polyfills.68fb853868236af9.js"></script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/pki-suite-samples/main.5a253d735bf0e472.js"></script>

</body>
</html>
