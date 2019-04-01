<?php

?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php' ?>
</head>
<body>

<?php include '../menu.php' ?>

<div class="container content">
    <h2 class="ls-title">Issue a certificate storing the key on the user's machine with Amplia</h2>

    <div class="ls-content">
        <form id="issueForm" action="issue-cert-user-amplia/action.php" method="POST">
            <h4>ICP-Brasil Certificate</h4>

            <div class="form-group">
                <label>Subject Name</label>
                <div class="row">
                    <div class="col col-sm-4">
                        <input id="subjectNameField" name="subjectName" class="form-control" type="text" placeholder="Name" required />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>CPF</label>
                <div class="row">
                    <div class="col col-sm-2">
                        <input id="cpfField" name="cpf" class="form-control" type="text" placeholder="Nº CPF" required />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Phone Number</label>
                <div class="row">
                    <div class="col col-sm-3">
                        <input id="phoneNumberField" name="phoneNumber" type="hidden" class="form-control" />
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">+55</span>
                            </div>
                            <input id="phoneNumberInput" type="text" class="form-control" placeholder="(12) 93456-7890" required />
                        </div>
                    </div>
                </div>
            </div>

            <button id="issueButton" class="btn btn-primary">Issue Certificate</button>
        </form>
    </div>
</div>

<?php include '../scripts.php' ?>

<?php
// The file below contains the logic for filling and validating form. It is only an example, feel
// free to alter it to meet your application's needs. You can also bring the code in to the
// javascript block below if you prefer.
?>
<script src="scripts/issue-cert-form.js"></script>
<script>
    $(document).ready(function () {
        // Once the page is ready, we call the init() function on the javascript code (see issue-cert-form.js).
        issueCertForm.init({
            issueForm: $('#issueForm'),               // The form that should be submitted when the button "issueButton" is clicked.
            subjectNameField: $('#subjectNameField'), // The "subjectName" field reference.
            cpfField: $('#cpfField'),                 // The "cpf" field reference.
            phoneNumberField: $('#phoneNumberField'), // The "phoneNumber" field reference.
            phoneNumberInput: $('#phoneNumberInput'), // The "phoneNumber" input reference. This value will be treated and passe to "phoneNumber" field.
            issueButton: $('#issueButton')            // The button that initiates the issuing operation on server-side.
        });
    });
</script>

</body>
</html>
