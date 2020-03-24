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

// Get REST PKI configuration.
$restPkiConfig = getConfig()['restPki'];

if (!empty($restPkiConfig['accessToken']) && strpos($restPkiConfig['accessToken'], ' ACCESS TOKEN ') === false) {

    if (!empty($fwd)) {
        if (!empty($op)) {
            $redirectUrl = "/$rc?rc=$fwd-rest&op=$op";
        } else {
            $redirectUrl = "/$rc?rc=$fwd-rest";
        }
    } else {
        $redirectUrl = "/$rc-rest";
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

    <h2 class="ls-title">REST PKI's access token was not set</h2>

    <div class="ls-content">

    </div>
</div>

<?php include 'shared/scripts.php' ?>

</body>
</html>
