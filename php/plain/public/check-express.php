<?php

require __DIR__ . '/../vendor/autoload.php';

use Lacuna\PkiExpress\Authentication;
use Lacuna\PkiExpress\InstallationNotFoundException;

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

// Get URL parameters.
$rc = isset($_GET['rc']) ? $_GET['rc'] : null;
$fwd = isset($_GET['fwd']) ? $_GET['fwd'] : null;
$op = isset($_GET['op']) ? $_GET['op'] : null;

$installationFound = true;
try {
    $auth = new Authentication();
    $auth->start();
} catch (InstallationNotFoundException $ex) {
    $installationFound = false;
}

if ($installationFound) {
    if (!empty($fwd)) {
        if (!empty($op)) {
            $url = "/$rc?rc=$fwd-express&op=$op";
        } else {
            $url = "/$rc?rc=$fwd-express";
        }
    } else {
        $url = "/$rc-express";
    }

    header("Location: {$url}", true, 302);
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

    <h2 class="ls-title">PKI Express is not installed</h2>

    <div class="ls-content">

    </div>
</div>

<?php include 'shared/scripts.php' ?>

</body>
</html>
