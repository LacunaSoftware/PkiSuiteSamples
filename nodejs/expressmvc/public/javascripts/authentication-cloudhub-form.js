// -----------------------------------------------------------------------------
// This file contains logic for filling and validating the form used to pass
// the user's CPF to the server, which starts a CloudHub session. It is only an
// example, feel free to alter it to meet your application's needs.
// -----------------------------------------------------------------------------
var authCloudHubForm = (function () {

    // Auxiliary global variable.
    var formElements = null;

    // --------------------------------------------------------------------------
    // Initializes the form used to collect the user's CPF.
    // --------------------------------------------------------------------------
    function init(fe) {

        // Receive form parameters received as arguments.
        formElements = fe;

        // Add mask for CPF field.
        formElements.cpfField.mask('000.000.000-00', { reserve: true });

        // Add click handler for loginButton to submit form and perform
        // validations.
        formElements.loginButton.click(issue);
    }

    function issue() {

        var cpf = formElements.cpfField.val();
        if (!cpf || cpf.length === 0) {
            alert('The CPF field should be provided');
            return;
        }
    }

    return {
        init: init
    };

})();