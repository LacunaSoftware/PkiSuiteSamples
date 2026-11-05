// -----------------------------------------------------------------------------
// This file contains logic for filling and validating the form to be used to
// pass the certificate information to server to communicate with Amplia. It is
// only an example, feel free to alter it to meet your application's needs.
// -----------------------------------------------------------------------------
var issueCertForm = (function () {

    // Auxiliary global variable.
    var formElements = null;

    // --------------------------------------------------------------------------
    // Initializes the form used to collect the certificate information to be
    // generated.
    // --------------------------------------------------------------------------
    function init(fe) {

        // Receive from parameters received as arguments.
        formElements = fe;

        // Add mask for CPF field.
        formElements.cpfField.mask('000.000.000-00', {reserve: true});

        // Add mask and internationalization for phoneNumber field.
        if (formElements.phoneNumberField && formElements.phoneNumberInput) {
            // A landline has 10 digits, (00) 0000-0000, and a mobile number 11, (00) 00000-0000.
            // The mask starts with an optional last digit (the 9), so the user can type the 11th
            // digit, and switches to the mobile mask once there are 11 digits.
            var phoneMask = function (telephone) {
                return telephone.replace(/\D/g, '').length > 10 ? '(00) 00000-0000' : '(00) 0000-00009';
            };
            var options = {
                onKeyPress: function(telephone, e, field, options) {
                    var mask = phoneMask(telephone);
                    if (formElements.phoneNumberInput.data('mask').mask !== mask) {
                        formElements.phoneNumberInput.mask(mask, options);
                        // jquery.mask fills the new mask's caret map only on keydown, so an input event
                        // without a keydown first (a paste on a phone, an autofill) would throw. Firing
                        // keydown once fills it. See
                        // https://github.com/igorescobar/jQuery-Mask-Plugin/issues/751
                        formElements.phoneNumberInput.trigger('keydown');
                    }
                }
            };
            formElements.phoneNumberInput.mask(phoneMask(''), options);
        }

        // Add click handler for issueButton to submit form and perform
        // validations.
        formElements.issueButton.click(issue);

        // Generate random value for SubjectName and CPF fields.
        formElements.subjectNameField.val('Pierre de Fermat');
        formElements.cpfField.val('673.644.483-73');
    }

    function issue() {

        var subjectName = formElements.subjectNameField.val();
        if (!subjectName || subjectName.length === 0) {
            alert('The subject name should be informed');
            return;
        }

        var cpf = formElements.cpfField.val();
        if (!cpf || cpf.length === 0) {
            alert('The CPF field should be provided');
            return;
        }

        if (formElements.phoneNumberField && formElements.phoneNumberInput) {
            var telephone = formElements.phoneNumberInput.val();
            if (!telephone || telephone.length < 14 || telephone.length > 15) {
                alert('The telephone should be provided');
            }


            if (telephone.length === 15 || telephone.length === 14) {
                var formattedTelephone = '+55';
                var regex = /^\(([0-9]{2})\) ([0-9]{4,5})-([0-9]{4})/;
                var match = regex.exec(telephone);
                formattedTelephone += match[1];
                formattedTelephone += match[2];
                formattedTelephone += match[3];
                formElements.phoneNumberField.val(formattedTelephone);
            }
        }
    }

    return {
        init: init
    };

})();