<!DOCTYPE html>
<html>
<head>
    <?php include 'head.php' ?>
</head>
<body>

<?php include 'menu.php' ?>

<div class="body-content container">
    <div id="messagesPanel"></div>
    <app-root></app-root>
</div>

<? include 'scripts.php' ?>

<script type="text/javascript">
    SampleRoutes = {
        authCert: {
            express: "/check-pki-express.php?rc=authentication-express",
            restpki: "/check-restpki-token.php?rc=authentication-restpki"
        },
        signMultiPdfServer: {
            express: '/check-pki-express.php?rc=batch-pades-signature-express',
            restpki: '/check-restpki-token.php?rc=batch-pades-signature-restpki'
        },
        signCmsServer: {
            express: '/check-pki-express.php?rc=cades-signature-express',
            restpki: '/check-restpki-token.php?rc=cades-signature-restpki'
        },
        signPdfServer: {
            express: '/check-pki-express.php?rc=pades-signature-express',
            restpki: '/check-restpki-token.php?rc=pades-signature-restpki'
        },
    };
</script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/runtime.a66f828dca56eeb90e02.js"></script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/polyfills.27ba7ccfa975df7b6881.js"></script>
<script type="text/javascript" src="https://cdn.lacunasoftware.com/main.0585c4f951b6e08dcd4d.js"></script>