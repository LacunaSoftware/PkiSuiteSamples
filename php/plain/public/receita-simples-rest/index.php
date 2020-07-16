<?php

/**
 * This file initiates the generation of Receita Simples file. The form is posted 
 * to another file, receita-simples-rest.php/sign, which generate the file and 
 * start the signature.
 */
require __DIR__ . '/../../vendor/autoload.php';

// Only accepts GET requests.
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found", true, 404);
    die();
}

$ufs = array('AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 
'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO');
?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../shared/head.php' ?>
</head>
<body>

<?php include '../shared/menu.php' ?>

<div class="container content">
    <div id="messagesPanel"></div>

    <h2 class="ls-title">Receita Simples with REST PKI</h2>

    <div class="ls-content">
        <form id="signForm" action="receita-simples-rest/sign.php" method="POST">

            <div class="form-group">
                <label for="name">Doctor's Name:</label>
                <input type="text" name="name" id="name" placeholder="João da Silva" class="form-control" required/>
            </div>
            <div class="form-group">
                <label for="crm">CRM:</label>
                <input type="text" name="crm" id="crm" class="form-control" placeholder="00000000-0" required/>
            </div>
            <div class="form-group">
                <label for="crmUf">CRM UF:</label>
                <select id="crmUf" name="crmUf" class="form-control" required>
                    <?php 
                        foreach ($ufs as $value) {
                            echo '<option value="'.$value.'">'.$value.'</option>';
                        }
                    ?>
                </select>
            </div>
            <button id="signButton" type="submit" class="btn btn-primary">Generate File</button>
        </form>
    </div>
</div>

<?php include '../shared/scripts.php' ?>

</body>
</html>
