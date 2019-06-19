<?php

// Recover data from session.
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
$script = !empty($_SESSION['script']) ? $_SESSION['script'] : null;
$message = !empty($_SESSION['message']) ? $_SESSION['message'] : null;
$trace = !empty($_SESSION['trace']) ? $_SESSION['trace'] : null;
$status = !empty($_SESSION['status']) ? $_SESSION['status'] : null;
$error = !empty($_SESSION['error']) ? $_SESSION['error'] : null;
?>
<!DOCTYPE html>
<html>
<head>
    <?php include 'head.php' ?>
</head>
<body>

<?php include 'menu.php' ?>

<div class="container content">
    <div id="messagesPanel"></div>

    <h2 class="ls-title">An error has occurred</h2>
    <h5 class="ls-subtitle">on route <strong>/<?= $script?></strong></h5>

    <div class="ls-content">

        <label>Status Code</label>
        <p><?= $status ?> <? if ($error) { ?>( <?= $error ?> )<? } ?></p>

        <label>Message</label>
        <p><?= $message ?></p>

        <? if ($script) { ?>
            <label>Location</label>
            <p>On script <?= $script ?></p>
        <? } ?>

        <? if ($trace) { ?>
            <label for="stackTrace">Stack Trace</label>
            <textarea id="stackTrace"
                      rows="30"
                      style="width: 100%; border: 1px solid #ced4da; border-radius: 0.25rem; margin-bottom: 15px; word-break: break-all; resize: none;">
                <?= $trace ?>
            </textarea>
        <? } ?>
    </div>
</div>

<?php include 'scripts.php' ?>

</body>
</html>

