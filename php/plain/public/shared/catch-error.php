<?php
$msg = $e->getMessage();
$errorStr = $e->__toString();
$trace = str_replace('               exception ', 'exception ', $errorStr);
?>

<!DOCTYPE html>
<html>
<head>
    <?php include '../shared/head.php' ?>
</head>
<body>
<?php include '../shared/menu.php' ?>
    <div class="container">
        <h3>An error occurred: <?= $msg ?></h3>
        <div class="ls-content">
            <textarea rows="30" class="stack-trace"><?= $trace ?></textarea>
        </div>
    </div>
</body>
</html>