<!DOCTYPE html>
<html>
<head>
    <?php include '../shared/head.php' ?>
</head>
<body>

<?php include '../shared/menu.php' ?>

<div class="container content">
    <h2 class="ls-title">Issue an attribute certificate storing the key on the server with Amplia</h2>

    <div class="ls-content">
        <form id="issueForm" action="issue-cert-attribute-amplia/complete.php" method="POST">
            <h4>ICP-Brasil Certificate</h4>

            <div class="form-group">
                <label>Name</label>
                <div class="row">
                    <div class="col col-sm-4">
                        <input id="nameField" name="name" class="form-control" type="text" placeholder="Name" required />
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
                <label>EEA</label>
                <div class="row">
                    <div class="col col-sm-2">
                        <input id="eeaField" name="eea" class="form-control" type="text" placeholder="EEA" required />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Degree</label>
                <div class="row">
                    <div class="col col-sm-2">
                        <input id="degreeField" name="degree" class="form-control" type="text" placeholder="Degree" required />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Course</label>
                <div class="row">
                    <div class="col col-sm-3">
                        <input id="courseField" name="course" class="form-control" type="text" placeholder="Course" required />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Registration Number</label>
                <div class="row">
                    <div class="col col-sm-2">
                        <input id="registrationNumberField" name="registrationNumber" class="form-control" type="text" placeholder="Number" required />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Institution Name</label>
                <div class="row">
                    <div class="col col-sm-4">
                        <input id="institutionNameField" name="institutionName" class="form-control" type="text" placeholder="Institution name" required />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Institution City</label>
                <div class="row">
                    <div class="col col-sm-3">
                        <input id="institutionCityField" name="institutionCity" class="form-control" type="text" placeholder="Institution city" required />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Institution State</label>
                <div class="row">
                    <div class="col col-sm-2">
                        <input id="institutionStateField" name="institutionState" class="form-control" type="text" placeholder="Institution state" required />
                    </div>
                </div>
            </div>

            <button id="issueButton" class="btn btn-primary">Issue Certificate</button>
        </form>
    </div>
</div>

<?php include '../shared/scripts.php' ?>

<script>
    $(document).ready(function () {
        // Add mask for CPF field, same as done on the other Amplia samples (see
        // scripts/issue-cert-form.js).
        $('#cpfField').mask('000.000.000-00', {reserve: true});

        // Fill fields with example values, feel free to alter it to meet your
        // application's needs.
        $('#nameField').val('Pierre de Fermat');
        $('#cpfField').val('673.644.483-73');
        $('#eeaField').val('12345');
        $('#degreeField').val('Bachelor');
        $('#courseField').val('Mathematics');
        $('#registrationNumberField').val('2024001');
        $('#institutionNameField').val('University of Toulouse');
        $('#institutionCityField').val('Toulouse');
        $('#institutionStateField').val('Occitanie');
    });
</script>

</body>
</html>
