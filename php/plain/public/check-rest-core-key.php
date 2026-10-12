<?php

require __DIR__ . '/../vendor/autoload.php';

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// The "rc" parameter is necessary.
if (empty($_GET['rc'])) {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get URL parameters
$rc = isset($_GET['rc']) ? $_GET['rc'] : null;
$fwd = isset($_GET['fwd']) ? $_GET['fwd'] : null;
$op = isset($_GET['op']) ? $_GET['op'] : null;

// Get REST PKI Core configuration.
$restPkiCoreConfig = getConfig()['restPkiNg'];

if (!empty($restPkiCoreConfig['apiKey']) && strpos($restPkiCoreConfig['apiKey'], ' API KEY ') === false) {

    if (!empty($fwd)) {
        if (!empty($op)) {
            $redirectUrl = "/$rc?rc=$fwd-rest-core&op=$op";
        } else {
            $redirectUrl = "/$rc?rc=$fwd-rest-core";
        }
    } else {
        $redirectUrl = "/$rc-rest-core";
    }

    header("Location: {$redirectUrl}", true, 302);
    exit;
}

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

    <h2 class="ls-title">REST PKI Core's API key was not set</h2>

    <div class="ls-content">
        <p>
            To run this sample, generate an API key on REST PKI Core and paste it on the
            <code>restPkiNg</code> section of the file <code>config.php</code>.
        </p>
    </div>
</div>

<?php include 'shared/scripts.php' ?>

</body>
</html>
