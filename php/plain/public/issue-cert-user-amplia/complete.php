<!DOCTYPE html>
<html>
<head>
    <?php include '../shared/head.php' ?>
</head>
<body>

<?php include '../shared/menu.php' ?>

<div class="container content">
    <h2 class="ls-title">Issue a certificate storing the key on the user's machine with Amplia</h2>
    <h5 class="ls-subtitle">The certificate was successful issue <i class="fas fa-check-circle text-success"></i></h5>

    <div class="ls-content">

        <h3>Actions:</h3>
        <ul>
            <li><a href="/upload.php?rc=pades-signature-express">Use your certificate to sign a PDF using PKI Express</a></li>
            <li><a href="/upload.php?rc=pades-signature-restpki">Use your certificate to sign a PDF using REST PKI</a></li>
        </ul>
    </div>
</div>

<?php include '../shared/scripts.php' ?>

</body>
</html>