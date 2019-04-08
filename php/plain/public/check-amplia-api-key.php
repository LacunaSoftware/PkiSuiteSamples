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

// Get Amplia configuration.
$ampliaConfig = getConfig()['amplia'];

if (!empty($ampliaConfig['apiKey']) && strpos($ampliaConfig['apiKey'], ' API KEY ') === false) {

    if (!empty($fwd)) {
        if (!empty($op)) {
            $redirectUrl = "/$rc?rc=$fwd-amplia&op=$op";
        } else {
            $redirectUrl = "/$rc?rc=$fwd-amplia";
        }
    } else {
        $redirectUrl = "/$rc-amplia";
    }

    header("Location: {$redirectUrl}", true, 302);
    exit;
}

?>
<!DOCTYPE html>
<html>
<head>
    <?php include 'head.php' ?>
</head>
<body>

<?php include 'menu.php' ?>

<div class="container content ">
    <div id="messagesPanel"></div>
    <h1 class="ls-title">Amplia's API key was not set</h1>

</div>

<?php include 'scripts.php' ?>

</body>
</html>
