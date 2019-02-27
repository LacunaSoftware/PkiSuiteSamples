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
			var options = {
				onKeyPress: function(telephone, e, field, options) {
					var masks = ['(00) 00000-0000', '(00) 0000-0000'];
					var mask = (telephone.length > 13) ? masks[0] : masks[1];
					formElements.phoneNumberInput.mask(mask, options);
				}
			};
			formElements.phoneNumberInput.mask('(00) 00000-0000', options);
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